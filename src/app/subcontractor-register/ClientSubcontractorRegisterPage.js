'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { uploadFiles } from '@/lib/uploadFiles'
import {
    validateSelectedFiles,
    MAX_FILE_SIZE_MB,
    MAX_TOTAL_UPLOAD_MB,
} from '@/lib/fileValidation'

const acceptedFileTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png'

const singleUploadFields = [
    { key: 'public_liability_insurance', label: 'Public Liability Insurance' },
    { key: 'employers_liability_insurance', label: 'Employers Liability Insurance' },
    { key: 'git_insurance', label: 'Goods in Transit Insurance' },
    { key: 'motor_fleet_insurance', label: 'Motor / Fleet Insurance' },
    { key: 'operator_licence_document', label: 'Operator Licence (O Licence)' },
    { key: 'euro_community_licence', label: 'Euro Community Licence' },
    { key: 'waste_carrier_licence', label: 'Waste Carrier Licence' },
]

const multiUploadFields = [
    { key: 'adr_certificates', label: 'ADR Certificates' },
    { key: 'driver_cpc_certificates', label: 'Driver CPC Certificates' },
    { key: 'fors_accreditation', label: 'FORS / Accreditation Documents' },
]

function formatFileSize(bytes) {
    if (!bytes) return '0 MB'
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function UploadCard({
    label,
    inputName,
    multiple = false,
    files,
    onChoose,
    onRemove,
    inputRef,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <input
                    ref={inputRef}
                    type="file"
                    name={inputName}
                    multiple={multiple}
                    accept={acceptedFileTypes}
                    onChange={onChoose}
                    className="hidden"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                        {multiple ? 'Choose Files' : 'Choose File'}
                    </button>

                    <span className="text-sm text-gray-500">
                        {multiple ? 'Multiple files allowed' : 'Single file upload'}
                    </span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                    Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                </p>

                {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                            <div
                                key={`${file.name}-${file.size}-${file.lastModified}`}
                                className="flex items-center justify-between rounded-lg border bg-white px-3 py-2"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-800">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    className="ml-4 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ClientSubcontractorRegisterPage() {
    const router = useRouter()
    const inputRefs = useRef({})
    const [uploadFilesState, setUploadFilesState] = useState(() => {
        const initialState = {}

        for (const field of singleUploadFields) {
            initialState[field.key] = []
        }

        for (const field of multiUploadFields) {
            initialState[field.key] = []
        }

        return initialState
    })
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [fileError, setFileError] = useState('')

    const updateFiles = (fieldKey, multiple, event) => {
        const selectedFiles = Array.from(event.target.files || [])

        if (selectedFiles.length === 0) {
            return
        }

        setUploadFilesState((prev) => {
            const existingFiles = prev[fieldKey] || []
            const existingKeys = new Set(
                existingFiles.map(
                    (file) => `${file.name}-${file.size}-${file.lastModified}`
                )
            )

            const dedupedNewFiles = selectedFiles.filter((file) => {
                const key = `${file.name}-${file.size}-${file.lastModified}`
                return !existingKeys.has(key)
            })

            const candidateFiles = multiple
                ? [...existingFiles, ...dedupedNewFiles]
                : dedupedNewFiles.slice(0, 1)

            const otherFiles = Object.entries(prev)
                .filter(([key]) => key !== fieldKey)
                .flatMap(([, files]) => files)

            const validation = validateSelectedFiles(candidateFiles, otherFiles)

            if (!validation.ok) {
                setFileError(validation.message)
                return prev
            }

            setFileError('')

            return {
                ...prev,
                [fieldKey]: candidateFiles,
            }
        })

        event.target.value = ''
    }

    const removeFile = (fieldKey, indexToRemove) => {
        setUploadFilesState((prev) => ({
            ...prev,
            [fieldKey]: prev[fieldKey].filter((_, index) => index !== indexToRemove),
        }))
        setFileError('')
    }

    const getRef = (fieldKey) => {
        if (!inputRefs.current[fieldKey]) {
            inputRefs.current[fieldKey] = { current: null }
        }

        return {
            get current() {
                return inputRefs.current[fieldKey].current
            },
            set current(value) {
                inputRefs.current[fieldKey].current = value
            },
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        setErrorMessage('')

        try {
            const form = event.currentTarget
            const formData = new FormData(form)

            const uploadedFiles = {}

            for (const [fieldKey, files] of Object.entries(uploadFilesState)) {
                if (!files.length) {
                    continue
                }

                uploadedFiles[fieldKey] = await uploadFiles(
                    files,
                    'subcontractor-documents',
                    `registrations/${Date.now()}/${fieldKey}`
                )
            }

            const fileUrls = {}
            const fileNames = {}

            Object.entries(uploadedFiles).forEach(([key, value]) => {
                fileUrls[key] = value.map((file) => file.path)
                fileNames[key] = value.map((file) => file.name)
            })

            const { error } = await supabase
                .from('subcontractor_registrations')
                .insert({
                    company_name: formData.get('company_name')?.toString() || '',
                    trading_name: formData.get('trading_name')?.toString() || '',
                    company_number: formData.get('company_number')?.toString() || '',
                    vat_number: formData.get('vat_number')?.toString() || '',
                    years_trading: formData.get('years_trading')?.toString() || '',
                    website: formData.get('website')?.toString() || '',

                    contact_name: formData.get('contact_name')?.toString() || '',
                    contact_position: formData.get('position')?.toString() || '',
                    email: formData.get('email')?.toString() || '',
                    phone: formData.get('phone')?.toString() || '',
                    mobile: formData.get('mobile')?.toString() || '',
                    out_of_hours_contact:
                        formData.get('out_of_hours_contact')?.toString() || '',

                    address_line_1: formData.get('address_line_1')?.toString() || '',
                    address_line_2: formData.get('address_line_2')?.toString() || '',
                    city: formData.get('city')?.toString() || '',
                    county: formData.get('county')?.toString() || '',
                    postcode: formData.get('postcode')?.toString() || '',
                    country: formData.get('country')?.toString() || '',

                    subcontractor_type:
                        formData.get('subcontractor_type')?.toString() || '',
                    operating_area: formData.get('operating_area')?.toString() || '',
                    traffic_area: formData.get('traffic_area')?.toString() || '',
                    operator_licence_number:
                        formData.get('operator_licence_number')?.toString() || '',
                    max_payload: formData.get('max_payload')?.toString() || '',
                    fleet_size: formData.get('fleet_size')?.toString() || '',

                    vehicle_types: formData.get('vehicle_types')?.toString() || '',
                    equipment: formData.get('equipment')?.toString() || '',

                    adr_classes: formData.get('adr_classes')?.toString() || '',
                    adr_certifications:
                        formData.get('adr_certifications')?.toString() || '',

                    number_of_drivers:
                        formData.get('number_of_drivers')?.toString() || '',
                    driver_cpc_status:
                        formData.get('driver_cpc_status')?.toString() || '',
                    adr_trained_drivers:
                        formData.get('adr_trained_drivers')?.toString() || '',
                    dbs_checked: formData.get('dbs_checked')?.toString() || '',
                    staffing_notes: formData.get('staffing_notes')?.toString() || '',

                    goods_in_transit:
                        formData.get('goods_in_transit')?.toString() || '',
                    public_liability:
                        formData.get('public_liability')?.toString() || '',
                    employers_liability:
                        formData.get('employers_liability')?.toString() || '',
                    motor_insurance:
                        formData.get('motor_insurance')?.toString() || '',
                    insurance_expiry:
                        formData.get('insurance_expiry')?.toString() || '',
                    iso_accreditations:
                        formData.get('iso_accreditations')?.toString() || '',
                    compliance_notes:
                        formData.get('compliance_notes')?.toString() || '',

                    collection_areas:
                        formData.get('collection_areas')?.toString() || '',
                    delivery_areas: formData.get('delivery_areas')?.toString() || '',
                    availability: formData.get('availability')?.toString() || '',
                    lead_time: formData.get('lead_time')?.toString() || '',

                    references_text: formData.get('references')?.toString() || '',
                    additional_information:
                        formData.get('additional_information')?.toString() || '',

                    declaration: formData.get('declaration') === 'on',

                    file_urls: fileUrls,
                    file_names: fileNames,
                })

            if (error) {
                throw error
            }

            setUploadFilesState(() => {
                const initialState = {}

                for (const field of singleUploadFields) {
                    initialState[field.key] = []
                }

                for (const field of multiUploadFields) {
                    initialState[field.key] = []
                }

                return initialState
            })

            setFileError('')
            form.reset()
            router.push('/thank-you')
        } catch (error) {
            console.error(error)
            setErrorMessage('Failed to submit registration. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-5xl">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Sub Contractor Register
                    </h1>
                    <p className="mt-3 text-gray-600">
                        Complete the form below to register as an ADR courier, fleet
                        operator, or HGV subcontractor.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-2xl bg-white p-8 shadow-md"
                >
                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            Company Details
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <input
                                name="company_name"
                                required
                                placeholder="Company Name"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="trading_name"
                                placeholder="Trading Name"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="company_number"
                                placeholder="Company Registration Number"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="vat_number"
                                placeholder="VAT Number"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="years_trading"
                                placeholder="Years Trading"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="website"
                                placeholder="Website"
                                className="rounded-lg border p-3"
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            Primary Contact
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <input
                                name="contact_name"
                                required
                                placeholder="Contact Name"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="position"
                                placeholder="Position"
                                className="rounded-lg border p-3"
                            />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Email Address"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="phone"
                                required
                                placeholder="Phone Number"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="mobile"
                                placeholder="Mobile Number"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="out_of_hours_contact"
                                placeholder="Out of Hours Contact"
                                className="rounded-lg border p-3"
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            Business Address
                        </h2>
                        <div className="grid gap-4">
                            <input
                                name="address_line_1"
                                required
                                placeholder="Address Line 1"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="address_line_2"
                                placeholder="Address Line 2"
                                className="rounded-lg border p-3"
                            />
                            <div className="grid gap-4 md:grid-cols-3">
                                <input
                                    name="city"
                                    required
                                    placeholder="Town / City"
                                    className="rounded-lg border p-3"
                                />
                                <input
                                    name="county"
                                    placeholder="County"
                                    className="rounded-lg border p-3"
                                />
                                <input
                                    name="postcode"
                                    required
                                    placeholder="Postcode"
                                    className="rounded-lg border p-3"
                                />
                            </div>
                            <input
                                name="country"
                                placeholder="Country"
                                className="rounded-lg border p-3"
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            Operating Profile
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <select
                                name="subcontractor_type"
                                required
                                className="rounded-lg border p-3"
                            >
                                <option value="">Select Subcontractor Type</option>
                                <option value="ADR Courier">ADR Courier</option>
                                <option value="Fleet Operator">Fleet Operator</option>
                                <option value="HGV Operator">HGV Operator</option>
                                <option value="Owner Driver">Owner Driver</option>
                                <option value="Van Operator">Van Operator</option>
                            </select>

                            <select
                                name="operating_area"
                                required
                                className="rounded-lg border p-3"
                            >
                                <option value="">Select Operating Area</option>
                                <option value="UK">UK</option>
                                <option value="Europe">Europe</option>
                                <option value="UK and Europe">UK and Europe</option>
                            </select>

                            <input
                                name="traffic_area"
                                placeholder="Traffic Area / O-Licence Region"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="operator_licence_number"
                                placeholder="Operator Licence Number"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="max_payload"
                                placeholder="Maximum Payload"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="fleet_size"
                                placeholder="Fleet Size"
                                className="rounded-lg border p-3"
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            Vehicle & Fleet Details
                        </h2>
                        <div className="grid gap-4">
                            <textarea
                                name="vehicle_types"
                                rows="4"
                                placeholder="List vehicle types, registration numbers, sizes, tail lift availability, temperature control, security features, EX/II or EX/III if applicable"
                                className="rounded-lg border p-3"
                            />
                            <textarea
                                name="equipment"
                                rows="4"
                                placeholder="List vehicle equipment carried: fire extinguishers, ADR kits, spill kits, PPE, straps, pallet truck, etc."
                                className="rounded-lg border p-3"
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            ADR & Dangerous Goods Capability
                        </h2>
                        <div className="grid gap-4">
                            <textarea
                                name="adr_classes"
                                rows="4"
                                placeholder="Which ADR classes can you carry? Include package types, limited quantities, excepted quantities, waste, temperature-sensitive goods, explosives, radioactive, etc."
                                className="rounded-lg border p-3"
                            />
                            <textarea
                                name="adr_certifications"
                                rows="4"
                                placeholder="List ADR driver training, DGSA details, security plans, specialist approvals, tunnel restrictions awareness, customs capability"
                                className="rounded-lg border p-3"
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            Drivers & Staffing
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <input
                                name="number_of_drivers"
                                placeholder="Number of Drivers"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="driver_cpc_status"
                                placeholder="Driver CPC Status"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="adr_trained_drivers"
                                placeholder="Number of ADR Trained Drivers"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="dbs_checked"
                                placeholder="DBS Checked Drivers? Yes / No"
                                className="rounded-lg border p-3"
                            />
                        </div>
                        <textarea
                            name="staffing_notes"
                            rows="4"
                            placeholder="Add any staffing notes, experience levels, specialist driver capability, security clearance, airport passes, etc."
                            className="mt-4 w-full rounded-lg border p-3"
                        />
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            Insurance & Compliance
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <input
                                name="goods_in_transit"
                                placeholder="Goods in Transit Cover Amount"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="public_liability"
                                placeholder="Public Liability Cover Amount"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="employers_liability"
                                placeholder="Employers Liability Cover Amount"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="motor_insurance"
                                placeholder="Motor Insurance Details"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="insurance_expiry"
                                placeholder="Insurance Expiry Date"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="iso_accreditations"
                                placeholder="ISO / Other Accreditations"
                                className="rounded-lg border p-3"
                            />
                        </div>
                        <textarea
                            name="compliance_notes"
                            rows="4"
                            placeholder="Include FORS, CLOCS, SafeContractor, waste carrier licence, customs authorisations, security procedures, incident reporting process, etc."
                            className="mt-4 w-full rounded-lg border p-3"
                        />
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            Required Document Uploads
                        </h2>
                        <p className="mb-4 text-sm text-gray-600">
                            Upload the latest compliance and insurance documents where
                            applicable.
                        </p>
                        <p className="mb-4 text-xs text-gray-500">
                            Max {MAX_FILE_SIZE_MB}MB per file, {MAX_TOTAL_UPLOAD_MB}MB total across all uploads.
                        </p>

                        <div className="grid gap-4 md:grid-cols-2">
                            {singleUploadFields.map((field) => (
                                <UploadCard
                                    key={field.key}
                                    label={field.label}
                                    inputName={field.key}
                                    files={uploadFilesState[field.key]}
                                    onChoose={(event) =>
                                        updateFiles(field.key, false, event)
                                    }
                                    onRemove={(index) => removeFile(field.key, index)}
                                    inputRef={getRef(field.key)}
                                />
                            ))}

                            {multiUploadFields.map((field) => (
                                <UploadCard
                                    key={field.key}
                                    label={field.label}
                                    inputName={field.key}
                                    multiple
                                    files={uploadFilesState[field.key]}
                                    onChoose={(event) =>
                                        updateFiles(field.key, true, event)
                                    }
                                    onRemove={(index) => removeFile(field.key, index)}
                                    inputRef={getRef(field.key)}
                                />
                            ))}
                        </div>

                        {fileError ? (
                            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {fileError}
                            </p>
                        ) : null}
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            Service Coverage
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <input
                                name="collection_areas"
                                placeholder="Collection Areas Covered"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="delivery_areas"
                                placeholder="Delivery Areas Covered"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="availability"
                                placeholder="Availability (24/7, weekdays, weekends, nights)"
                                className="rounded-lg border p-3"
                            />
                            <input
                                name="lead_time"
                                placeholder="Typical Lead Time"
                                className="rounded-lg border p-3"
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            References & Additional Information
                        </h2>
                        <div className="grid gap-4">
                            <textarea
                                name="references"
                                rows="4"
                                placeholder="Provide trade references, key customers, industries served, and relevant ADR contract experience"
                                className="rounded-lg border p-3"
                            />
                            <textarea
                                name="additional_information"
                                rows="5"
                                placeholder="Anything else we need to know"
                                className="rounded-lg border p-3"
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            Declaration
                        </h2>
                        <label className="flex items-start gap-3 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="declaration"
                                required
                                className="mt-1"
                            />
                            <span>
                                I confirm that the information provided is accurate and
                                complete to the best of my knowledge, and I consent to
                                ADR Carriers Ltd contacting me regarding subcontractor
                                onboarding.
                            </span>
                        </label>
                    </section>

                    {errorMessage ? (
                        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {errorMessage}
                        </p>
                    ) : null}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? 'Submitting...' : 'Submit Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
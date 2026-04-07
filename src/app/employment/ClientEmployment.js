'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { jobs } from '../../data/jobs'
import { supabase } from '@/lib/supabase'
import { uploadFiles } from '@/lib/uploadFiles'
import {
    validateSelectedFiles,
    MAX_FILE_SIZE_MB,
    MAX_TOTAL_UPLOAD_MB,
} from '@/lib/fileValidation'

export default function ClientEmployment() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const fileInputRef = useRef(null)

    const [selectedRole, setSelectedRole] = useState('')
    const [selectedJobId, setSelectedJobId] = useState('')
    const [files, setFiles] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [fileError, setFileError] = useState('')

    useEffect(() => {
        const role = searchParams.get('role')
        if (role === 'owner-driver') {
            router.replace('/subcontractor-register')
        }
    }, [router, searchParams])

    const activeJobs = useMemo(() => jobs.filter((job) => job.active), [])

    const handleRoleChange = (event) => {
        const value = event.target.value
        setSelectedRole(value)

        if (value === 'Owner Driver') {
            router.push('/subcontractor-register')
        }
    }

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files || [])

        if (selectedFiles.length === 0) {
            return
        }

        setFiles((prevFiles) => {
            const existingKeys = new Set(
                prevFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
            )

            const newFiles = selectedFiles.filter((file) => {
                const key = `${file.name}-${file.size}-${file.lastModified}`
                return !existingKeys.has(key)
            })

            const validation = validateSelectedFiles(newFiles, prevFiles)

            if (!validation.ok) {
                setFileError(validation.message)
                return prevFiles
            }

            setFileError('')
            return [...prevFiles, ...newFiles]
        })

        event.target.value = ''
    }

    const handleRemoveFile = (indexToRemove) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove))
        setFileError('')
    }

    const handleApplyForRole = (job) => {
        setSelectedJobId(job.id)
        setSelectedRole(job.title)

        document
            .getElementById('employment-application-form')
            ?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        setErrorMessage('')

        try {
            const form = event.currentTarget
            const formData = new FormData(form)

            const position = formData.get('position')?.toString() || ''
            if (position === 'Owner Driver') {
                router.push('/subcontractor-register')
                return
            }

            const uploaded = await uploadFiles(
                files,
                'employment-documents',
                `applications/${Date.now()}`
            )

            const fileUrls = uploaded.map((file) => file.path)
            const fileNames = uploaded.map((file) => file.name)

            const { error } = await supabase
                .from('employment_applications')
                .insert({
                    full_name: formData.get('name')?.toString() || '',
                    email: formData.get('email')?.toString() || '',
                    phone: formData.get('phone')?.toString() || '',
                    position,
                    location: formData.get('location')?.toString() || '',
                    experience: formData.get('experience')?.toString() || '',
                    adr_licence: formData.get('adr_licence')?.toString() || '',
                    licence_type: formData.get('licence_type')?.toString() || '',
                    message: formData.get('message')?.toString() || '',
                    job_id: formData.get('job_id')?.toString() || '',
                    file_urls: fileUrls,
                    file_names: fileNames,
                })

            if (error) {
                throw error
            }

            setFiles([])
            setFileError('')
            form.reset()
            setSelectedRole('')
            setSelectedJobId('')
            router.push('/thank-you')
        } catch (error) {
            console.error(error)
            setErrorMessage('Failed to submit application. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-5xl">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Employment Opportunities
                    </h1>

                    <p className="mt-4 text-gray-600">
                        ADR Carriers Ltd recruits experienced ADR drivers, warehouse staff,
                        supervisors, and logistics professionals across the UK and Europe.
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        Owner drivers and fleet operators should apply via our{' '}
                        <Link
                            href="/subcontractor-register"
                            className="font-semibold underline"
                        >
                            Subcontractor Register
                        </Link>
                        .
                    </p>
                </div>

                <section className="mb-12">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Current Opportunities
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        {activeJobs.map((job) => (
                            <div
                                key={job.id}
                                className="rounded-xl border bg-white p-6 shadow-sm"
                            >
                                <h3 className="mb-2 text-xl font-semibold">{job.title}</h3>
                                <p className="mb-3 text-sm text-gray-600">{job.summary}</p>

                                <div className="text-sm text-gray-500">
                                    <p>Category: {job.category}</p>
                                    <p>Location: {job.location}</p>
                                    <p>Type: {job.type}</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleApplyForRole(job)}
                                    className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                                >
                                    Apply for this role
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Typical Requirements
                    </h2>

                    <ul className="list-disc space-y-2 pl-6 text-gray-600">
                        <li>ADR licence where required for the role</li>
                        <li>Valid CPC qualification for applicable driving roles</li>
                        <li>Right to work in the UK or EU</li>
                        <li>Relevant commercial driving, warehouse, or logistics experience</li>
                        <li>Understanding of dangerous goods regulations</li>
                        <li>Strong compliance and safety awareness</li>
                    </ul>
                </section>

                <form
                    id="employment-application-form"
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl bg-white p-8 shadow-md"
                >
                    <h2 className="text-2xl font-semibold text-gray-900">Apply Now</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            name="name"
                            required
                            placeholder="Full Name"
                            className="rounded-lg border p-3"
                        />

                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email"
                            className="rounded-lg border p-3"
                        />

                        <input
                            name="phone"
                            required
                            placeholder="Phone Number"
                            className="rounded-lg border p-3"
                        />

                        <select
                            name="position"
                            required
                            value={selectedRole}
                            onChange={handleRoleChange}
                            className="rounded-lg border p-3"
                        >
                            <option value="">Role Applying For</option>
                            <option value="ADR Van Driver">ADR Van Driver</option>
                            <option value="HGV Class 1 ADR Driver">HGV Class 1 ADR Driver</option>
                            <option value="HGV Class 2 ADR Driver">HGV Class 2 ADR Driver</option>
                            <option value="Part Time ADR Driver">Part Time ADR Driver</option>
                            <option value="Warehouse Operative (Dangerous Goods)">
                                Warehouse Operative (Dangerous Goods)
                            </option>
                            <option value="Part Time Warehouse Operative">
                                Part Time Warehouse Operative
                            </option>
                            <option value="Warehouse Supervisor (DG)">
                                Warehouse Supervisor (DG)
                            </option>
                            <option value="Transport Supervisor">Transport Supervisor</option>
                            <option value="Operations Supervisor">Operations Supervisor</option>
                            <option value="Compliance Supervisor (ADR)">
                                Compliance Supervisor (ADR)
                            </option>
                            <option value="Transport Planner">Transport Planner</option>
                            <option value="Office Role">Office Role</option>
                            <option value="Owner Driver">Owner Driver</option>
                        </select>

                        <input
                            name="location"
                            placeholder="Location"
                            className="rounded-lg border p-3"
                        />

                        <input
                            name="experience"
                            placeholder="Years Experience"
                            className="rounded-lg border p-3"
                        />

                        <input
                            name="adr_licence"
                            placeholder="ADR Licence Type"
                            className="rounded-lg border p-3"
                        />

                        <input
                            name="licence_type"
                            placeholder="Driving Licence Type"
                            className="rounded-lg border p-3"
                        />
                    </div>

                    <input type="hidden" name="job_id" value={selectedJobId} />

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Upload Documents
                        </label>

                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                                >
                                    Choose Files
                                </button>

                                <span className="text-sm text-gray-500">
                                    Upload CV, ADR licence, CPC, or supporting documents
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Max {MAX_FILE_SIZE_MB}MB per file, {MAX_TOTAL_UPLOAD_MB}MB total
                            </p>

                            {fileError ? (
                                <p className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                    {fileError}
                                </p>
                            ) : null}

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
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
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

                    <textarea
                        name="message"
                        rows="5"
                        placeholder="Tell us about your experience"
                        className="w-full rounded-lg border p-3"
                    />

                    {errorMessage ? (
                        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {errorMessage}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </main>
    )
}
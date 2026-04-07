import {
    loginAdmin,
    logoutAdmin,
    updateEmploymentStatus,
    updateSubcontractorStatus
} from './actions'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export const metadata = {
    title: 'Admin | ADR Carriers Ltd',
    description: 'Admin dashboard for submissions.',
}

async function getEmploymentApplications(search) {
    const supabaseAdmin = getSupabaseAdmin()

    let query = supabaseAdmin
        .from('employment_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)

    if (search) {
        query = query.or(
            `full_name.ilike.%${search}%,email.ilike.%${search}%,position.ilike.%${search}%,location.ilike.%${search}%`
        )
    }

    const { data, error } = await query

    if (error) {
        console.error('Employment fetch error:', error)
        return []
    }

    return data || []
}

async function getSubcontractorRegistrations(search) {
    const supabaseAdmin = getSupabaseAdmin()

    let query = supabaseAdmin
        .from('subcontractor_registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)

    if (search) {
        query = query.or(
            `company_name.ilike.%${search}%,contact_name.ilike.%${search}%,email.ilike.%${search}%,subcontractor_type.ilike.%${search}%`
        )
    }

    const { data, error } = await query

    if (error) {
        console.error('Subcontractor fetch error:', error)
        return []
    }

    return data || []
}

function filterByStatus(items, status) {
    if (!status || status === 'all') return items
    return items.filter((item) => item.status === status)
}

function formatDate(value) {
    if (!value) return 'â€”'

    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

function StatusBadge({ status }) {
    return (
        <span className="inline-flex rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700">
            {status || 'new'}
        </span>
    )
}

async function buildSignedFileEntries(fileUrls, fileNames, bucket) {
    const supabaseAdmin = getSupabaseAdmin()

    if (!fileUrls) return []

    let entries = []

    if (Array.isArray(fileUrls)) {
        entries = fileUrls.map((path, index) => ({
            key: `${path}-${index}`,
            path,
            name: Array.isArray(fileNames)
                ? fileNames[index] || `File ${index + 1}`
                : `File ${index + 1}`,
        }))
    } else if (typeof fileUrls === 'object') {
        entries = Object.entries(fileUrls).flatMap(([group, paths]) => {
            if (!Array.isArray(paths)) return []

            return paths.map((path, index) => ({
                key: `${group}-${path}-${index}`,
                path,
                name:
                    fileNames &&
                        fileNames[group] &&
                        Array.isArray(fileNames[group]) &&
                        fileNames[group][index]
                        ? fileNames[group][index]
                        : `${group.replaceAll('_', ' ')} ${index + 1}`,
            }))
        })
    }

    if (entries.length === 0) return []

    return Promise.all(
        entries.map(async (entry) => {
            const { data, error } = await supabaseAdmin.storage
                .from(bucket)
                .createSignedUrl(entry.path, 60 * 60)

            if (error) {
                console.error('Signed URL error:', error)
                return { ...entry, signedUrl: null }
            }

            return {
                ...entry,
                signedUrl: data?.signedUrl || null,
            }
        })
    )
}

function FileLinks({ entries }) {
    if (!entries || entries.length === 0) {
        return <span className="text-sm text-gray-400">No files</span>
    }

    return (
        <div className="space-y-2">
            {entries.map((file) =>
                file.signedUrl ? (
                    <a
                        key={file.key}
                        href={file.signedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-blue-700 underline"
                    >
                        {file.name}
                    </a>
                ) : (
                    <div key={file.key} className="text-sm text-gray-400">
                        {file.name} (link unavailable)
                    </div>
                )
            )}
        </div>
    )
}

function LoginForm({ error }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Sign in to access the ADR Carriers admin dashboard.
                </p>

                <form action={loginAdmin} className="mt-6 space-y-4">
                    <input
                        name="username"
                        placeholder="Username"
                        className="w-full rounded-lg border p-3"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full rounded-lg border p-3"
                        required
                    />

                    {error ? (
                        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            Invalid username or password.
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </main>
    )
}

function AdminToolbar({ activeTab, search, status, success, error }) {
    return (
        <div className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2">
                    <a
                        href={`/admin?tab=employment&search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'employment'
                            ? 'bg-black text-white'
                            : 'border bg-white text-gray-700'
                            }`}
                    >
                        Employment
                    </a>
                    <a
                        href={`/admin?tab=subcontractors&search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'subcontractors'
                            ? 'bg-black text-white'
                            : 'border bg-white text-gray-700'
                            }`}
                    >
                        Subcontractors
                    </a>
                </div>

                <form action={logoutAdmin}>
                    <button
                        type="submit"
                        className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Log Out
                    </button>
                </form>
            </div>

            <form className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
                <input type="hidden" name="tab" value={activeTab} />
                <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="Search name, email, role, company..."
                    className="rounded-lg border p-3"
                />
                <select
                    name="status"
                    defaultValue={status}
                    className="rounded-lg border p-3"
                >
                    <option value="all">All statuses</option>
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="contacted">Contacted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                    <option value="approved">Approved</option>
                    <option value="onboarded">Onboarded</option>
                </select>
                <button
                    type="submit"
                    className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                >
                    Filter
                </button>
            </form>

            {success ? (
                <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    Status updated successfully.
                </p>
            ) : null}

            {error && error !== 'invalid_credentials' ? (
                <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    Something went wrong. Please try again.
                </p>
            ) : null}
        </div>
    )
}

function EmploymentStatusForm({ id, currentStatus }) {
    return (
        <form action={updateEmploymentStatus} className="flex flex-col gap-2">
            <input type="hidden" name="id" value={id} />
            <select
                name="status"
                defaultValue={currentStatus || 'new'}
                className="rounded-lg border p-2 text-sm"
            >
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="contacted">Contacted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
            </select>
            <button
                type="submit"
                className="rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
                Update
            </button>
        </form>
    )
}

function SubcontractorStatusForm({ id, currentStatus }) {
    return (
        <form action={updateSubcontractorStatus} className="flex flex-col gap-2">
            <input type="hidden" name="id" value={id} />
            <select
                name="status"
                defaultValue={currentStatus || 'new'}
                className="rounded-lg border p-2 text-sm"
            >
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="onboarded">Onboarded</option>
            </select>
            <button
                type="submit"
                className="rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
                Update
            </button>
        </form>
    )
}

export default async function AdminPage({ searchParams }) {

    const activeTab = searchParams?.tab === 'subcontractors' ? 'subcontractors' : 'employment'
    const search = searchParams?.search || ''
    const status = searchParams?.status || 'all'
    const success = searchParams?.success || ''
    const error = searchParams?.error || ''

    const employmentApplications = filterByStatus(
        await getEmploymentApplications(search),
        status
    )

    const subcontractorRegistrations = filterByStatus(
        await getSubcontractorRegistrations(search),
        status
    )

    const employmentWithLinks = await Promise.all(
        employmentApplications.map(async (item) => ({
            ...item,
            signedFiles: await buildSignedFileEntries(
                item.file_urls,
                item.file_names,
                'employment-documents'
            ),
        }))
    )

    const subcontractorsWithLinks = await Promise.all(
        subcontractorRegistrations.map(async (item) => ({
            ...item,
            signedFiles: await buildSignedFileEntries(
                item.file_urls,
                item.file_names,
                'subcontractor-documents'
            ),
        }))
    )

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        View submissions, download private documents, update statuses, and filter results.
                    </p>
                </div>

                <AdminToolbar
                    activeTab={activeTab}
                    search={search}
                    status={status}
                    success={success}
                    error={error}
                />

                {activeTab === 'employment' ? (
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Employment Applications
                        </h2>

                        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                            <table className="min-w-full text-left text-sm">
                                <thead className="border-b bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Contact</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Update</th>
                                        <th className="px-4 py-3">Files</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employmentWithLinks.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                                                No employment applications found.
                                            </td>
                                        </tr>
                                    ) : (
                                        employmentWithLinks.map((item) => (
                                            <tr key={item.id} className="border-b align-top last:border-b-0">
                                                <td className="px-4 py-4 text-gray-600">
                                                    {formatDate(item.created_at)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {item.full_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.location || 'â€”'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-gray-900">{item.position}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.job_id || 'â€”'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-gray-900">{item.email}</div>
                                                    <div className="text-gray-600">{item.phone || 'â€”'}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <StatusBadge status={item.status} />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <EmploymentStatusForm
                                                        id={item.id}
                                                        currentStatus={item.status}
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <FileLinks entries={item.signedFiles} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                ) : (
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Subcontractor Registrations
                        </h2>

                        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                            <table className="min-w-full text-left text-sm">
                                <thead className="border-b bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Company</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Contact</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Update</th>
                                        <th className="px-4 py-3">Files</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subcontractorsWithLinks.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                                                No subcontractor registrations found.
                                            </td>
                                        </tr>
                                    ) : (
                                        subcontractorsWithLinks.map((item) => (
                                            <tr key={item.id} className="border-b align-top last:border-b-0">
                                                <td className="px-4 py-4 text-gray-600">
                                                    {formatDate(item.created_at)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {item.company_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.fleet_size || 'â€”'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-gray-900">
                                                        {item.subcontractor_type}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.operating_area || 'â€”'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-gray-900">
                                                        {item.contact_name}
                                                    </div>
                                                    <div className="text-gray-600">{item.email}</div>
                                                    <div className="text-gray-600">{item.phone || 'â€”'}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <StatusBadge status={item.status} />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <SubcontractorStatusForm
                                                        id={item.id}
                                                        currentStatus={item.status}
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <FileLinks entries={item.signedFiles} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}




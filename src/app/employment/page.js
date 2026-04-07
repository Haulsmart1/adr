import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function EmploymentPage() {

  const supabase = createClient()

  let jobs = []
  let errorMessage = ''

  try {

    const { data, error } = await supabase
      .from('employment_applications')   // FIXED TABLE NAME
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      errorMessage = error.message
    } else {
      jobs = data ?? []
    }

  } catch (error) {

    errorMessage =
      error instanceof Error
        ? error.message
        : 'Unknown error'
  }

  return (
    <main className="mx-auto max-w-4xl p-6">

      <h1 className="mb-4 text-2xl font-semibold">
        Employment
      </h1>

      {errorMessage && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {jobs.length === 0 ? (
        <p className="text-sm text-gray-600">
          No employment records found.
        </p>
      ) : (

        <ul className="space-y-3">

          {jobs.map((job) => (

            <li
              key={job.id ?? JSON.stringify(job)}
              className="rounded border p-4"
            >

              <pre className="overflow-x-auto text-sm">
                {JSON.stringify(job, null, 2)}
              </pre>

            </li>

          ))}

        </ul>

      )}

    </main>
  )
}
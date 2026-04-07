'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
            Log Out
        </button>
    )
}
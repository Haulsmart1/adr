import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {

    const { pathname } = request.nextUrl

    // only protect admin area
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next()
    }

    // allow login page
    if (pathname === '/admin/login') {
        return NextResponse.next()
    }

    const response = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return request.cookies.get(name)?.value
                },
                set(name, value, options) {
                    response.cookies.set({ name, value, ...options })
                },
                remove(name, options) {
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // if not logged in → go to login page
    if (!user) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*'],
}
'use server'

export async function loginAdmin(formData) {
  return {
    ok: true,
    message: 'loginAdmin placeholder action executed.',
    email: formData?.get?.('email') ?? null
  }
}

export async function logoutAdmin() {
  return {
    ok: true,
    message: 'logoutAdmin placeholder action executed.'
  }
}

export async function updateEmploymentStatus(formData) {
  return {
    ok: true,
    message: 'updateEmploymentStatus placeholder action executed.',
    id: formData?.get?.('id') ?? null,
    status: formData?.get?.('status') ?? null
  }
}

export async function updateSubcontractorStatus(formData) {
  return {
    ok: true,
    message: 'updateSubcontractorStatus placeholder action executed.',
    id: formData?.get?.('id') ?? null,
    status: formData?.get?.('status') ?? null
  }
}

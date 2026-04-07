export const MAX_FILE_SIZE_MB = 10
export const MAX_TOTAL_UPLOAD_MB = 50

function toArray(files) {
  if (!files) return []
  return Array.isArray(files) ? files : Array.from(files)
}

export function validateSelectedFiles(
  files,
  {
    maxFileSizeMb = MAX_FILE_SIZE_MB,
    maxTotalUploadMb = MAX_TOTAL_UPLOAD_MB,
    allowedTypes = []
  } = {}
) {
  const selectedFiles = toArray(files)
  const errors = []

  const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024
  const maxTotalUploadBytes = maxTotalUploadMb * 1024 * 1024

  let totalSize = 0

  for (const file of selectedFiles) {
    totalSize += file.size ?? 0

    if ((file.size ?? 0) > maxFileSizeBytes) {
      errors.push(`${file.name} exceeds the ${maxFileSizeMb}MB file size limit.`)
    }

    if (
      allowedTypes.length > 0 &&
      file.type &&
      !allowedTypes.includes(file.type)
    ) {
      errors.push(`${file.name} has an unsupported file type.`)
    }
  }

  if (totalSize > maxTotalUploadBytes) {
    errors.push(`Total upload exceeds the ${maxTotalUploadMb}MB limit.`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateFiles(files, options = {}) {
  return validateSelectedFiles(files, options)
}

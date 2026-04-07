export async function uploadFiles(files) {
  if (!Array.isArray(files)) {
    throw new Error('uploadFiles expects an array of files')
  }

  return files.map((file) => ({
    name: file?.name ?? 'unknown',
    uploaded: false
  }))
}

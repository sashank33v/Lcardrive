export function createSlug(
  firstName: string,
  lastName: string,
  suburb: string
): string {
  return `${firstName}-${lastName[0]}-${suburb}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

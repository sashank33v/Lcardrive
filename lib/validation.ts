// Strips HTML tags and trims whitespace
export function sanitiseText(input: string, maxLength = 500): string {
  return input
    .replace(/<[^>]*>/g, '')     // Remove HTML tags
    .replace(/[<>'"]/g, '')      // Remove dangerous chars
    .trim()
    .slice(0, maxLength)
}

// Validates Australian mobile number
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  return /^(\+61|0)[4][0-9]{8}$/.test(cleaned)
}

// Validates email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

// Validates Australian postcode
export function isValidPostcode(postcode: string): boolean {
  return /^\d{4}$/.test(postcode.trim())
}

// Validates Australian ADI registration
export function isValidADI(adi: string): boolean {
  const cleaned = adi.trim()
  return cleaned.length >= 4 && cleaned.length <= 20 && /^[A-Za-z0-9\-]+$/.test(cleaned)
}

// Validates hourly rate (reasonable range for AU driving instructors)
export function isValidHourlyRate(rate: number): boolean {
  return rate >= 30 && rate <= 300
}

// Validates image file
export function isValidImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize      = 2 * 1024 * 1024 // 2MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG or WebP images are allowed' }
  }
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be under 2MB' }
  }
  return { valid: true }
}

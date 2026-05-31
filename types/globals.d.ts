export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: 'admin' | 'user'
    }
    publicMetadata?: {
      role?: 'admin' | 'user'
    }
  }
}

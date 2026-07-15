import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: Role
    sede?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
      image?: string | null
      sede?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
    sede?: string
  }
}
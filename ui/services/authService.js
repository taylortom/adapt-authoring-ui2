import { getConfig } from '../config.js'

class AuthService {
  async fetch (endpoint, options = {}) {
    const response = await fetch(`${getConfig('apiUrl')}/auth/${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      ...options
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }
    return response.json()
  }

  async login (email, password, persistSession = false) {
    return this.fetch('local', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, persistSession })
    })
  }

  async logout () {
    return this.fetch('disavow')
  }

  async checkAuth () {
    return this.fetch('check', { method: 'GET' })
  }
}

export const authService = new AuthService()

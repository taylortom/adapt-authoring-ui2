import appConfig from '../../config/app.config.js'

class AuthService {
  async login (email, password, persistSession = false) {
    const response = await fetch(`${appConfig.apiUrl}/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, persistSession })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    return response.json()
  }

  async logout () {
    const response = await fetch(`${appConfig.apiUrl}/auth/disavow`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Logout failed')
    }

    return response.json()
  }

  async checkAuth () {
    const response = await fetch(`${appConfig.apiUrl}/auth/check`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Not authenticated')
    }

    return response.json()
  }
}

export const authService = new AuthService()

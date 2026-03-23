import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  firstName: string
  lastName: string
  email: string
  experience: 'beginner' | 'intermediate' | 'expert'
  riskProfile: 'conservative' | 'moderate' | 'aggressive' | 'speculative'
  horizon: 'intraday' | 'short' | 'medium' | 'long'
  onboardingComplete: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)

  // Load from localStorage
  try {
    const stored = localStorage.getItem('ets_profile')
    if (stored) {
      user.value = JSON.parse(stored)
      isLoggedIn.value = true
    }
  } catch (e) {}

  async function register(firstName: string, lastName: string, email: string, _password: string) {
    await new Promise(r => setTimeout(r, 800))
    user.value = {
      firstName, lastName, email,
      experience: 'intermediate',
      riskProfile: 'moderate',
      horizon: 'medium',
      onboardingComplete: false
    }
    isLoggedIn.value = true
    saveProfile()
  }

  async function login(email: string, _password: string) {
    await new Promise(r => setTimeout(r, 600))
    if (!user.value) {
      user.value = {
        firstName: 'Trader', lastName: '',
        email, experience: 'intermediate',
        riskProfile: 'moderate', horizon: 'medium',
        onboardingComplete: true
      }
    }
    isLoggedIn.value = true
    saveProfile()
  }

  function updateProfile(data: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...data }
      saveProfile()
    }
  }

  function saveProfile() {
    try { localStorage.setItem('ets_profile', JSON.stringify(user.value)) } catch (e) {}
  }

  function logout() {
    user.value = null
    isLoggedIn.value = false
    try { localStorage.removeItem('ets_profile') } catch (e) {}
  }

  return { user, isLoggedIn, register, login, updateProfile, logout }
})

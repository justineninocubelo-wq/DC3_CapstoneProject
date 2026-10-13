import { ref } from 'vue'

const AUTH_KEY = 'orgconnect_auth'
const USER_KEY = 'orgconnect_user'
const USERS_KEY = 'orgconnect_users'
const DEMO_EMAIL = 'student@orgconnect.com'
const DEMO_ID = 'demo-student'

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function getUsers() {
  const storedUsers = readJson(USERS_KEY, [])
  if (!Array.isArray(storedUsers)) return []

  // Remove the old built-in demo account from existing browser data.
  const users = storedUsers.filter(user =>
    String(user?.email || '').trim().toLowerCase() !== DEMO_EMAIL && user?.id !== DEMO_ID
  )

  if (users.length !== storedUsers.length) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    } catch {}
  }

  return users
}

export const currentUser = ref(readUser())

export const isAuthenticated = () =>
  (localStorage.getItem(AUTH_KEY) === 'true' || sessionStorage.getItem(AUTH_KEY) === 'true') && Boolean(readUser())

export function login(email, password, remember = true) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const user = getUsers().find(item =>
    String(item.email || '').trim().toLowerCase() === normalizedEmail && item.password === password
  )

  if (!user) {
    return { success: false, message: 'Invalid email or password. Check your details and try again.' }
  }

  const { password: ignoredPassword, ...safeUser } = user
  const storage = remember ? localStorage : sessionStorage
  const otherStorage = remember ? sessionStorage : localStorage

  try {
    otherStorage.removeItem(AUTH_KEY)
    otherStorage.removeItem(USER_KEY)
    storage.setItem(AUTH_KEY, 'true')
    storage.setItem(USER_KEY, JSON.stringify(safeUser))
  } catch {
    return { success: false, message: 'Your browser could not save the session. Please enable browser storage and try again.' }
  }

  currentUser.value = safeUser
  return { success: true }
}

export function registerAccount({ name, studentId, email, course, year, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const normalizedStudentId = String(studentId || '').trim()
  const users = getUsers()

  if (users.some(user => String(user.email || '').trim().toLowerCase() === normalizedEmail)) {
    return { success: false, message: 'An account with this email already exists.' }
  }

  if (users.some(user => normalizedStudentId && String(user.studentId || '').trim().toLowerCase() === normalizedStudentId.toLowerCase())) {
    return { success: false, message: 'An account with this student ID already exists.' }
  }

  const cleanName = String(name || '').trim()
  const user = {
    id: `user-${Date.now()}`,
    name: cleanName,
    studentId: normalizedStudentId,
    email: normalizedEmail,
    course: String(course || '').trim(),
    year: String(year || '').trim(),
    avatar: cleanName.split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || '').join(''),
    password
  }

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
    return { success: true }
  } catch {
    return { success: false, message: 'Could not save the account in this browser. Check available storage and try again.' }
  }
}

export function resetPassword(email, studentId, newPassword) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const normalizedStudentId = String(studentId || '').trim().toLowerCase()
  const users = getUsers()
  const index = users.findIndex(user =>
    String(user.email || '').trim().toLowerCase() === normalizedEmail &&
    String(user.studentId || '').trim().toLowerCase() === normalizedStudentId
  )

  if (index < 0) {
    return { success: false, message: 'We could not find an account matching that email and student ID.' }
  }

  users[index] = { ...users[index], password: newPassword }

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return { success: true }
  } catch {
    return { success: false, message: 'Could not update the password in this browser. Please try again.' }
  }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(USER_KEY)
  currentUser.value = null
}

export function getStoredUser() {
  return readUser()
}

export function updateCurrentUser(data) {
  if (!currentUser.value) return false

  currentUser.value = { ...currentUser.value, ...data }
  const raw = JSON.stringify(currentUser.value)

  try {
    if (localStorage.getItem(AUTH_KEY) === 'true') localStorage.setItem(USER_KEY, raw)
    else sessionStorage.setItem(USER_KEY, raw)

    const users = getUsers()
    const index = users.findIndex(user => user.id === currentUser.value.id)
    if (index >= 0) {
      const password = users[index].password
      users[index] = { ...users[index], ...data, password }
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }

    return true
  } catch {
    return false
  }
}
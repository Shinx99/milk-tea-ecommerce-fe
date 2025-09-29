// src/milk-tea/account/store.js
import { reactive } from 'vue'
import { seedUsers } from './data/users'

const LS_CURRENT = 'mt_current_user'
const LS_USERS   = 'mt_users'

function loadUsers() {
  const raw = localStorage.getItem(LS_USERS)
  if (raw) return JSON.parse(raw)
  localStorage.setItem(LS_USERS, JSON.stringify(seedUsers))
  return [...seedUsers]
}
function saveUsers(users) { localStorage.setItem(LS_USERS, JSON.stringify(users)) }
function saveCurrent(user) {
  if (user) localStorage.setItem(LS_CURRENT, JSON.stringify(user))
  else localStorage.removeItem(LS_CURRENT)
}

export const authState = reactive({
  currentUser: JSON.parse(localStorage.getItem(LS_CURRENT) || 'null'),
  users: loadUsers()
})

/**
 * Đăng nhập bằng email hoặc username
 * @param {Object} payload
 * @param {string} payload.emailOrUsername
 * @param {string} payload.password
 * @param {boolean} [payload.remember=false] - nếu true sẽ lưu vào localStorage
 */
export function login({ emailOrUsername, password, remember = false }) {
  const id = (emailOrUsername || '').trim().toLowerCase()

  const found = authState.users.find(u => {
    return (
      (u.email && u.email.toLowerCase() === id) ||
      (u.username && u.username.toLowerCase() === id)
    )
  })

  if (!found || found.password !== password) {
    throw new Error('Thông tin đăng nhập không đúng!')
  }

  authState.currentUser = { ...found, password: undefined }

  // remember = true => lưu phiên vào localStorage, ngược lại chỉ giữ trong RAM (mất khi refresh)
  if (remember) saveCurrent(authState.currentUser)
  else saveCurrent(null)

  return authState.currentUser
}

export function register({ fullName, username, email, phone, address, password, avatar = '' }) {
  if (!fullName || !username || !email || !password) {
    throw new Error('Vui lòng nhập đầy đủ Họ tên, Tên đăng nhập, Email, Mật khẩu!')
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) throw new Error('Email không hợp lệ!')
  if (password.length < 6) throw new Error('Mật khẩu tối thiểu 6 ký tự!')
  if (authState.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email đã tồn tại!')
  }
  if (authState.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Tên đăng nhập đã tồn tại!')
  }

  const user = {
    id: Date.now(),
    fullName, username, email,
    phone: phone || '', address: address || '',
    password, avatar, role: 'USER'
  }

  authState.users.push(user)
  saveUsers(authState.users)
  return { ...user, password: undefined } // KHÔNG auto login
}

export function logout() {
  authState.currentUser = null
  saveCurrent(null)
}

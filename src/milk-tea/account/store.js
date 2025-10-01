// src/milk-tea/account/store.js
import { reactive } from 'vue'
import { seedUsers } from './data/users'

// Khóa localStorage
const LS_USERS   = 'mt_users'
const LS_CURRENT = 'mt_current_user'

// Load danh sách user (nếu chưa có thì seed)
function loadUsers() {
  try {
    const raw = localStorage.getItem(LS_USERS)
    if (!raw) {
      localStorage.setItem(LS_USERS, JSON.stringify(seedUsers))
      return [...seedUsers]
    }
    return JSON.parse(raw)
  } catch {
    return [...seedUsers]
  }
}

// Lưu danh sách user (phòng khi có chức năng đăng ký/sửa)
function saveUsers(list) {
  localStorage.setItem(LS_USERS, JSON.stringify(list))
}

// Quản lý current user
function loadCurrent() {
  try {
    return JSON.parse(localStorage.getItem(LS_CURRENT) || 'null')
  } catch {
    return null
  }
}
function saveCurrent(user) {
  if (user) localStorage.setItem(LS_CURRENT, JSON.stringify(user))
  else localStorage.removeItem(LS_CURRENT)
}

// ===== STATE CHUNG (reactive) =====
export const authState = reactive({
  users: loadUsers(),
  currentUser: loadCurrent() // {id, fullName, email, role, ...} | null
})

// ===== ACTIONS =====

// Đăng nhập bằng email hoặc username + password
export function login({ emailOrUsername, password }) {
  const found = authState.users.find(u =>
    (u.email === emailOrUsername || u.username === emailOrUsername) &&
    u.password === password
  )
  if (!found) {
    throw new Error('Email/Tên đăng nhập hoặc mật khẩu không đúng!')
  }
  // Không lưu password vào currentUser
  authState.currentUser = {
    id: found.id,
    fullName: found.fullName,
    email: found.email,
    username: found.username,
    role: found.role,
    avatar: found.avatar,
  }
  saveCurrent(authState.currentUser)
  return authState.currentUser
}

export function logout() {
  authState.currentUser = null
  saveCurrent(null)
}

// (tuỳ chọn) đăng ký nhanh – nếu bạn cần
export function register(payload) {
  const { fullName, username, email, phone, address, password } = payload
  if (authState.users.some(u => u.email === email || u.username === username)) {
    throw new Error('Email hoặc tên đăng nhập đã tồn tại!')
  }
  const user = {
    id: Date.now(),
    fullName, username, email, phone, address,
    password,
    avatar: '',
    role: 'USER'
  }
  authState.users.push(user)
  saveUsers(authState.users)

  // auto login sau đăng ký
  authState.currentUser = { ...user }
  delete authState.currentUser.password
  saveCurrent(authState.currentUser)
  return authState.currentUser
}

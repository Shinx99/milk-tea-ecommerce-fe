// src/milk-tea/account/store.js
// Store quản lý tài khoản đơn giản (chưa có backend, dùng localStorage)

// Dùng reactive để dữ liệu tự động phản ứng trong Vue
import { reactive } from 'vue'
import { seedUsers } from './data/users'   // dữ liệu mẫu ban đầu

// Khóa để lưu trong localStorage
const LS_CURRENT = 'mt_current_user' // user đang đăng nhập
const LS_USERS   = 'mt_users'        // danh sách user

// -----------------------------
// Hàm tiện ích
// -----------------------------

// Bỏ password ra khỏi user trước khi hiển thị
function publicUser(u) {
  if (!u) return null
  const { password, ...safe } = u
  return safe
}

// Lấy danh sách user từ localStorage (hoặc dùng seed nếu chưa có)
function loadUsers() {
  const raw = localStorage.getItem(LS_USERS)
  if (raw) return JSON.parse(raw)
  localStorage.setItem(LS_USERS, JSON.stringify(seedUsers))
  return [...seedUsers]
}

// Lưu danh sách user vào localStorage
function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users))
}

// Lưu user hiện tại (chỉ bản không có password)
function saveCurrent(user) {
  if (user) localStorage.setItem(LS_CURRENT, JSON.stringify(publicUser(user)))
  else localStorage.removeItem(LS_CURRENT)
}

// -----------------------------
// State chung (dùng reactive)
// -----------------------------
export const authState = reactive({
  currentUser: JSON.parse(localStorage.getItem(LS_CURRENT) || 'null'),
  users: loadUsers()
})

// -----------------------------
// Các hàm API cơ bản
// -----------------------------

// 1. Đăng nhập
export function login({ emailOrUsername, password }) {
  const found = authState.users.find(
    u =>
      (u.email === emailOrUsername || u.username === emailOrUsername) &&
      u.password === password
  )
  if (!found) throw new Error('Sai email/tên đăng nhập hoặc mật khẩu!')
  authState.currentUser = publicUser(found)
  saveCurrent(found)
  return authState.currentUser
}

// 2. Đăng ký
export function register({ fullName, username, email, phone, password }) {
  // Kiểm tra trùng
  if (authState.users.some(u => u.username === username)) throw new Error('Tên đăng nhập đã tồn tại!')
  if (authState.users.some(u => u.email === email)) throw new Error('Email đã tồn tại!')
  if (phone && authState.users.some(u => u.phone === phone)) throw new Error('Số điện thoại đã tồn tại!')

  const user = {
    id: Date.now(),
    fullName,
    username,
    email,
    phone,
    password,
    role: 'USER',
    avatar: '',
    address: ''
  }
  authState.users.push(user)
  saveUsers(authState.users)
  return publicUser(user)
}

// 3. Đăng xuất
export function logout() {
  authState.currentUser = null
  saveCurrent(null)
}

// 4. Cập nhật hồ sơ (chỉ sửa fullName, address, avatar, password)
export function updateProfile({ fullName, address, avatar, password } = {}) {
  if (!authState.currentUser) throw new Error('Chưa đăng nhập')

  const idx = authState.users.findIndex(u => u.id === authState.currentUser.id)
  if (idx < 0) throw new Error('Không tìm thấy user!')

  const old = authState.users[idx]
  const updated = { ...old }
  if (fullName !== undefined) updated.fullName = fullName
  if (address !== undefined)  updated.address = address
  if (avatar !== undefined)   updated.avatar = avatar
  if (password) updated.password = password

  // Cập nhật
  authState.users[idx] = updated
  saveUsers(authState.users)

  // Cập nhật user hiện tại
  authState.currentUser = publicUser(updated)
  saveCurrent(updated)

  return authState.currentUser
}

const BASE = 'http://localhost:8080/api/customers'


// Main idea: Xay mot cai header hoan chinh de nhan request va gui response
// - 'const headers = {...extra}' -> copy data tu extra vao bien headers
// - Dong lenh if -> Neu co body va body khong phai FormData -> dat thu cong Content-Type la: application/json
//                -> Neu khong thi khong dat vi trinh duyet se tu dung multipart/form-data kem boundary thich hop (Search them)
function buildHeaders(body, extra = {}) {
    const headers = { ...extra }
    if(body && !(body instanceof FormData)){
        if(!('Content-Type' in headers)){
            headers['Content-Type'] = 'application/json'
        }
    }
    if (!('Accept' in headers)) {
        headers['Accept'] = 'application/json'
    }
    return headers
}


// Main idea: Chuan hoa cach goi fetch + Chuan hoa xu ly phan hoi
// - request(path, { method = 'GET', body, headers = {}, signal } = {}) 
//      -> Ham nay gom 2 tham so: path, destructuring (giup co mac dinh an toan cho tung thuoc tinh) (research them)
// - Bien init: bao gom method, headers (body + header) va signal
// - !==: La toan tu khac nghiem khac (no chi tra ve true khi cung gia tri va kieu du lieu)
// - Chi thiet lap init.body khi body duoc truyen vao + neu body khong o dang FormData thi se chuyen body sang chuoi JSON = JSON.Stringify
async function request(path, { method = 'GET', body, headers = {}, signal } = {}) {
  const init = {
    method,
    headers: buildHeaders(body, headers),
    signal,
  }

  if (body !== undefined && method !== 'GET' && method !== 'HEAD') {
    init.body = body instanceof FormData ? body : JSON.stringify(body)
  }

  const res = await fetch(`${BASE}${path}`, init)

  // 1) Lỗi HTTP
  // Fetch khong coi loi 4xx/5xx la ngoai le nen khong tu kiem tra res.ok va nem error
  // -> Nen kiem tra !res.ok -> boc body loi (errPayload) -> Nem error + payload 
  // -> Nham quang ra log loi chuan http nhat co the.
  if (!res.ok) {
    let errPayload = null
    const ct = res.headers.get('content-type') || ''
    try {
      errPayload = ct.includes('application/json') ? await res.json() : await res.text()
    } catch {}
    const error = new Error(`HTTP ${res.status}`)
    error.status = res.status
    error.payload = errPayload
    throw error
  }

  // 2) Thành công
  // Luon luon kiem tra con content-type cua header truoc (bien ct)
  // Sau do moi chon json() hay text() de parse phan body dung dinh dang 
  // -> parse request/response dung dinh dang 
  if (res.status === 204) return null
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}


//Public API

//  GET /api/customers -> Hien thi all customers
// options -> cho cau hinh request gui xuong fetch
//         -> thuong dung de truyen method, headers, body, signal
export function getCustomer(options = {}){
    return request('', { method: 'GET', ...options})
}

// GET /api/customers/active -> Hien thi customers (isActive = true)
export function getActiveCustomers(options = {}){
    return request('/active', { method: 'GET', ...options})
}

// GET /api/customers/{id} -> Tim customer theo id --> MVP khong dung
// export function getCustomerById(id, options = {}){
//     return request(`/${encodeURIComponent(id)}`, { method: 'GET', ...options})
// }

// POST /api/customers -> Create new customer
// Payload la phan thong tin duoc FE tra ve BE de xu ly --> Create ben MVP thi chi co register thi moi create, admin khong duoc create
// export function createCustomer(payload, options = {}){
//     return request('', {method: 'POST', body: payload, ...options})
// }

// PUT /api/customers/{id} -> Update customer
export function updateCustomer(id, payload, options = {}){
    return request(`/${encodeURIComponent(id)}`, {method : 'PUT', body: payload, ...options})
}

// DELETE /api/customers/{id} (soft delete, 204) -> Delete customer
export function deleteCustomer(id, options = {}){
    return request(`/${encodeURIComponent(id)}`, {method: 'DELETE', ...options})
}

// Tùy chọn: hỗ trợ AbortController cho hủy request khi unmount [web:63]
export function createAbortController(){
    return new AbortController()
}
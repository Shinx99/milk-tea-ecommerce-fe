// src/composables/useCustomers.js
import { ref } from 'vue'
import {
  getCustomer as getCustomers,
  getActiveCustomers,
  updateCustomer,
  deleteCustomer,
  createAbortController
} from '@/services/http_customer'


// Main idea: Tao ra ham useCustomer co the xu ly duoc het CRUD
export function useCustomers() {
  const customers = ref([])
  const loading = ref(false)
  const error = ref(null)
  let ac = createAbortController()

  const resetController = () => {
    ac?.abort?.()
    ac = createAbortController()
    return ac.signal
   }   

   //Ham bat dong bo chiu trach nhiem cho viec tai du lieu tu BE len va quan ly cac trang thai co lien quan
   //onlyActive -> tai tat ca di lieu customer 
  const load = async (onlyActive = false) => {

    //Thong bao UI dang co qua trinh tai du lieu -> Ui se hien thi spinner (loading)
    loading.value = true

    //Xoa moi thong bao loi cu truoc do
    error.value = null
    
    //Dam bao huy tat ca cac request load dang chay tu truoc
    const signal = resetController()  // tạo signal mới, hủy request cũ

    try {

      //Neu onlyAcitve = true -> goi API customer + is_active = true
      //  -> Khong thi goi API customer + selectAll
      customers.value = onlyActive
        ? await getActiveCustomers({ signal })
        : await getCustomers({ signal })
    } catch (e) {

      //Thong bao loi de hieu:
      // ->Uu tien lay thong bao loi tu payload(BE), Khong co thi lay e.message tu JS
      error.value = e.payload?.message || e.message
    } finally {

      //Danh dau qua tai (loading) da ket thuc, nen loading.value phai dat la false
      loading.value = false
    }
  }

  //Goi API update
  const update = async (id, payload) => { await updateCustomer(id, payload); await load() }

  //Tao ra 1 mang moi (.filter()) ma id cua tat ca cac khach hang trong mang moi(c.id) khac id thang vua duoc xoa
  const remove = async (id) => { await deleteCustomer(id); customers.value = customers.value.filter(c => c.id !== id) }

  return { customers, loading, error, load, create, update, remove, ac }
}

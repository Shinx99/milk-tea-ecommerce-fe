import {reactive, watch} from 'vue';
import { 
    fetchAdminProducts, 
    fetchCategories,
    createProducts, 
    updateProduct,  
    deleteProduct   
} from '../service/AdminProductService';

// Bien toan cuc productState
export const productState = reactive({
    list: [],
    isLoading: false,
    error: null,

    keyword: "",
    category: "All",
    searchTimeout: null,

    isActionLoading: false, 
    actionError: null,

    page: 0,
    size: 8,
    totalPages: 0,
    totalElements: 0
});

// === STATE MỚI CHO CATEGORIES ===
export const categoryState = reactive({
    list: ['All'], // Khởi tạo với 'All'
    isLoading: false,
    error: null
});

// Composable loadProducts
export async function loadProducts() {
    if(productState.isLoading) return;

    productState.isLoading = true;
    productState.error = null;

    try{
        const params =  {
            category: productState.category,
            keyword: productState.keyword,
            page: productState.page,
            size: productState.size
        };

        const result = await fetchAdminProducts(params);

        productState.list = Array.isArray(result.items) ? result.items : [];
        productState.page = result.page;
        productState.size = result.size;
        productState.totalPages = result.totalPages;
        productState.totalElements = result.totalElements;
    } catch(err){
        productState.error = err.message || "Không thể tải dữ liệu sản phẩm.";
        productState.list = [];
    } finally {
        productState.isLoading = false;
    }
}

// Ham loadCategories
export async function loadCategories() {
    if(categoryState.isLoading) return;

    categoryState.isLoading = true;
    categoryState.error = null;

    try {
        const data= await fetchCategories();
        categoryState.list = data;
    } catch (error) {
        console.error("Lỗi khi tải categories:", error);
        categoryState.error = error.message || "Không thể tải danh mục sản phẩm."; 
        categoryState.list = [];
    } finally{
        categoryState.isLoading = false;
    }
}

//Watcher cho Category
watch(() => productState.category, (newVal, oldVal) => {

    if(newVal !== oldVal){
        productState.page = 0;
    }

    clearTimeout(productState.searchTimeout);

    productState.searchTimeout = setTimeout(() => {
        loadProducts();
    }, 100)
});

//Watcher cho keyword
watch(() => productState.keyword, (newVal, oldVal) => {

    if(newVal !== oldVal){
        productState.page = 0;
    }

    clearTimeout(productState.searchTimeout);

    productState.searchTimeout = setTimeout(() => {
        loadProducts();
    }, 100);
});

//Ham changePage
export async function changePage(newPage) {

    if(productState.isLoading) return;
    if(newPage < 0) return;
    if(productState.totalPages > 0 && newPage >= productState.totalPages) return;

    productState.page = newPage;

    await loadProducts();

    window.scrollTo({top:0, behavior: 'smooth'});
}

export async function nextPage() {
    await changePage(productState.page + 1);
}

export async function prevPage() {
    await changePage(productState.page - 1);
}


// CRUD------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
export async function handleCreateProduct(payload) {
    productState.isActionLoading = true;
    productState.actionError = null;

    try {
        await createProducts(payload);
        
        // Thành công -> Load lại danh sách trang 1 (để thấy sp mới nhất)
        productState.page = 0;
        productState.keyword = ""; // Reset keyword để thấy toàn bộ
        await loadProducts();
        
        return true;
    } catch (err) {
        productState.actionError = err.message;
        return false;
    } finally {
        productState.isActionLoading = false;
    }
}


export async function handleUpdateProduct(id, payload) {
    productState.isActionLoading = true;
    productState.actionError = null;

    try {
        await updateProduct(id, payload);
        await loadProducts();
        return true;
    } catch (err) {
        productState.actionError = err.message;
        return false;
    } finally {
        productState.isActionLoading = false;
    }
}


export async function handleDeleteProduct(id) {
    productState.isActionLoading = true;
    productState.actionError = null;

    try {
        await deleteProduct(id);

        // Thành công -> Xóa item khỏi list local ngay lập tức (cho UI mượt)
        productState.list = productState.list.filter(item => item.id !== id);
        productState.totalElements--;

        // Nếu trang hiện tại hết item sau khi xóa -> lùi về trang trước
        if (productState.list.length === 0 && productState.page > 0) {
            await prevPage();
        } else {
            // Hoặc reload lại để đồng bộ phân trang chính xác
            await loadProducts();
        }

        return true;
    } catch (err) {
        productState.actionError = err.message;
        return false;
    } finally {
        productState.isActionLoading = false;
    }
}
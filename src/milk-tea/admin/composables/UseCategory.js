import { reactive } from 'vue';
import { getCategoryApi, saveCategoryApi, deleteCategoryApi } from '../service/AdminCategoryService'; 

export const categoryState = reactive({
    list: [],
    error: null,
    
    keyword: '', 
    searchTimeout: null,

    page: 0,
    size: 6,
    totalPages: 0, 
    totalElements: 0, 
});


export async function loadCategories() {
    if (categoryState.isLoading) return;

    categoryState.isLoading = true;
    categoryState.error = null;
    
    try {
        const params = { 
            page: categoryState.page, 
            size: categoryState.size,
            keyword: categoryState.keyword, 
        };

        const result = await getCategoryApi(params);

        categoryState.list = Array.isArray(result.items) ? result.items : [];
        categoryState.totalElements = result.totalElements;
        categoryState.totalPages = result.totalPages; 
        
    } catch (error) {
        categoryState.error = error.message || "Không thể tải dữ liệu danh mục!";
        categoryState.list = [];
    } finally {
        categoryState.isLoading = false;
    }
}


export async function saveCategory(id, payload) {
    if (categoryState.isLoading) return;
    categoryState.isLoading = true;
    categoryState.error = null;

    try {
        const updatedCategory = await saveCategoryApi(id, payload);
        
        await loadCategories(); 
        
        return updatedCategory;
    } catch (error) {
        categoryState.error = error.message || "Lưu danh mục thất bại!";
        throw error;
    } finally {
        categoryState.isLoading = false;
    }
}


export async function deleteCategory(id) {
    if (categoryState.isLoading) return;
    categoryState.isLoading = true;
    categoryState.error = null;

    try {
        await deleteCategoryApi(id);

        await loadCategories(); 
        
    } catch (error) {
        categoryState.error = error.message || "Xóa danh mục thất bại!";
        throw error;
    } finally {
        categoryState.isLoading = false;
    }
}

// --- LOGIC PHÂN TRANG ---

export async function changePage(newPage) {
    if (categoryState.isLoading) return;
    if(newPage < 0) return;
    if(categoryState.totalPages > 0 && newPage >= categoryState.totalPages) return;

    categoryState.page = newPage;

    await loadCategories();

    window.scrollTo({top: 0, behavior: 'smooth'});
}

export async function nextPage() {
    await changePage(categoryState.page + 1);
}

export async function prevPage() {
    await changePage(categoryState.page - 1);
}
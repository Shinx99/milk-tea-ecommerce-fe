import apiClient from '@milk-tea/product/service/apiClient.js';

export async function fetchHomeSection(path , {page = 0, size = 8, sortBy = 'createdAt', direction = 'DESC'} = {}){
    const token = localStorage.getItem('token');

    const res = await apiClient.get(`/home/${path}`, {
        params: {page, size, sortBy, direction}
    });

    const json = await res.data;
    if(!json.success || !json.data || !Array.isArray(json.data.content)){
        throw new Error('Response format khong dung mong doi');
    }

    return json.data.content;
}

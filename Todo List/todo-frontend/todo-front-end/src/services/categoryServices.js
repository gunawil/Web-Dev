import apiClient from './apiClient';

export async function fetchCategories(){
    const response = await apiClient.get(`/categories`);

    return response.data;
}

export async function saveCategory(newCategory){
    try{
        const payload = {
            'category_description': newCategory.category_description,
        }

        const response = await apiClient.post(`/categories/create_category`, payload);
        const data = await response.data;

        return data.category;
    }catch (err){
        alert(`Error saving category: ${err}`);
    }
}

export async function editCategory(arrayCategory) {
    try{
        const editedCategory = {
            'category_id': arrayCategory.category_id,
            'category_description': arrayCategory.category_description,
            'update_type': 'desc',
        }

        const response = await apiClient.put(`/categories/${arrayCategory.category_id}`, editedCategory);

        const data = await response.data;

        alert(data.message);
        return data.category;
    }catch(err){
        alert(`Error editing category: ${err}`);
    }
}

export async function deleteCategory(categoryId){
    try{
        const updatedStatus = {
            'category_id': categoryId,
            'category_status': 'INACTIVE',
            'update_type': 'stat',
        }
    
        const response = await apiClient.put(`/categories/${categoryId}`, updatedStatus)

        const data = await response.data;

        alert(data.message);
        return data.category;
    }catch(err){
        alert(`Error deleting category: ${err}`);
    }
}
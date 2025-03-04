import apiClient from "./apiClient";

export async function fetchTask() {
    const response = await apiClient.get('/tasks');

    return response.data;
}

export async function saveTask(arrayTask) {
    try {
        const newTask = {
            'task_date': arrayTask.task_date,
            'task_title': arrayTask.task_title,
            'task_completed': arrayTask.task_completed,
            'category_id': arrayTask.category_id,
            'tags': arrayTask.tags,
        }
    
        const response = await apiClient.post(`/tasks/create_task`, newTask);

        const data = await response.data;

        alert(data.message);
        return data.task;
    }catch (err){
        alert(`Error saving task: ${err}`);
    }
}

export async function editTask(arrayTask) {
    try{
        const editedTask = {
            'task_date': arrayTask.task_date,
            'task_title': arrayTask.task_title,
            'category_id': arrayTask.category_id,
            'tags': arrayTask.tags,
            'update_type': 'detail',
        }

        const response = await apiClient.put(`/tasks/${arrayTask.task_id}`, editedTask);
        const data = await response.data;

        alert(data.message);
        return data.task;
    }catch(err){
        alert(`Error editing task: ${err}`);
    }
}

export async function completeTask(taskId) {
    try{
        const completedTask = {
            'task_completed': true,
            'update_type': 'status',
        }

        const response = await apiClient.put(`/tasks/${taskId}`, completedTask);
        const data = await response.data;

        alert(data.message);
        return data.task;
    }catch (err){
        alert(`Failed updating status task: ${err}`);
    }
}

export async function deleteTask(taskId) {
    try{
        const response = await apiClient.delete(`/tasks/${taskId}`);
        const data = await response.data;

        alert(data.message);
    }catch(err){
        alert(`Failed deleting task: ${err}`);
    }
}
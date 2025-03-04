import apiClient from "./apiClient";


export async function fetchTag() {
    const response = await apiClient('/tags');

    return  response.data;
}

export async function saveTag(tagDescription, tagColorCode) {
    try{
        const newTag = {
            'tag_description': tagDescription,
            'tag_color_code': tagColorCode,
        }

        const response = await apiClient.post('/tags/create_tag', newTag);

        const data = await response.data;

        alert(data.message);
        return data.tag;
    }catch (err){
        alert(`Error saving tag: ${err}`);
    }
}

export async function editTag(arrayTag){
    const editedTag = {
        'tag_description': arrayTag.tag_description,
        'tag_color_code': arrayTag.tag_color_code,
    }

    const response = await apiClient.put(`/tags/${arrayTag.tag_id}`, editedTag);
    const data = await response.data;

    alert(data.message);
    return data.tag;
}

export async function deleteTag(tagId) {
    try {
        const response = await apiClient.delete(`/tags/${tagId}`);
        const data = await response.data;

        alert(data.message);
    }catch(err){
        alert(`Failed deleting tag: ${err}`);
    }
}
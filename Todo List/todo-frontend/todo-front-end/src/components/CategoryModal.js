import '../App.css';
import { Modal, Form, Button } from 'react-bootstrap';
import { editCategory, saveCategory } from '../services/categoryServices';
import { useContext, useEffect, useState } from 'react';
import { CategoryContext } from '../contexts/CategoryContext';

function CategoryModal({show, onHide, isAdd=true, currData={}}){
    const { onUpdateCategories } = useContext(CategoryContext);
    const [id, setId] = useState('');
    const [description, setDescription] = useState('');

    useEffect(()=>{
        if (show && !isAdd){
            setId(currData.category_id)
            setDescription(currData.category_description)
        }
    }, [show, isAdd, currData])

    async function handleSave(e) {
        e.preventDefault();

        try{
            let categoryData = {}
            if (!isAdd){
                categoryData = {
                    'category_id': id,
                    'category_description': description,
                }

                const editedCat = await editCategory(categoryData);
                onUpdateCategories(editedCat, isAdd)
            }else{
                categoryData = {
                    'category_description': description,
                }

                const newCat = await saveCategory(categoryData);
                onUpdateCategories(newCat, isAdd)
            }

            setDescription('');
            setId('');
            onHide();
        }catch (err){
            alert(`Failed to save category: ${err}`);
        }
    }

    return <>
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{isAdd? 'New Category': 'Edit Category'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSave}>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" placeholder="Category Description" required
                        value={description} onChange={(e)=>setDescription(e.target.value)}/>
                    </Form.Group>

                    <div className="text-end">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Close
                        </Button>
                        <Button variant="primary" type="submit">Save</Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            
            </Modal.Footer>
        </Modal>
    </>
}

export default CategoryModal;
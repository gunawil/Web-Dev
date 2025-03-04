import { useContext, useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { TagContext } from "../contexts/TagContext";
import { CategoryContext } from "../contexts/CategoryContext";
import { TaskContext } from "../contexts/TaskContext";
import { saveTask, editTask } from "../services/taskServices";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

function TaskModal({ show, onHide, isAdd, currData={}}){
    const { onUpdateTask } = useContext(TaskContext);
    const { categories, onUpdateTaskCount } = useContext(CategoryContext);
    const { tags } = useContext(TagContext);
    const defValue = {
        'task_title': '',
        'task_date': format(new Date(), 'yyyy-MM-dd'),
        'task_completed': false,
        'category_id': '',
        'tags': [],
    };
    const [formObject, setFormObject] = useState(defValue);
    const [oldCategoryId, setOldCategoryId] = useState();

    useEffect(()=>{
        if (show && !isAdd){
            const taskObject = {
                ...currData,
                tags: currData.tags.map(tag => tag.tag_id),
            }
            setFormObject(taskObject);
            setOldCategoryId(currData.category_id);
        }
    }, [show, isAdd, currData])

    function handleChange(e){
        const { name, value } = e.target;
        setFormObject(prev =>({
            ...prev, 
            [name]: value,
        }));
    }

    function handleDateChange(selectedDate){
        const dateFormat = format(selectedDate, 'yyyy-MM-dd')
        setFormObject(prev => ({
            ...prev, 
            task_date: dateFormat,
        }))
    }

    function toggleTag(tagId){
        setFormObject(prev=> {
            const existTag = prev.tags.includes(tagId);
                if (existTag){
                    return{
                        ...prev, 
                        tags: prev.tags.filter(id=>id !== tagId)
                    }
                }else{
                    return {
                        ...prev,
                        tags: [...prev.tags, tagId]
                    }
                }
            }
        )
    }

    async function handleSave(e){
        e.preventDefault();

        if (isAdd){
            try{
                const newTask = await saveTask(formObject);
    
                const dataCategory = {
                    'category_id': newTask.category_id,
                    'old_category_id': '',
                }
                
                onUpdateTask(newTask, isAdd);
                onUpdateTaskCount('ADD', dataCategory);
        
                setFormObject(defValue);
                onHide();
            }catch (err){
                alert(`Failed to save task: ${err}`);
            }
        }else{
            try{
                const dataCategory = {
                    'category_id': formObject.category_id,
                    'old_category_id': oldCategoryId,
                }

                const editedTask = await editTask(formObject);

                onUpdateTask(editedTask, isAdd);
                onUpdateTaskCount('EDIT', dataCategory);

                setFormObject(defValue);

                onHide();
            }catch(err){
                alert(`Failed to edit task: ${err}`);
            }
        }
        
    }

    function handleClose(){
        setFormObject(defValue);
        onHide();
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
                <Modal.Title>{isAdd ? "New Task" : "Edit Task"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="taskForm" onSubmit={handleSave}>
                    {/* Task Title */}
                    <Form.Group className="m-1">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="task_title" placeholder="Task Title" required
                            value={formObject.task_title} onChange={e=>handleChange(e)}/>
                    </Form.Group>

                    {/* Task Date */}
                    <Form.Group className="m-1">    
                        <Form.Label>Date</Form.Label>
                        <DatePicker 
                            selected={formObject.task_date} 
                            onChange={date=>handleDateChange(date)} 
                            dateFormat='MMM dd, yyyy' 
                            className="form-control" wrapperClassName="d-block"/>
                    </Form.Group>

                    {/* Task Category */}
                    <Form.Group className="m-1">
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="category_id" value={formObject.category_id} onChange={e=>handleChange(e)}>
                            <option value={""}>-- Select Category --</option>
                            {categories.filter(cat=>cat.category_status!=='INACTIVE').map(cat=>(
                                <option key={cat.category_id} value={cat.category_id}>{cat.category_description}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Tags */}
                    <Form.Group className="m-1">
                    <Form.Label>Tags</Form.Label>
                        <div style={{ borderTop: '1px solid #ddd' }} className="pt-2 justify-content-end"
                            >{tags.map(tag=>(
                                <Button key={tag.tag_id} style={{background:tag.tag_color_code}}
                                    className="m-1"
                                ><Form.Check key={tag.tag_id} type="checkbox" 
                                            checked={formObject.tags.includes(tag.tag_id)}
                                            onChange={()=>toggleTag(tag.tag_id)}
                                />
                                    {tag.tag_description}</Button>
                            ))}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="text-end">
                <Button variant="secondary" onClick={handleClose} className="me-2">
                    Close
                </Button>
                <Button variant="primary" type="submit" form="taskForm">Save</Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default TaskModal;
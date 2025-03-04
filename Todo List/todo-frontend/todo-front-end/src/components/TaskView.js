import React, { useState, useContext } from "react";
import '../App.css';
import { completeTask, deleteTask } from '../services/taskServices';
import { Container, Row, Col, Form, Card, Button, Badge } from "react-bootstrap";
import { TaskContext} from '../contexts/TaskContext';
import { CategoryContext } from "../contexts/CategoryContext";
import TaskModal from './TaskModal';
import {format} from 'date-fns';

function TaskView({filteredState='ALL', categoryId='', tagId=''}){
    const { tasks, onUpdateTask } = useContext(TaskContext);
    const { onUpdateTaskCount } = useContext(CategoryContext);
    const [ currTask, setCurrTask ] = useState();
    const [ showModal, setShowModal ] = useState(false);
    const [ isAdd, setIsAdd ] = useState(true);
    const [ isCompleteFilter, setIsCompleteFilter ] = useState(false);
    const [ filterText, setFilterText ] = useState();
    
    const filterTaskByState = tasks.filter(task=>{
        const currentDate = format(new Date(),'yyyy-MM-dd');
        const taskDate = format(new Date(task.task_date), 'yyyy-MM-dd');

        const titleFilter = !filterText || task.task_title.includes(filterText);
        const completedFilter = isCompleteFilter ? task.task_completed: true;
        const catId = !categoryId || task.category_id===categoryId;
        const taskTagId = !tagId || (task.tags && task.tags.some(t=>t.tag_id===tagId));
        
        switch (filteredState) {
            case 'ALL':
                return titleFilter && completedFilter
                break;
            case 'UPCOMING':
                return !task.task_completed && taskDate > currentDate && titleFilter;
                break;
            case 'TODAY':
                return !task.task_completed && taskDate === currentDate && titleFilter;
                break;
            case 'CATEGORY':
                return !task.task_completed && catId;
            case 'TAG': 
                return !task.task_completed && taskTagId;
            default:
                return !task.task_completed;
                break;
        }
    }, [isCompleteFilter, filterText])

    function isExpired(tDate){
        const taskDate = format(new Date(tDate), 'yyyy-MM-dd');
        const currentDate = format(new Date(), 'yyyy-MM-dd');

        return taskDate < currentDate;
    }

    function getStatusBadge(task){
        if (task.task_completed){
            return <Badge bg="success">Completed</Badge>;
        }else {
            if (isExpired(task.task_date)){
                return <Badge bg="danger">Expired</Badge>;
            }
        }
    }

    async function handleCompletedCheckbox(taskId){
        try{            
            const completedTask = await completeTask(taskId);
    
            onUpdateTask(completedTask, false);
        }catch(err){
            alert(`Failed to complete task: ${err}`);
        }
    }

    function handleAddButton(){
        setIsAdd(true);
        setShowModal(true)
    }

    function handleEditButton(task){
        setCurrTask(task);
        setIsAdd(false);
        setShowModal(true);
    }

    async function handleDeleteButton(taskId, categoryId) {
        if (window.confirm(`Delete Task?`)) {
            try{
                const data = {
                    'task_id': taskId,
                }

                const dataCategory = {
                    'category_id': categoryId,
                }
    
                const deletedTask = await deleteTask(taskId);
    
                onUpdateTask(data, false, true);
                onUpdateTaskCount('DELETE', dataCategory);
            }catch(err){
                alert(`Failed to delete task: ${err}`);
            }
        }
    }

    return <>
        <Container className="h-100" style={{overflowY: 'auto'}}>
            <Row className="m-3">
                <h3 className="modul-title pb-3">TASK LIST</h3>
            </Row>
            <Row className="m-3 mt-5 filter-container">
                <Col lg={8} className="d-flex">
                    <Form.Control type='text'
                        placeholder='Search Task...'
                        style={{ marginRight: '1rem', marginBottom: '1rem', width: '300px'}}
                        value={filterText ?? ''}
                        onChange={e => setFilterText(e.target.value)}
                    />
                    {filteredState=='ALL' && (<div className="form-container d-flex">
                        <Form.Check type='checkbox' style={{ marginRight: '1rem'}}
                            label="Completed"
                            onChange={()=>setIsCompleteFilter(isCompleteFilter ? false : true)} 
                            checked={isCompleteFilter}
                        />
                    </div>)}
                </Col>
                <Col lg={4} className="d-flex justify-content-end pb-3 pr-3">
                    <Button variant="primary" onClick={handleAddButton}>New Task</Button>
                </Col>
            </Row>
            <Row className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 ms-5 mb-5">
                {filterTaskByState.map(task=>(
                    <Col key={task.task_id}>
                        <Card style={{ width: '25rem', marginTop: '1rem'}}>
                            <Card.Header className="fs-5 d-flex justify-content-between align-items-center">
                                <strong>{task.task_title}</strong>
                                {getStatusBadge(task)}
                            </Card.Header>
                            <Card.Body>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {task.category?.category_description}
                                </Card.Subtitle>
                                <Card.Text className="mb-2">
                                    Date: {task.task_date}<br/>
                                </Card.Text>
                                <Card.Text className="mb-2">
                                    {task.task_completed}
                                </Card.Text>
                                <Card.Text>
                                    {task.tags.map(tag=>(
                                        <Button key={tag.tag_id} className="m-1 tag-color" style={{background: tag.tag_color_code}}>
                                            {tag.tag_description}
                                        </Button>
                                    ))}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between align-items-center">
                                <Form.Check type="checkbox" label="Completed" 
                                    onChange={()=> handleCompletedCheckbox(task.task_id)}
                                    checked={task.task_completed} disabled={task.task_completed}/>
                                <div>    
                                    {isExpired(task.task_date) || !task.task_completed &&
                                        <Button variant="outline-primary" className="mx-1" onClick={()=>handleEditButton(task)}>Edit</Button>
                                    }
                                    <Button variant="outline-primary" className="mx-1" onClick={()=>handleDeleteButton(task.task_id, task.category_id)}>Delete</Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>

        <TaskModal show={showModal} onHide={()=>setShowModal(false)} isAdd={isAdd} currData={currTask}/>
    </>
}

export default TaskView;
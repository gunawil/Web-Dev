import { Nav, ListGroup, Form, InputGroup, ListGroupItem, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight, faCalendarDays, faClipboardList, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import '../App.css';
import { useState, useContext, useEffect } from "react";
import CategoryModal from "./CategoryModal.js";
import { CategoryContext } from "../contexts/CategoryContext.js";
import { TaskContext } from "../contexts/TaskContext.js";
import { TagContext } from "../contexts/TagContext.js";
import TagModal from "./TagModal.js";

function CategoryList({onSelectFeature, onSelectCategoryId}){
    const {categories, top3Categories} = useContext(CategoryContext);
    const [isAdd, setIsAdd] = useState(true);

    const [showModal, setShowModal] = useState(false);

    function handleSelectCategory(catId){
        onSelectFeature('task_category');
        onSelectCategoryId(catId);
    }
    
    function addCategory(){
        setIsAdd(true);
        setShowModal(true);
    }

    return <>
        <Nav.Item className="mb-3">
            <h6>CATEGORIES</h6>
            <ListGroup variant="flush">
                {top3Categories && top3Categories.map(cat => (
                    <ListGroupItem className="custom-bg list-item d-flex justify-content-between align-items-center" 
                        key={cat.category_id}
                        onClick={()=> handleSelectCategory(cat.category_id)}
                    >
                        {cat.category_description}
                        {cat.task_count > 0 && (
                            <Badge pill bg="primary">{cat.task_count}</Badge>
                        )}
                    </ListGroupItem>
                ))}

                {categories.length > 0 && (
                    <ListGroupItem className="custom-bg list-item"
                    action onClick={() => onSelectFeature('categories')}
                    >
                        More Categories
                    </ListGroupItem>
                )}

                {categories.length < 1 && (
                    <ListGroupItem className="custom-bg list-item" onClick={addCategory}>
                        <FontAwesomeIcon icon={faPlus} className="me-2"/>
                        Add New Category
                    </ListGroupItem>
                )}
            </ListGroup>
        </Nav.Item>

        <CategoryModal show={showModal} onHide={()=>setShowModal(false)} isAdd={isAdd}/>
    </>
}

function TagList({onSelectFeature, onSelectTagId}){
    const { tags } = useContext(TagContext);
    const showedTags = tags.slice(0,3);
    const [showModal, setShowModal] = useState(false);

    function handleSelectTag(tagId){
        onSelectFeature('task_tag');
        onSelectTagId(tagId)
    }

    return <>
        <Nav.Item className="mb-3">
            <h6>TAGS</h6>
            <ListGroup variant="flush">
                {showedTags && showedTags.map(tag => (
                    <ListGroupItem className="list-item m-1"
                        key={tag.tag_id}
                        style={{background: tag.tag_color_code, borderRadius: '25px'}}
                        onClick={()=> handleSelectTag(tag.tag_id)}>
                        {tag.tag_description}
                    </ListGroupItem>
                ))}

                {showedTags.length > 0 && (
                    <ListGroupItem className="custom-bg list-item"
                    onClick={()=> onSelectFeature('tags')}
                    >
                        More Tags
                    </ListGroupItem>
                )}

                {tags.length < 1 && (
                    <ListGroupItem className="custom-bg list-item" onClick={()=> setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} className="me-2"/>
                    Add New Tag
                </ListGroupItem>
                )}
            </ListGroup>
        </Nav.Item>

        <TagModal show={showModal} onHide={()=>setShowModal(false)}/>
    </>
}

function SideBar({onSelectFeature, onSelectCategoryId, onSelectTagId}){
    const { todayTask, upcomingTask } = useContext(TaskContext);
    return <>
        <div className="side-bar h-100 p-4 custom-bg">
            <h2>MENU</h2>   
            <Nav className="flex-column" variant="pills">
                <hr className="mt-2"/>
                <Nav.Item className="mb-3">
                    <h6>TASKS</h6>
                    <ListGroup variant="flush">
                        <ListGroupItem className="list-item custom-bg d-flex justify-content-between align-items-center" 
                        onClick={() => onSelectFeature('tasks_upcoming')}>
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faAngleDoubleRight} className="me-2"/>
                                Upcoming
                            </div>
                            {upcomingTask>0 && (
                                <Badge pill bg="primary">{upcomingTask}</Badge>
                            )}
                        </ListGroupItem>
                        <ListGroupItem className="custom-bg list-item d-flex justify-content-between align-items-center"
                        onClick={()=>onSelectFeature('tasks_today')}>
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faClipboardList} size="lg" className="me-2"/>
                                Today
                            </div>
                            {todayTask>0 && (
                                <Badge pill bg="primary">{todayTask}</Badge>
                            )}
                        </ListGroupItem>
                        <ListGroupItem className="custom-bg list-item"
                        onClick={()=>onSelectFeature('tasks_all')}>
                            <FontAwesomeIcon icon={faClipboardList} size="lg" className="me-2"/>
                            All Tasks
                        </ListGroupItem>
                    </ListGroup>
                </Nav.Item>
                <hr className="mt-2"/>
                <CategoryList onSelectFeature={onSelectFeature} onSelectCategoryId={onSelectCategoryId}/>
                <hr className="mt-2"/>
                <TagList onSelectFeature={onSelectFeature} onSelectTagId={onSelectTagId}/>
            </Nav>
        </div>
    </>
}

export default SideBar;
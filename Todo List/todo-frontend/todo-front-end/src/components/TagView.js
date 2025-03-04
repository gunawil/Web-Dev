import React, { useState, useContext} from "react";
import '../App.js'
import { TagContext } from "../contexts/TagContext.js";
import { TaskContext } from "../contexts/TaskContext.js"; 
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import TagModal from "./TagModal.js";
import { deleteTag } from "../services/tagService.js";


function TagView(){
    const { tags, onUpdateTag } = useContext(TagContext);
    const { onUpdateTagList } = useContext(TaskContext)
    const [ currTag, setCurrTag ] = useState();
    const [ isAdd, setIsAdd ] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [ filterText, setFilterText] = useState();

    const filterTag = tags.filter(tag=>{
        const filteredText = !filterText || tag.tag_description.includes(filterText);

        return filteredText;
    })

    async function handleDeleteButton(tagId){
        try{
            const data = {
                'tag_id': tagId,
            }
            const deletedTag = await deleteTag(tagId);
    
            onUpdateTag(data, false, true);
            onUpdateTagList(tagId);
        }catch(err){
            alert(`Failed to delete task: ${err}`);
        }
    }

    function handleEditButton(tag){
        setCurrTag(tag);
        setIsAdd(false);
        setShowModal(true);
    }

    return <>
        <Container className="h-100" style={{overflowY: 'auto'}}>
            <Row className="m-3">
                <h3 className="modul-title pb-3">TAG LIST</h3>
            </Row>
            <Row className="m-3 mt-5 filter-container">
                <Col lg={8} className="d-flex">
                    <Form.Control type='text'
                                    placeholder='Search Tag...'
                                    style={{ marginRight: '1rem', marginBottom: '1rem', width: '300px'}}
                                    value={filterText ?? ''}
                                    onChange={e=>setFilterText(e.target.value)}
                    />
                </Col>
                <Col lg={4} className="d-flex justify-content-end pb-3 pr-3">
                    <Button variant="primary" onClick={()=>setShowModal(true)}>New Tag</Button>
                </Col>
            </Row>
            <div className="d-flex flex-wrap m-3 col-auto">
                {filterTag && filterTag.map(tag=>(
                    <Button key={tag.tag_id}
                        className="m-2 d-flex justify-content-between align-items-center"
                        style={{backgroundColor: tag.tag_color_code, width: '200px', textAlign: 'center', cursor: 'default'}}
                    >
                        {tag.tag_description}
                        <div>
                            <FontAwesomeIcon icon={faPencilAlt} style={{cursor: 'pointer'}} size="sm"
                                onClick={()=>handleEditButton(tag)}
                            />
                            <FontAwesomeIcon icon={faTimes} onClick={()=>handleDeleteButton(tag.tag_id)}
                                        style={{ marginLeft: 5, paddingLeft: 5, borderLeft: '1px solid #ccc', cursor:'pointer'}} 
                                        size="lg"/>
                        </div>
                    </Button>
                ))}
            </div>
        </Container>

        <TagModal show={showModal} onHide={()=>setShowModal(false)} isAdd={isAdd} currData={currTag}/>
    </>
}

export default TagView;
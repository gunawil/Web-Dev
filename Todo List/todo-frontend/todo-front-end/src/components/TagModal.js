import { useState, useContext, useEffect } from "react";
import { TagContext } from "../contexts/TagContext";
import { TaskContext } from "../contexts/TaskContext";
import { saveTag, editTag } from "../services/tagService"; 
import { Modal, Button, Form, ModalBody, FormGroup } from "react-bootstrap";
import ColorPickPopOver from "./ColorPickPopOver";

function TagModal({show, onHide, isAdd=true, currData={}}){
    const { onUpdateTag } = useContext(TagContext);
    const { onUpdateTagList } = useContext(TaskContext);
    const [tagDesc, setTagDesc] = useState();
    const [tagColorCode, setTagColorCode] = useState('#ffffff');

    useEffect(()=>{
        if (show && !isAdd){
            setTagDesc(currData.tag_description);
            setTagColorCode(currData.tag_color_code);
        }
    }, [show, isAdd, currData])

    async function handleSave(e){
        e.preventDefault();

        if (isAdd){
            try{
                const newTag = await saveTag(tagDesc, tagColorCode);
    
                onUpdateTag(newTag, true);
    
                setTagDesc('');
                setTagColorCode('#fff');
                onHide()
            }catch(err){
                alert(`Failed to save tag: ${err}`);
            }
        }else{
            try{
                const dataTag = {
                    'tag_id': currData.tag_id,
                    'tag_description': tagDesc,
                    'tag_color_code': tagColorCode,
                }

                const editedTag = await editTag(dataTag);

                onUpdateTag(editedTag, isAdd);
                onUpdateTagList(currData.tag_id, tagDesc, tagColorCode);
                
                setTagDesc('');
                setTagColorCode('#fff');

                onHide();
            }catch(err){
                alert(`Failed to save tag: ${err}`);
            }
        }
    }

    return <>
        <Modal show={show}
                onHide={onHide}      
                backdrop="static"
                keyboard={false} 
                centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{isAdd ? "New Tag" : "Edit Tag"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="tagForm" onSubmit={handleSave}>
                    <Form.Group className="m-1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" name="tag_desc" placeholder="Tag Description" required
                        value={tagDesc} onChange={e => setTagDesc(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="m-1">
                        <Form.Label className="mt-1">Color (<i>Click box below to choose color</i>)</Form.Label>
                        <div className="d-flex align-items-center">
                            <ColorPickPopOver color={tagColorCode} onChange={(colorResult)=>setTagColorCode(colorResult.hex)} />
                            <span className="ms-2 text-center">{tagColorCode}</span>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="text-end">
                <Button variant="secondary" className="me-2" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" type="submit" form="tagForm">
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default TagModal;
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { SketchPicker } from "react-color";

function ColorPickPopOver({ color='#ffffff', onChange }){
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const handleToggle = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
    };

    const containerStyle = {
        position: "relative",
        display: "inline-block"
    };

    const swatchStyle = {
        width: "100px",
        height: "20px",
        // borderRadius: "10px", 
        background: color, 
        cursor: "pointer",
        border: "1px solid #ddd",
    };

    const popOverStyle = {
        position: "absolute",
        zIndex: 2,
        marginTop: "-200px",
        marginLeft: "50px",
    }

        return <>
        <div style={containerStyle}>
            <div style={swatchStyle} onClick={handleToggle}></div>

            {displayColorPicker && (
                <div style={popOverStyle}>
                    <SketchPicker color={color} onChange={onChange} disableAlpha/>
                    <Button type="button" variant="primary" onClick={handleClose}>Close</Button>
                </div>
            )}
        </div>
    </>
}

export default ColorPickPopOver;
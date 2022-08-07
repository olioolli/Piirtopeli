import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";
import styled from 'styled-components';

type CanvasDrawObject = {
    clear : () => void;
    undo : () => void;
    getSaveData : () => string;
    loadSaveData(saveData: String, immediate: Boolean);
}

export type DrawingComponentProps = {
    updateCanvasToBackend : (canvasData : string) => void;
    canvasData : string;
    disabled : boolean;
}

export const DrawingComponent = (props : DrawingComponentProps) => {

    const canvasRef = useRef(null);

    const getCanvasObject = () : CanvasDrawObject | undefined => {
        if( !canvasRef || !canvasRef.current ) return;
        return canvasRef.current;
    }

    const handleClear = () => {
        const canvasObj = getCanvasObject();
        canvasObj?.clear();
        handleCanvasChanged();
    };

    const handleUndo = () => {
        const canvasObj = getCanvasObject();
        canvasObj?.undo();
        handleCanvasChanged();
    };

    const handleCanvasChanged = () => {
        const canvasObj = getCanvasObject();
        if( !canvasObj ) return;

        props.updateCanvasToBackend(canvasObj.getSaveData());
    }

    return (
        <MainDiv>
            <CanvasContainer onMouseUp={handleCanvasChanged}>
                <CanvasDraw 
                    ref={canvasRef} 
                    immediateLoading={true} 
                    saveData={props.canvasData !== '' ? props.canvasData : '{"lines":[],"width":800,"height":600}'} 
                    disabled={props.disabled} 
                    canvasWidth={800} 
                    canvasHeight={600}
                    brushRadius={6}
                    lazyRadius={0}
                    />
            </CanvasContainer>
            <ButtonContainer>
                <Button disabled={props.disabled} onClick={handleClear}>Clear</Button>
                <Button disabled={props.disabled} onClick={handleUndo}>Undo</Button>
            </ButtonContainer>
        </MainDiv>
    );
}

const ButtonContainer = styled.div`
display: flex;
flex-direction: column;
`;

const Button = styled.button`
height: 50px;
    margin-left: 20px;
    margin-top:10px;
`;

const MainDiv = styled.div`
display: flex;
justify-content: center;
align-content: center;
align-items: center;
`;

const CanvasContainer = styled.div`
        display: flex;
        justify-content: center;
    `;

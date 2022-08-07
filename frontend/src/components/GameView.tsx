import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useGameState } from '../util/GameStateProvider';
import { DrawingComponent } from './DrawingComponent';
import { PlayerInfo } from './PlayerInfoComponent';

export const GameView = () => {

    const { gameState, updateCanvasToBackend,isCurrentPlayersTurn, endTurn } = useGameState();

    return (
        <MainDiv>
            <WordContainer>
                <WordLabel style={ { visibility: isCurrentPlayersTurn() ? 'visible' : 'hidden'}}>{gameState.currentWord}</WordLabel>
            </WordContainer>
            <DrawingComponent disabled={!isCurrentPlayersTurn()} canvasData={gameState.canvasData} updateCanvasToBackend={updateCanvasToBackend}></DrawingComponent>
            
            <PlayerInfoContainer>
                {
                    gameState.players.map( player => (
                        <PlayerInfo isActive={false} name={player} points={0}></PlayerInfo>   
                    ))
                }
                <Button disabled={!isCurrentPlayersTurn()} onClick={endTurn}>End turn</Button>
            </PlayerInfoContainer>
        </MainDiv>
    );
}

const Button = styled.button`
    width: 150px;
    font-weight: bold;
    height: 50px;
`;

const PlayerInfoContainer = styled.div`
position: fixed;
right: 30px;
top: 35%;
`;

const MainDiv = styled.div`
display: flex;
    flex-direction: column;
    align-items: center;
`;

const WordContainer = styled.div`
display: flex;
justify-content: center;
margin-bottom: 20px;
`;

const WordLabel = styled.div`
background: white;
width: 300px;
text-align: center;
padding-top: 10px;
padding-bottom: 10px;
font-size: 25px;
font-weight: bold;
`;

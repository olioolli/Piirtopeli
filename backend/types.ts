import randomWords from 'random-words';

export type GameState = {
    players : string[];
    turnOfPlayer: string;
    currentWord: string;
    canvasData: string;
}

export const copyGameState = (gameState : GameState) => {
    const players = [...gameState.players];
    return {
        players,
        turnOfPlayer: gameState.turnOfPlayer,
        currentWord: gameState.currentWord,
        canvasData: gameState.canvasData
    };
}

export const createGameState = (players : string[]) => {
    return {
        currentWord: randomWords(1)[0],
        players: players,
        turnOfPlayer : players[0],
        canvasData : ""
    };
}

export const getNextPlayer = (gameState : GameState) => {
    const players = gameState.players;
    let currentPlayerIdx = players.findIndex( (player) => player === gameState.turnOfPlayer );
    currentPlayerIdx++;
    if( currentPlayerIdx >= players.length )
        currentPlayerIdx = 0;
    return players[currentPlayerIdx];
}

export const getNextRandomWord = () => randomWords(1)[0];
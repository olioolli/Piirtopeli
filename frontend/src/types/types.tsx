export type GameState = {
    players : string[];
    turnOfPlayer: string;
    currentWord: string;
    canvasData: string;
}

export const createDummyGameState = () => {
    return {
        currentWord: "",
        players: [],
        turnOfPlayer : "",
        canvasData : ""
    };
}
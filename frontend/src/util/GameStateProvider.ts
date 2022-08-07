import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BE_URL, BE_WS_URL } from "../state";
import { GameState, createDummyGameState } from "../types/types";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { getCurrentPlayerName } from "./utils";

export const useGameState = () => {

    const [gameState, setGameState ] = useState<GameState>(createDummyGameState());

    const copyGameState = useCallback( () => {
        const players = [...gameState.players];
        return {
            players,
            turnOfPlayer: gameState.turnOfPlayer,
            currentWord: gameState.currentWord,
            canvasData: gameState.canvasData
        };
    },[gameState]);

    const sendGameStateToBE = async (state: GameState) => {
        const resp = await axios.post(BE_URL + "/game", { game: state });
        setGameState(resp.data);
    };

    const fetchGameStateFromBe = useCallback(() => {
        axios.get(BE_URL + "/game").then((resp) => {
            setGameState(resp.data);
        })
    }, []);

    const updateCanvasToBackend = useCallback( async (canvasData : string) => {
        const newGameState = copyGameState();
        newGameState.canvasData = canvasData;
        sendGameStateToBE(newGameState);
    },[gameState,copyGameState]);

    const endTurn = async () => {
        await axios.post(BE_URL + "/nextTurn");
    }

    const isCurrentPlayersTurn = () => getCurrentPlayerName() === gameState.turnOfPlayer;

    useEffect(() => {

        let client = new W3CWebSocket(BE_WS_URL);

        client.onopen = () => {};

        client.onmessage = (message) => {

            const newGameState = JSON.parse(message.data as string);
            if (newGameState)
                setGameState(newGameState);
        };

        fetchGameStateFromBe();
    }, [fetchGameStateFromBe]);

    return {
        gameState,
        updateCanvasToBackend,
        isCurrentPlayersTurn,
        endTurn
    };
}
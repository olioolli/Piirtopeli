"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextRandomWord = exports.getNextPlayer = exports.createGameState = exports.copyGameState = void 0;
var random_words_1 = __importDefault(require("random-words"));
var copyGameState = function (gameState) {
    var players = __spreadArray([], gameState.players, true);
    return {
        players: players,
        turnOfPlayer: gameState.turnOfPlayer,
        currentWord: gameState.currentWord,
        canvasData: gameState.canvasData
    };
};
exports.copyGameState = copyGameState;
var createGameState = function (players) {
    return {
        currentWord: (0, random_words_1.default)(1)[0],
        players: players,
        turnOfPlayer: players[0],
        canvasData: ""
    };
};
exports.createGameState = createGameState;
var getNextPlayer = function (gameState) {
    var players = gameState.players;
    var currentPlayerIdx = players.findIndex(function (player) { return player === gameState.turnOfPlayer; });
    currentPlayerIdx++;
    if (currentPlayerIdx >= players.length)
        currentPlayerIdx = 0;
    return players[currentPlayerIdx];
};
exports.getNextPlayer = getNextPlayer;
var getNextRandomWord = function () { return (0, random_words_1.default)(1)[0]; };
exports.getNextRandomWord = getNextRandomWord;

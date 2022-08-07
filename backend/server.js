"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing module
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var WebSocket = __importStar(require("ws"));
var http = __importStar(require("http"));
var types_1 = require("./types");
var app = (0, express_1.default)();
var PORT = 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
//initialize a simple http server
var server = http.createServer(app);
//initialize the WebSocket server instance
var wss = new WebSocket.Server({ server: server });
var gameState = (0, types_1.createGameState)([]);
wss.on('connection', function (ws) {
    ws.isAlive = true;
    ws.on('pong', function () {
        ws.isAlive = true;
    });
    ws.on('message', function (message) {
        if (message === "gamestate") {
        }
        ws.send("Received message: ".concat(message));
    });
});
server.listen(process.env.PORT || 8999, function () {
    console.log("Listening...");
});
setInterval(function () {
    wss.clients.forEach(function (ws) {
        var extWs = ws;
        if (!extWs.isAlive)
            return extWs.terminate();
        extWs.isAlive = false;
        extWs.ping(null, false);
    });
}, 10000);
var broadCastGameState = function () {
    wss.clients.forEach(function (ws) {
        var extWs = ws;
        if (!extWs.isAlive)
            return;
        extWs.send(JSON.stringify(gameState));
    });
};
// Handling GET / Request
app.get('/', function (req, res) {
    res.send('Welcome to typescript backend!');
});
// Server setup
app.listen(PORT, function () {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
});
app.post("/login", function (req, res) {
    if (req.body.username) {
        if (!addUser(req.body.username)) {
            res.sendStatus(400);
            return;
        }
        else {
            res.sendStatus(200);
            broadCastGameState();
            return;
        }
    }
    res.send(500);
});
app.post("/nextTurn", function (req, res) {
    var nextPlayer = (0, types_1.getNextPlayer)(gameState);
    gameState.turnOfPlayer = nextPlayer;
    gameState.currentWord = (0, types_1.getNextRandomWord)();
    gameState.canvasData = "";
    broadCastGameState();
    res.send(200);
});
app.get("/isLoggedIn", function (req, res) {
    try {
        var username = req.query.username;
        var result = getUser(username) != undefined;
        res.send(JSON.stringify({ isLoggedIn: result }));
    }
    catch (err) {
        res.send(JSON.stringify({ isLoggedIn: false }));
    }
});
app.post("/game", function (req, res) {
    gameState = req.body.game;
    broadCastGameState();
    res.status(200).json(gameState);
});
app.get("/game", function (req, res) {
    res.send(JSON.stringify(gameState));
});
app.get("/users", function (req, res) {
    res.send(JSON.stringify(users));
});
app.get("/reset", function (req, res) {
    // gameState = createInitialGameState(false);
    gameState = (0, types_1.createGameState)([]);
    users = [];
    broadCastGameState();
    res.send("Game reset");
});
app.get("/next", function (req, res) {
    gameState.currentWord = (0, types_1.getNextRandomWord)();
    broadCastGameState();
    res.send("Next");
});
var addUser = function (username) {
    if (getUser(username))
        return true;
    gameState.players.push(username);
    if (!gameState.turnOfPlayer)
        gameState.turnOfPlayer = username;
    users.push(username);
    return true;
};
var getUser = function (username) {
    for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
        var user = users_1[_i];
        if (user === username)
            return user;
    }
    return undefined;
};
var users = [];

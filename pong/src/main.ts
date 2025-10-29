import { GameField } from './core/gameField.js';
import { Player } from './entities/player.js';
import { Ball } from './entities/ball.js';
import { GameEngine } from './core/gameEngine.js';
import { getState } from './core/qLearning.js';
import { qLearning } from './core/qLearning.js';
import { Action } from './core/qLearning.js'

const field = new GameField(800, 600);
const player1 = new Player(30, 250);
const player2 = new Player(760, 250);
const ball = new Ball(400, 300, 5, 5, 10);
const ai = new qLearning();
const engine = new GameEngine(player1, player2, ball, field);
const pressedKeys = new Set<string>();
let isPaused = false;

window.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
		pressedKeys.add(e.key);
	}
	if (e.key === 'p')
		isPaused = !isPaused;
});

window.addEventListener('keyup', (e) => {pressedKeys.delete(e.key);});

function handleInput() {
	//if (pressedKeys.has('ArrowUp')) engine.movePlayer(player2, 'up');
	if (pressedKeys.has('w')) engine.movePlayer(player1, 'up');
	//if (pressedKeys.has('ArrowDown')) engine.movePlayer(player2, 'down');
	if (pressedKeys.has('s')) engine.movePlayer(player1, 'down');
}

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const scoreElement = document.getElementById('score')!;
const menuPause = document.getElementById('pause') as HTMLCanvasElement;
function updateScore() {
	scoreElement.textContent = `${engine.scoreP1} | ${engine.scoreP2}`;
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
	ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fill();
}

let time = 0;
let lastAction: Action = 'stay';

function gameLoop(timestamp: number) {
	handleInput();
	if (isPaused === false)
		engine.update();
	else
		menuPause.textContent = `ON PAUSE`; //faire un vrai menu
	render();
	if (timestamp - time > 1000) {
		const currentState = getState(ball, player2); // ton IA est player2
		const qValues = ai.getQValues(currentState);
		const action = ai.chooseAction(currentState);
		lastAction = action;
		console.log(`État: ${currentState}`);
		console.log(`Q-values:`, Object.fromEntries(qValues));
		console.log(`Action choisie: ${action}`);
		console.log(`Taille QTable: ${ai['qTable'].size}`);
		time = timestamp;
	}
	if (lastAction === 'up')
		engine.movePlayer(player2, 'up');
	if (lastAction === 'down')
		engine.movePlayer(player2, 'down');
	updateScore();
	if (engine.scoreP1 === 5 || engine.scoreP2 === 5)
		return ;
	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);


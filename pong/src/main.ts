import { GameField } from './core/gameField.js';
import { Player } from './entities/player.js';
import { Ball } from './entities/ball.js';
import { GameEngine } from './core/gameEngine.js';

const field = new GameField(800, 600);
const player1 = new Player(30, 250);
const player2 = new Player(760, 250);
const ball = new Ball(400, 300, 5, 5, 10);
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
const menuPause = document.getElementById('pause') as HTMLElement;
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

let lastTimestamp = 0;

function gameLoop(timestamp: number) {
	const deltaTime = timestamp - lastTimestamp;
	lastTimestamp = timestamp;
	handleInput();
	if (!isPaused) {
		engine.update(deltaTime);
	}
	else {
		menuPause.textContent = `ON PAUSE`;
	}
	render();
	updateScore();
	if (engine.scoreP1 === 5 || engine.scoreP2 === 5) {
		console.log('🏆 Partie terminée!');
		engine.AIController.save();
		return;
	}
	requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

import { GameField } from './core/gameField.js';
import { Player } from './entities/player.js';
import { Ball } from './entities/ball.js';
import { GameEngine } from './core/gameEngine.js';


const field = new GameField(800, 600);
const player1 = new Player(30, 300, 10);
const player2 = new Player(750, 300, 10);
const ball = new Ball(400, 300, 5, 5, 10);

const engine = new GameEngine(player1, player2, ball, field);
const pressedKeys = new Set<string>();

window.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {pressedKeys.add(e.key);}
});

window.addEventListener('keyup', (e) => {pressedKeys.delete(e.key);});

function handleInput() {
	if (pressedKeys.has('ArrowUp')) engine.movePlayer(player1, 'up');
	if (pressedKeys.has('w')) engine.movePlayer(player2, 'up');
	if (pressedKeys.has('ArrowDown')) engine.movePlayer(player1, 'down');
	if (pressedKeys.has('s')) engine.movePlayer(player2, 'down');
}

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function render() {
// efface l'écran
ctx.clearRect(0, 0, canvas.width, canvas.height);

// dessine le terrain
ctx.fillStyle = 'white';
ctx.fillRect(player1.x, player1.y, player1.width, player1.height); // player 1
ctx.fillRect(player2.x, player2.y, player2.width, player2.height); // player 2

// dessine la balle
ctx.fillStyle = 'white';
ctx.beginPath();
ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
ctx.fill();
}

function gameLoop() {
handleInput();
engine.update();
render();
requestAnimationFrame(gameLoop);
}

// démarre la boucle
gameLoop();


//function gameLoop() {
//	handleInput();
//	engine.update();
//	//render
//}

//gameLoop();

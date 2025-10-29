import { Ball } from './../entities/ball';
import { Player } from './../entities/player';
import { GameField } from './gameField';
import { qLearning } from './qLearning';

export class GameEngine {
	constructor (
		public player1: Player,
		public player2: Player,
		public ball: Ball,
		public field: GameField,
		public scoreP1: number = 0,
		public scoreP2: number = 0,
	) {}

	movePlayer(player: Player, direction: 'up' | 'down') {
		if (direction === 'up')
			player.y = Math.max(0, player.y - player.speed)
		else
			player.y = Math.min(this.field.height - player.height, player.y + player.speed);
	}

	private resetBall() {
		const angle = (Math.random() * Math.PI / 2) - (Math.PI / 4); // angle aléatoire entre -45° et +45° (en radians)
		const speed = 5;
		const direction = ((this.scoreP1 + this.scoreP2) % 2 === 0) ? 1 : -1; //envoie a gauche ou a droite

		this.ball.x = this.field.width / 2;
		this.ball.y = this.field.height / 2;
		this.ball.speedX = Math.cos(angle) * speed * direction;
		this.ball.speedY = Math.sin(angle) * speed;
	}

	private moveBall() {
		this.ball.x += this.ball.speedX;
		this.ball.y += this.ball.speedY;
		this.checkScore();
		if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.field.height) //changer la trajectoire apres collision
			this.ball.speedY *= -1;
	}

	private checkScore() {
		if (this.ball.x + this.ball.radius >= this.field.width) {
			this.scoreP1++;
			this.resetBall();
		}
		else if (this.ball.x - this.ball.radius <= 0) {
			this.scoreP2++;
			this.resetBall();
		}
	}

	private calculateBounce(player: Player, direction: 1 | -1) {
		const relativeY = (this.ball.y - (player.y + player.height / 2)); //Ou est-ce que la balle touche la raquette
		const normalizedY = relativeY / (player.height / 2); //valeur entre -1 et 1 si haut, milieu ou bas de la raquette
		const maxAngle = Math.PI / 3; //angle max de renvoi
		const angle = normalizedY * maxAngle; //angle calcule
		const speed = Math.sqrt(this.ball.speedX**2 + this.ball.speedY**2) * 1.05;

		this.ball.speedX = direction * Math.abs(speed * Math.cos(angle));
		this.ball.speedY = speed * Math.sin(angle);
	}

	private checkCollisions() {
		const ballLeft = this.ball.x - this.ball.radius;
		const ballRight = this.ball.x + this.ball.radius;
		const ballTop = this.ball.y - this.ball.radius;
		const ballBottom = this.ball.y + this.ball.radius;
		const p1Right = this.player1.x + this.player1.width;
		const p1Bottom = this.player1.y + this.player1.height;
		const p2Bottom = this.player2.y + this.player2.height;

		if (ballLeft <= p1Right && ballBottom >= this.player1.y && ballTop <= p1Bottom && this.ball.speedX < 0) {
			this.calculateBounce(this.player1, 1);
			this.ball.x = p1Right + this.ball.radius; //a corriger
		}
		if (ballRight >= this.player2.x && ballBottom >= this.player2.y && ballTop <= p2Bottom && this.ball.speedX > 0) {
			this.calculateBounce(this.player2, -1);
			this.ball.x = this.player2.x - this.ball.radius; //a corriger
		}
	}

	update() {
		this.moveBall();
		this.checkCollisions();
	}
}

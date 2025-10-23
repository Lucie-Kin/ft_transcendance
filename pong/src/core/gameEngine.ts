import { Ball } from './../entities/ball';
import { Player } from './../entities/player';
import { GameField } from './gameField';

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

	resetBall() {
		this.ball.x = this.field.width / 2;
		this.ball.y = this.field.height / 2;
		if ((this.scoreP1 + this.scoreP2) % 2 === 0)
			this.ball.speedX = Math.abs(this.ball.speedX);
		else
			this.ball.speedX = -Math.abs(this.ball.speedX);
	}

	moveBall() {
		this.ball.x += this.ball.speedX;
		this.ball.y += this.ball.speedY;
		this.checkScore();
		if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.field.height) //changer la trajectoire apres collision
			this.ball.speedY *= -1;
	}

	checkScore() {
		if (this.ball.x + this.ball.radius >= this.field.width) {
			this.scoreP1++;
			this.resetBall();
		}
		else if (this.ball.x - this.ball.radius <= 0) {
			this.scoreP2++;
			this.resetBall();
		}
	}

	checkCollisions() {
		if (this.ball.x - this.ball.radius <= this.player1.x + this.player1.width && //si bord gauche de la balle atteint le bord droit du paddle
			this.ball.y >= this.player1.y && this.ball.y <= this.player1.y + this.player1.height && //si le centre de la balle est entre le haut et le bas du paddle
			this.ball.speedX < 0) { //la balle va vers la gauche
			this.ball.speedX = Math.abs(this.ball.speedX); //vitesse positive -> vers la droite
		}
		if (this.ball.x + this.ball.radius >= this.player2.x && //si bord droit de la balle atteint le bord gauche du paddle
			this.ball.y >= this.player2.y && this.ball.y <= this.player2.y + this.player2.height && //si le centre de la balle est entre le haut et le bas du paddle
			this.ball.speedX > 0) { //la balle va vers la droite
			this.ball.speedX = -Math.abs(this.ball.speedX); //vitesse negative -> vers la gauche
		}
	}

	update() {
		this.moveBall();
		this.checkCollisions();
	}
}

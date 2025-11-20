import { Player } from '../entities/player.js';
import { Ball } from '../entities/ball.js';
import { GameField } from './gameField.js';
import { qLearning, Action } from './qLearning.js';

export class AIController {
	public player!: Player;
	public ball!: Ball;
	public field: GameField;

	private qLearning: qLearning;
	private refreshTimer = 0;
	private refreshRate = 1000;
	private lastState: string | null = null;
	private lastAction: Action | null = null;
	private currentAction: Action | null = null;
	private pendingReward = 0;
	constructor(field: GameField) {
		this.field = field;
		this.qLearning = new qLearning();
		this.load();
	}

	// méthode pour connecter l’IA à un nouveau joueur + balle
	attach(player: Player, ball: Ball) {
		this.player = player;
		this.ball = ball;
	}

	save() {
		const data = {
			qTable: Array.from(this.qLearning['qTable'].entries()).map(([state, actions]) => [
				state,
				Array.from(actions.entries())
			]),
			epsilon: this.qLearning['epsilon']
		};
		localStorage.setItem('pong_qlearning', JSON.stringify(data));
		console.log('Q-Table saved:', this.qLearning['qTable'].size, 'states');
	}

	load() {
		try {
			const saved = localStorage.getItem('pong_qlearning');
			if (!saved) {
				console.log('No save has been found');
				return ;
			}
			const data = JSON.parse(saved);
			this.qLearning['qTable'] = new Map(
				data.qTable.map(([state, actions]: [string, [Action, number][]]) => [
					state,
					new Map(actions)
				])
			);
			this.qLearning['epsilon'] = data.epsilon;
			console.log('✅ Q-Table load:', this.qLearning['qTable'].size, 'states');
		} catch (e) {
			console.error('❌ Error while loading:', e);
		}
	}

	predictBallPosition(ball: Ball, timeMs: number, field: GameField): Ball {
		let x = ball.x;
		let y = ball.y;
		let vx = ball.speedX;
		let vy = ball.speedY;

		// nombre de pas de simulation (environ 16 ms par frame)
		const steps = Math.ceil(timeMs / 16);

		for (let i = 0; i < steps; i++) {
			x += vx;
			y += vy;

			// rebond haut/bas
			if (y < 0) {
				y = -y;
				vy = -vy;
			}
			if (y > field.height) {
				y = 2 * field.height - y;
				vy = -vy;
			}

			// optionnel : rebond gauche/droite si tu veux prédire aussi les scores
			// if (x < 0) { x = -x; vx = -vx; }
			// if (x > field.width) { x = 2*field.width - x; vx = -vx; }
		}

		return new Ball(x, y, vx, vy, ball.radius);
	}




	update(deltaTime: number): Action | null {
		this.refreshTimer += deltaTime;
		if (this.refreshTimer >= this.refreshRate) {
			this.refreshTimer = 0;
			const predictedBall = this.predictBallPosition(this.ball, this.refreshRate, this.field);
			const currentState = getState(predictedBall, this.player);
			const action = this.qLearning.chooseAction(currentState);
			console.log('State:', currentState, 'Action:', action);
			if (this.lastState && this.lastAction) {
				const reward = this.calculateRewards() + this.pendingReward;
				this.pendingReward = 0;
				this.qLearning.updateQValue(this.lastState, this.lastAction, reward, currentState);
				console.log('Updated Q-value:', this.qLearning.getQValues(this.lastState).get(this.lastAction));
			}
			this.lastState = currentState;
			this.lastAction = action;
			this.currentAction = action;
		}
		return (this.currentAction);
	}

	private calculateRewards(): number {
		let reward = 0;

		// 1. Récompense de proximité
		const paddleCenter = this.player.y + this.player.height / 2;
		const distance = Math.abs(this.ball.y - paddleCenter);
		const maxDistance = this.field.height / 2;
		reward += (1 - distance / maxDistance) * 0.003;

		// 2. Récompense pour bonne direction
		if (this.currentAction === 'up' && this.ball.y < paddleCenter) reward += 0.01;
		if (this.currentAction === 'down' && this.ball.y > paddleCenter) reward += 0.01;
		if (this.currentAction === 'up' && this.ball.y > paddleCenter) reward -= 0.01;
		if (this.currentAction === 'down' && this.ball.y < paddleCenter) reward -= 0.01;

		return reward;
	}

	addReward(value: number) {
		this.pendingReward += value;
	}

	onPointScored(aiWon: boolean) {
		if (this.lastAction && this.lastState) {
			const reward = aiWon ? 10 : -10;
			const currentQ = this.qLearning.getQValues(this.lastState).get(this.lastAction)!;
			const newQ = currentQ + 0.1 * (reward - currentQ);
			this.qLearning.getQValues(this.lastState).set(this.lastAction, newQ);
			console.log('Updated Q-value after a goal:', this.qLearning.getQValues(this.lastState).get(this.lastAction));
		}
		this.lastAction = null;
		this.lastState = null;
		this.currentAction = null;
		this.refreshTimer = 0;
	}

	downloadQTable() {
		this.qLearning.downloadQTable();
	}

	async uploadQTable(file: File) {
		await this.qLearning.uploadQTable(file);
	}
}

export function getState(ball: Ball, ai: Player): string {
	const ballX = Math.floor(ball.x / 100);
	const ballY = Math.floor(ball.y / 100);
	const ballDirY = ball.speedY > 0 ? 'down' : 'up';
	const aiY = Math.floor(ai.y / 100);
	return (`${ballX}_${ballY}_${ballDirY}_${aiY}`);
}

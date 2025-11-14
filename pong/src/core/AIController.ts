import { Player } from '../entities/player.js';
import { Ball } from '../entities/ball.js';
import { GameField } from './gameField.js';
import { qLearning, Action } from './qLearning.js';

export class AIController {
	private qLearning: qLearning;
	private refreshTimer = 0;
	private refreshRate = 0;
	private lastState: string | null = null;
	private lastAction: Action | null = null;
	private currentAction: Action | null = null;
	constructor(
		private ai: Player,
		private ball: Ball,
		private field: GameField
	) {
		this.qLearning = new qLearning();
		this.load();
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

	update(deltaTime: number): Action | null {
		this.refreshTimer += deltaTime;
		if (this.refreshTimer >= this.refreshRate) {
			this.refreshTimer = 0;
			const currentState = getState(this.ball, this.ai);
			const action = this.qLearning.chooseAction(currentState);
			console.log('State:', currentState, 'Action:', action);
			if (this.lastState && this.lastAction) {
				const reward = this.calculateRewards()
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
		const paddleCenter = this.ai.y + this.ai.height / 2;
		const distance = Math.abs(this.ball.y - paddleCenter);
		const maxDistance = this.field.height / 2;
		// Récompense inversement proportionnelle à la distance
		const alignmentReward = 1 - (distance / maxDistance);
		// Bonus si la balle vient vers l'IA
		const approachBonus = this.ball.speedX > 0 ? 0.5 : 0;
		return (alignmentReward * 0.1 + approachBonus * 0.1);
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

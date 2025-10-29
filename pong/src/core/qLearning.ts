import { Player } from '../entities/player';
import { Ball } from '../entities/ball';
import { GameField } from './gameField';

export type Action = 'up' | 'down' | 'stay';

export class qLearning {
	private qTable: Map<string, Map<Action, number>> = new Map();
	private readonly actions: Action[] = ['up', 'down', 'stay'];
	//private alpha: number = 0.1;
	//private gamma: number = 0.9;
	private epsilon: number = 0.8;
	constructor () {
		this.qTable = new Map();
	}

	getQValues(state: string): Map<Action, number> {
		if (!this.qTable.has(state)) {
			this.qTable.set(state, new Map([
				['up', 0],
				['down', 0],
				['stay', 0]
			]));
		}
		return (this.qTable.get(state)!);
	}

	chooseAction(state: string): Action {
		if (Math.random() < this.epsilon) //explorer une nouvelle possibilite
			return (this.actions[Math.floor(Math.random() * this.actions.length)]);
		return (this.bestAction(state)); //meilleure action connue
	}

	private bestAction(state: string): Action {
		const qValues = this.getQValues(state);
		let bestAction: Action = 'stay';
		let bestValue = -Infinity;
		qValues.forEach((value, action) => { //trouver la meilleure action d'un etat donne
			if (value > bestValue) {
				bestAction = action;
				bestValue = value;
			}
		})
		return (bestAction);
	}
}

export function getState(ball: Ball, ai: Player): string {
	const ballX = Math.floor(ball.x / 100);
	const ballY = Math.floor(ball.y / 100);
	const ballDirY = ball.speedY > 0 ? 'down' : 'up';
	const aiY = Math.floor(ai.y / 100);
	return (`${ballX}_${ballY}_${ballDirY}_${aiY}`);
}

export type Action = 'up' | 'down' | 'stay';

export class qLearning {
	private qTable: Map<string, Map<Action, number>> = new Map();
	private readonly actions: Action[] = ['up', 'down', 'stay'];
	private alpha: number = 0.1;
	private gamma: number = 0.9;
	private epsilon: number = 1.0;
	private epsilonDecay: number = 0.995;
	private minEpsilon: number = 0.01;
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

	updateQValue(state: string, action: Action, reward: number, nextState: string) {
		const currentQ = this.getQValues(state).get(action)!;
		const nextQValues = this.getQValues(nextState);
		const maxNextQ = Math.max(...Array.from(nextQValues.values()));
		const newQ = currentQ + this.alpha * (reward + this.gamma * maxNextQ - currentQ);
		this.getQValues(state).set(action, newQ);
		this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);
	}

	downloadQTable() {
		const data = {
			qTable: Array.from(this.qTable.entries()).map(([state, actions]) => [
				state,
				Array.from(actions.entries())
			]),
			epsilon: this.epsilon,
			alpha: this.alpha,
			gamme: this.gamma,
			timestamp: new Date().toISOString(),
			statesExplored: this.qTable.size
		};
		const jsonString = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `pong-ai-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
		console.log('✅ Q-Table téléchargée:', this.qTable.size, 'états');
	}

	uploadQTable(file: File): Promise<void> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const data = JSON.parse(e.target?.result as string);
					this.qTable = new Map(
						data.qTable.map(([state, actions]: [string, [Action, number][]]) => [
							state,
							new Map(actions)
						])
					);
					this.epsilon = data.epsilon;
					console.log('✅ Q-Table chargée:', this.qTable.size, 'états');
					resolve();
				} catch (err) {
					console.error('❌ Erreur lors du chargement:', err);
					reject(err);
				}
			};
			reader.onerror = () => reject(reader.error);
			reader.readAsText(file);
		});
	}
}

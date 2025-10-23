export class Player {
	constructor (
		public x: number,
		public y: number,
		public speed: number,
		public readonly width: number = 20,
		public readonly height: number = 100
	) {}
}

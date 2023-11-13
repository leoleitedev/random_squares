export interface StringConfig {
	label: string;
	value: string;
}

export interface NumberConfig {
	label: string;
	value: number;
	min: number;
	max: number;
}
export interface Config {
	boxSize: NumberConfig;
	containerDimensionX: NumberConfig;
	containerDimensionY: NumberConfig;
	pixelMovement: NumberConfig;
	speed: NumberConfig;
	amountOfBoxes: NumberConfig;
}

export interface Box {
	x: number;
	y: number;
}

export type ConfigKey = keyof Config;

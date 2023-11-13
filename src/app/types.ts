interface StringConfig {
	label: string;
	value: string;
}

interface NumberConfig {
	label: string;
	value: number;
	min: number;
	max: number;
}
interface Config {
	boxSize: NumberConfig;
	containerDimensionX: NumberConfig;
	containerDimensionY: NumberConfig;
	pixelMovement: NumberConfig;
	speed: NumberConfig;
	amountOfBoxes: NumberConfig;
}

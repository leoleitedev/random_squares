import { Config } from "./types";

export const generateBoolean = (): boolean => Boolean(Math.random() > 0.5);

export const getRandomNumber = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getMaxY = (config: Config): number => {
	return config.containerDimensionY.value - config.boxSize.value;
};
export const getMaxX = (config: Config): number => {
	return config.containerDimensionX.value - config.boxSize.value;
};

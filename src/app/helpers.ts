export const generateBoolean = (): boolean => Math.random() > 0.5;

export const getRandomNumber = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

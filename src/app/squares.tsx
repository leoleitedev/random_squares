"use client";

import { Box, Config, ConfigKey } from "./types";
import { generateBoolean, getMaxX, getMaxY, getRandomNumber } from "./helpers";
import { useEffect, useMemo, useState } from "react";

import styles from "./page.module.css";

// Config that won't change
const screenPadding = 50;
const containerBorder = 10;
const sidebarWidth = 350;
const maxContainerWidth =
	window.innerWidth - screenPadding * 2 - containerBorder * 2 - sidebarWidth;

const maxContainerHeight =
	window.innerHeight - screenPadding * 2 - containerBorder * 2;

const DEFAULT_CONFIG = {
	pixelMovement: {
		value: 20,
		label: "Movement Distance",
		min: 1,
		max: 100,
	},
	speed: { value: 50, label: "Movement Frequency", min: 1, max: 1000 },
	amountOfBoxes: { value: 2, label: "Number of Boxes", min: 1, max: 1000 },
	boxSize: { value: 10, label: "Box Size", min: 1, max: 100 },
	containerDimensionX: {
		value: (maxContainerWidth + 100) / 2,
		label: "Container Width",
		min: 100,
		max: maxContainerWidth,
	},
	containerDimensionY: {
		value: (maxContainerHeight + 100) / 2,
		label: "Container Height",
		min: 100,
		max: maxContainerHeight,
	},
};

const validateMovement = (
	position: number, // either current x or y
	desiredPosition: number, // desired position of either x or y
	axisLength: number, // dimension of the container in either x or y
	boxSize: number
) => {
	// wanting to go down or left
	if (desiredPosition < position) {
		return desiredPosition >= 0 ? desiredPosition : 0;
	}
	// wanting to go up or right
	return desiredPosition <= axisLength - boxSize
		? desiredPosition
		: axisLength - boxSize;
};

const move = (x: number, y: number, config: Config) => {
	// Use randomness to define whether to go up or down
	const willMoveX = generateBoolean();
	const willMoveY = generateBoolean();

	const directionX = willMoveX ? (generateBoolean() ? "left" : "right") : false;
	const directionY = willMoveY ? (generateBoolean() ? "up" : "down") : false;

	let resultX = Number(`${x}`);
	let resultY = Number(`${y}`);

	if (directionY) {
		let movement = getRandomNumber(1, config.pixelMovement.value);
		if (directionY === "down") movement *= -1;
		resultY = validateMovement(
			resultY,
			resultY + movement,
			config.containerDimensionY.value,
			config.boxSize.value
		);
	}
	if (directionX) {
		let movement = getRandomNumber(1, config.pixelMovement.value);
		if (directionX === "left") movement *= -1;
		resultX = validateMovement(
			resultX,
			resultX + movement,
			config.containerDimensionX.value,
			config.boxSize.value
		);
	}

	return { x: resultX, y: resultY };
};

const setter = (
	boxes: Box[],
	setBoxes: React.Dispatch<React.SetStateAction<Box[]>>,
	config: Config,
	isSoundOn: boolean
) => {
	if (!boxes) return boxes;

	let copy = [...boxes];

	let anySquareMoved = false;

	for (let i = 0; i < config.amountOfBoxes.value; i++) {
		let newCoordinates = move(copy[i].x, copy[i].y, config);
		if (
			(!anySquareMoved && copy[i].x !== newCoordinates.x) ||
			copy[i].y !== newCoordinates.y
		) {
			anySquareMoved = true;
		}
		copy[i] = newCoordinates;
	}
	if (anySquareMoved && isSoundOn) {
		const audio = new Audio("@/../cartoon-jump-6462.mp3");
		audio.play();
	}

	setBoxes(copy);
};

const generateBoxes = (config: Config, prevBoxes?: Box[]): Box[] => {
	let result: Box[] = [];

	if (prevBoxes) {
		if (config.amountOfBoxes.value === prevBoxes.length) return prevBoxes;
		if (config.amountOfBoxes.value > prevBoxes.length) {
			let maxX = config.containerDimensionX.value - config.boxSize.value;
			let maxY = config.containerDimensionY.value - config.boxSize.value;
			for (let i = prevBoxes.length; i < config.amountOfBoxes.value; i++) {
				result.push({
					x: getRandomNumber(0, maxX),
					y: getRandomNumber(0, maxY),
				});
			}
			return result.concat(prevBoxes);
		}
		if (config.amountOfBoxes.value < prevBoxes.length)
			return prevBoxes.slice(0, config.amountOfBoxes.value);
	}

	for (let i = 0; i < config.amountOfBoxes.value; i++) {
		result.push({
			x: 0 * i * config.boxSize.value,
			y: 0 * i * config.boxSize.value,
		});
	}
	return result;
};

const reArrangeBoxesOnResize = (boxes: Box[], config: Config) => {
	console.log(config);
	const maxX = getMaxX(config);
	const maxY = getMaxY(config);
	for (let i = 0; i < boxes.length; i++) {
		if (boxes[i].x > maxX) boxes[i].x = maxX;
		if (boxes[i].y > maxY) boxes[i].y = maxY;
	}

	console.log(boxes);
	return boxes;
};

export default function Home() {
	const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
	const [boxes, setBoxes] = useState<Box[]>(generateBoxes(config));
	const [on, setOn] = useState<boolean>(true);
	const [soundOn, setSoundOn] = useState<boolean>(false);

	useEffect(() => {
		setBoxes(generateBoxes(config, boxes));
	}, [config.amountOfBoxes.value]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (on) setter(boxes, setBoxes, config, soundOn);
		}, 10000 / config.speed.value);
		return () => clearInterval(intervalId); // Cleanup the interval on component unmount
	}, [boxes, config, on]);

	useEffect(() => {
		setConfig(DEFAULT_CONFIG);
	}, [DEFAULT_CONFIG]);
	return (
		<div>
			<div className={styles.sidebar}>
				<div className={styles.config}>
					<div style={{ display: "flex", gap: "20px" }}>
						<label style={{ display: "flex", gap: "20px", cursor: "pointer" }}>
							<div className={styles.switch}>
								<input
									onChange={() => setOn(!on)}
									checked={on}
									type="checkbox"
								/>
								<span className={styles.slider} />
							</div>
							On / Off
						</label>
						<label style={{ display: "flex", gap: "20px", cursor: "pointer" }}>
							<div className={styles.switch}>
								<input
									onChange={() => setSoundOn(!soundOn)}
									checked={soundOn}
									type="checkbox"
								/>
								<span className={styles.slider} />
							</div>
							Sound On / Off
						</label>
					</div>
					{Object.keys(config).map((key, i: number) => (
						<div key={i} style={{ display: "flex", flexDirection: "column" }}>
							<label className={styles.configLabel}>
								{config[key as ConfigKey].label}
							</label>
							<input
								type="range"
								placeholder={config[key as ConfigKey].label}
								min={config[key as ConfigKey].min}
								max={config[key as ConfigKey].max}
								step={1}
								onChange={(e) => {
									let configCopy = {
										...config,
										[key as ConfigKey]: {
											...config[key as ConfigKey],
											value: Number(e.target.value),
										},
									};
									if (
										key === "boxSize" ||
										key === "containerDimensionX" ||
										key === "containerDimensionY"
									) {
										setBoxes(reArrangeBoxesOnResize(boxes, configCopy));
									}
									setConfig({
										...config,
										[key as ConfigKey]: {
											...config[key as ConfigKey],
											value: Number(e.target.value),
										},
									});
								}}
								value={config[key as ConfigKey].value}
							/>
							<span style={{ fontSize: "13px" }}>
								{config[key as ConfigKey].value}
							</span>
						</div>
					))}
				</div>
				<div className={styles.stats}>
					{boxes.map((box, i) => (
						<span key={i}>
							Box {i + 1}: X: {box.x}; Y: {box.y};
						</span>
					))}
				</div>
			</div>
			<main className={styles.main}>
				<div
					className={styles.container}
					style={{
						width: `${config.containerDimensionX.value}px`,
						height: `${config.containerDimensionY.value}px`,
					}}
				>
					{boxes.map((box, i) => (
						<div
							className={styles.square}
							style={{
								left: `${box.x}px`,
								bottom: `${box.y}px`,
								width: `${config.boxSize.value}px`,
								height: `${config.boxSize.value}px`,
							}}
							key={i}
						/>
					))}
					<div>•</div>
				</div>
			</main>
		</div>
	);
}

// My attempt of implementing https://www.khanacademy.org/computing/computer-programming/programming-games-visualizations/programming-3d-shapes/a/rotating-3d-shapes

const canvas = document.getElementById("canvas");
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

const hslGreen = `hsla(92, 100%, 50%, 1)`;
const hslYellow = `hsla(56, 100%, 50%, 1)`;
const hslBlue = `hsla(222, 100%, 50%, 1)`;
const hslRed = `hsla(7, 100%, 50%, 1)`;
const hslPurple = `hsla(280, 100%, 50%, 1)`;
const hslGrey = `hsla(108, 0%, 24%, 1)`;

const ctx = canvas.getContext("2d");

let deepestZ = 0;

function onResize() {
	width = canvas.offsetWidth;
	height = canvas.offsetHeight;
	if (window.devicePixelRatio > 1) {
		canvas.width = canvas.clientWidth * 2;
		canvas.height = canvas.clientHeight * 2;
		ctx.scale(2, 2);
	} else {
		canvas.width = width;
		canvas.height = height;
	}
	ctx.translate(canvas.width / 2, canvas.height / 2);
}
window.addEventListener("resize", onResize);

onResize();

const vertices = [
	[-100, -100, -100],
	[-100, -100, 100],
	[-100, 100, -100],
	[-100, 100, 100],
	[100, -100, -100],
	[100, -100, 100],
	[100, 100, -100],
	[100, 100, 100],
];

const edges = [
	[0, 1],
	[1, 3],
	[3, 2],
	[2, 0],
	[4, 5],
	[5, 7],
	[7, 6],
	[6, 4],
	[0, 4],
	[1, 5],
	[2, 6],
	[3, 7],
];

const faces = [
	[0, 1, 3, 2],
	[4, 5, 7, 6],
	[0, 1, 5, 4],
	[2, 3, 7, 6],
	[0, 2, 6, 4],
	[1, 3, 7, 5],
];

const faceColors = [hslBlue, hslGreen, hslGrey, hslPurple, hslRed, hslYellow];

function drawVert() {
	for (let i = 0; i < vertices.length; i++) {
		let vertex = vertices[i];
		ctx.beginPath();
		ctx.arc(vertex[0], vertex[1], 2, 0, 2 * Math.PI);
		ctx.stroke();
	}
}

function drawEdge() {
	for (let i = 0; i < edges.length; i++) {
		let v0 = edges[i][0];
		let v1 = edges[i][1];
		let vertex0 = vertices[v0];
		let vertex1 = vertices[v1];
		ctx.beginPath();
		ctx.moveTo(vertex0[0], vertex0[1]);
		ctx.lineTo(vertex1[0], vertex1[1]);
		ctx.stroke();
	}
}

function drawFace(face, color) {
	let facePath = new Path2D();
	facePath.moveTo(vertices[face[0]][0], vertices[face[0]][1]);
	for (let i = 1; i < face.length; i++) {
		let vertex = vertices[face[i]];
		facePath.lineTo(vertex[0], vertex[1]);
	}
	facePath.closePath();
	ctx.fillStyle = color;
	ctx.fill(facePath);
}

function rotateZ3D(theta) {
	let sinTheta = Math.sin(theta);
	let cosTheta = Math.cos(theta);

	for (let i = 0; i < vertices.length; i++) {
		let vertex = vertices[i];
		let x = vertex[0];
		let y = vertex[1];
		vertex[0] = x * cosTheta - y * sinTheta;
		vertex[1] = y * cosTheta + x * sinTheta;
	}
}

function rotateX3D(theta) {
	let sinTheta = Math.sin(theta);
	let cosTheta = Math.cos(theta);

	for (let i = 0; i < vertices.length; i++) {
		let vertex = vertices[i];
		let y = vertex[1];
		let z = vertex[2];
		vertex[1] = y * cosTheta - z * sinTheta;
		vertex[2] = z * cosTheta + y * sinTheta;
	}
}

function rotateY3D(theta) {
	let sinTheta = Math.sin(theta);
	let cosTheta = Math.cos(theta);

	for (let i = 0; i < vertices.length; i++) {
		let vertex = vertices[i];
		let x = vertex[0];
		let z = vertex[2];
		vertex[0] = x * cosTheta + z * sinTheta;
		vertex[2] = z * cosTheta - x * sinTheta;
	}
}

function clearCanvas() {
	ctx.clearRect(
		0 - canvas.width / 2,
		0 - canvas.height / 2,
		canvas.width,
		canvas.height
	);
}

function faceIsVisible(face) {
	for (let i = 0; i < face.length; i++) {
		let vertex = vertices[face[i]];
		console.log(vertex[2], deepestZ);
		if (vertex[2] === deepestZ) {
			return false;
		}
	}
	return true;
}

let angle = 0;
const fps = 120;
let now;
let then = Date.now();
const interval = 1000 / fps;
let delta;
function draw() {
	requestAnimationFrame(draw);

	now = Date.now();
	delta = now - then;

	if (delta > interval) {
		then = now - (delta % interval);

		clearCanvas();
		for (let i = 0; i < faces.length; i++) {
			if (faceIsVisible(faces[i])) {
				drawFace(faces[i], faceColors[i]);
			}
		}
		drawVert();
		drawEdge();
	}
}

let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;
let pMouseX = 0;
let pMouseY = 0;
canvas.addEventListener("mousedown", function (e) {
	isMouseDown = true;
	mouseX = e.offsetX;
	mouseY = e.offsetY;
});

canvas.addEventListener("mousemove", function (e) {
	mouseX = e.offsetX;
	mouseY = e.offsetY;
	if (isMouseDown) {
		clearCanvas();
		rotateY3D(mouseX - pMouseX);
		deepestZ = rotateX3D(pMouseY - mouseY);
		pMouseX = mouseX;
		pMouseY = mouseY;
	}
});

window.addEventListener("mouseup", function (e) {
	if (isMouseDown) {
		isMouseDown = false;
	}
});

rotateZ3D(100);
rotateY3D(100);
deepestZ = rotateX3D(100);

draw();

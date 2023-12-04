const PIXEL_DENSITY = 2;
let theShader;
let canvas;

let textureBase;

// Part 2 - Step 2.1
// from here
let control = {
	u_SmoothStepMin: 0.091,
	u_SmoothStepMax: 0.19,
	u_BrushStroke:45.0,
	u_noiseX: 3.4,
	u_noiseY:1.72,
}
// to here

// Part 2 - Step 2.2
// from here
window.onload = function() {
	var gui = new dat.GUI();
	gui.domElement.id = 'gui';
	gui.add(control, 'u_SmoothStepMin', 0.001, 0.2).name("SmoothStep Min");
	gui.add(control, 'u_SmoothStepMax', 0.1, 1.0).name("SmoothStep Max");
	gui.add(control, 'u_BrushStroke', 0.1, 200.0).name("Stroke Direction");
	gui.add(control, 'u_noiseX',0.01,10.0).name("Noise X");
	gui.add(control, 'u_noiseY',0.01,10.0).name("Noise Y");
};
// to here

// Part 1 - Step 4
// from here
function preload(){
	theShader = loadShader('vert.glsl', 'HatchingProcedural_JpPine.frag');
	textureBase = loadImage("data/BlurPine.jpg");
}
// to here

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function flipImage(img) {
	img.loadPixels();
	
	// Get the width and height of the image
	let w = img.width;
	let h = img.height;
  
	// Create a new array to store the flipped pixels
	let flippedPixels = new Uint8Array(4 * w * h);
  
	// Loop through the original pixels and copy them to the flippedPixels array
	for (let y = 0; y < h; y++) {
	  for (let x = 0; x < w; x++) {
		let index = (y * w + x) * 4;
		let flippedIndex = ((h - y - 1) * w + x) * 4;
  
		// Copy RGBA values
		flippedPixels[flippedIndex] = img.pixels[index];     // Red
		flippedPixels[flippedIndex + 1] = img.pixels[index + 1]; // Green
		flippedPixels[flippedIndex + 2] = img.pixels[index + 2]; // Blue
		flippedPixels[flippedIndex + 3] = img.pixels[index + 3]; // Alpha
	  }
	}
  
	// Assign the flipped pixels back to the image
	img.pixels.set(flippedPixels);
	img.updatePixels();
}

function setup() {
	pixelDensity(PIXEL_DENSITY);
	// canvas = createCanvas(1000,1000, WEBGL);
	canvas = createCanvas(windowWidth, windowHeight, WEBGL);
	
	flipImage(textureBase);

	background(0);
	noStroke();
	shader(theShader);
}

function draw() {
	var y = (mouseY-500) / min(1, windowWidth / windowHeight) + 500;
	
	theShader.setUniform("u_resolution", [width * PIXEL_DENSITY, height * PIXEL_DENSITY]);
	theShader.setUniform("u_mouse", [mouseX * PIXEL_DENSITY, (height-y) * PIXEL_DENSITY]);
  	theShader.setUniform("u_time", millis() / 1000.0);

	// Part 2 - Step 2.3
	// from here
	theShader.setUniform("u_SmoothStepMin", control.u_SmoothStepMin);
	theShader.setUniform("u_SmoothStepMax", control.u_SmoothStepMax);
	theShader.setUniform("u_BrushStroke", control.u_BrushStroke);
	theShader.setUniform("u_noiseX", control.u_noiseX);
	theShader.setUniform("u_noiseY", control.u_noiseY);

	theShader.setUniform("u_tex0", textureBase);
	// to here
	
	rect(width * -0.5, height * -0.5, width, height);
}

function keyPressed() {
	if (keyCode == ESCAPE) { dat.GUI.toggleHide(); }
}

let moon;
let starTextures = {};
let planetNames = ["mercury", "neptun", "mars"];
let currentTextureIndex = 0;
let nextTextureIndex = 0;
let transitionProgress = 1; // Start fully on current texture
let transitioning = false;
let current_time_offset;
let currentTexture;
let nextTexture;

function preload() {
  moon = loadImage("moon.jpg", img => {
    console.log("Moon loaded successfully.");
  }, err => {
    console.error("Error loading moon image.");
  });

  for (let name of planetNames) {
    starTextures[name] = loadImage(`${name}.jpg`, img => {
      console.log(`${name} loaded successfully.`);
    }, err => {
      console.error(`Error loading ${name} image.`);
    });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(0);
  current_time_offset = random(0, 10000); // זמן התחלה אקראי עבור הסיבוב
  currentTexture = starTextures["mercury"];
  nextTexture = starTextures["neptun"];
}

function draw() {
  // Change background color to a darker shade based on mouse position
  let brightness = map(mouseY, 0, height, 10, 50);
  background(brightness);

  let current_time = (millis() + current_time_offset) / 10000; // קצב סיבוב איטי
  rotateX(current_time * 0.06);
  rotateY(current_time * 0.06);
  rotateZ(current_time * 0.03);

  let mouseEffectX = map(mouseX, 0, width, -0.01, 0.01);
  let mouseEffectY = map(mouseY, 0, height, -0.01, 0.01);
  rotateX(mouseEffectY);
  rotateY(mouseEffectX);

  // Change texture index based on mouse position
  let index = floor(map(mouseX, 0, width, 0, planetNames.length));
  index = constrain(index, 0, planetNames.length - 1);

  if (index !== currentTextureIndex && !transitioning) {
    nextTextureIndex = index;
    nextTexture = starTextures[planetNames[nextTextureIndex]];
    transitioning = true;
    transitionProgress = 0;
  }

  if (transitioning) {
    transitionProgress += 0.2; // Adjust this value to change the transition speed

    if (transitionProgress >= 1) {
      transitionProgress = 1;
      currentTextureIndex = nextTextureIndex;
      currentTexture = nextTexture;
      transitioning = false;
    }
  }

  // Draw the larger sphere with crossfade effect
  drawSphereWithBlend(currentTexture, nextTexture, 1200, transitionProgress);

  // Draw the small sphere with crossfade effect
  drawSphereWithBlend(currentTexture, nextTexture, 150, transitionProgress);
}

function drawSphereWithBlend(currentTex, nextTex, size, progress) {
  push();
  translate(0, 0, 0);
  noStroke();

  // Draw next texture
  texture(nextTex);
  tint(255, 255 * progress); // Fade in next texture
  sphere(size);

  // Draw current texture
  texture(currentTex);
  tint(255, 255 * (1 - progress)); // Fade out current texture
  sphere(size);

  noTint(); // Reset tint
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

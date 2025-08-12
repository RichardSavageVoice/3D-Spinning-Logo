//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// --- ISOMETRIC CAMERA SETUP ---
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10; // Adjust to zoom in/out

const camera = new THREE.OrthographicCamera(
  frustumSize * aspect / -2, // left
  frustumSize * aspect / 2,  // right
  frustumSize / 2,           // top
  frustumSize / -2,          // bottom
  0.1,                       // near
  1000                       // far
);

// Classic isometric (x=y=z, looking at origin)
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

let object;
let controls;
let objToRender = 'BlenderLogov6.glb';
const loader = new GLTFLoader();

// Mouse tracking for rotation
let mouseNormX = 0;
let mouseNormY = 0;

loader.load(
  `./models/${objToRender}`,
  function (gltf) {
    object = gltf.scene;
    object.scale.set(2, 2, 2); // Scale up the model

    // Rotate 90 degrees clockwise on X axis
    object.rotation.x = Math.PI / 2;

    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);

// Less intense lighting
const topLight = new THREE.DirectionalLight(0xffffff, 2); // Lowered intensity
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 0.7); // Lowered intensity
scene.add(ambientLight);

// OrbitControls for isometric view (optional: restrict rotation/zoom for strict isometric)
controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
// Optionally restrict to isometric angle only
controls.minPolarAngle = controls.maxPolarAngle = Math.acos(1/Math.sqrt(3));
controls.minAzimuthAngle = controls.maxAzimuthAngle = Math.PI/4;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (object) {
    // Isometric, so you may want to limit mouse-based rotation, but here is how:
    object.rotation.y = mouseNormX * Math.PI * 0.25;
    object.rotation.z = mouseNormY * Math.PI * 0.15;
  }
  renderer.render(scene, camera);
}

// Window resize for orthographic camera
window.addEventListener("resize", function () {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = frustumSize * aspect / -2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = frustumSize / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.onmousemove = (e) => {
  mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseNormY = (e.clientY / window.innerHeight) * 2 - 1;
}

animate();

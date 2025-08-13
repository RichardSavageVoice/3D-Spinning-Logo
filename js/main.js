// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// --- ISOMETRIC CAMERA SETUP ---
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 5; // Adjust to zoom in/out

const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2, // left
  (frustumSize * aspect) / 2, // right
  frustumSize / 2, // top
  frustumSize / -2, // bottom
  0.1, // near
  1000 // far
);

// Set a good default "3D" view (isometric-like, but now orbitable)
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

let object;
let controls;
const loader = new GLTFLoader();

// --- Load the model and set correct orientation ---
loader.load(
  `./BlenderLogov6-1.glb`,
  function (gltf) {
    object = gltf.scene;
    object.scale.set(1, 1, 1);

    // Set model orientation: convert Blender Z-up to Three.js Y-up
    // Usually -90 degrees (or -Math.PI/2) rotation around X
    object.rotation.x = -Math.PI / 2;

    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);

// Less intense lighting
const topLight = new THREE.DirectionalLight(0xffffff, 1); // Lowered intensity
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1); // Lowered intensity
scene.add(ambientLight);

// --- ORBIT CONTROLS ---
// Let OrbitControls handle all orbiting (drag to rotate, scroll to zoom if enabled)
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enableRotate = true;
controls.enableZoom = true; // allow scroll to zoom (set to false if you want to disable zoom)
controls.enablePan = false; // disable panning for a cleaner experience

// Optionally: restrict angles for "isometric only" (comment these out for free rotation)
// controls.minPolarAngle = controls.maxPolarAngle = Math.acos(1 / Math.sqrt(3));
// controls.minAzimuthAngle = controls.maxAzimuthAngle = Math.PI / 4;

// --- Animation loop ---
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // required for damping to work
  renderer.render(scene, camera);
}

// --- Responsive resize ---
window.addEventListener("resize", function () {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = (frustumSize * aspect) / -2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = frustumSize / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();


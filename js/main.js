//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let object;
let controls;
let objToRender = 'BlenderLogov6.glb';
const loader = new GLTFLoader();

// Normalized mouse coordinates (-1 to +1)
let mouseNormX = 0;
let mouseNormY = 0;

loader.load(
  `./models/${objToRender}`,
  function (gltf) {
    object = gltf.scene;
    object.scale.set(2, 2, 2); // Scale up the model
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

camera.position.set(1, 1, 10);

// Less intense lighting
const topLight = new THREE.DirectionalLight(0xffffff, 2); // Lowered intensity
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 0.7); // Lowered intensity
scene.add(ambientLight);

controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  if (object) {
    object.rotation.y = mouseNormX * Math.PI * 0.25; // Follow mouse horizontally
    object.rotation.x = mouseNormY * Math.PI * 0.15; // Follow mouse vertically
  }
  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.onmousemove = (e) => {
  mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseNormY = (e.clientY / window.innerHeight) * 2 - 1;
}

animate();

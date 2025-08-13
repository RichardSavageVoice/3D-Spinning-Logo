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

// Set a light neutral background for contrast against black model
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);

let object;
let controls;
const loader = new GLTFLoader();

// --- Load the model and set correct orientation ---
loader.load(
  `./richard_savage_voice_logo.glb`,
  function (gltf) {
    object = gltf.scene;
    object.scale.set(1, 1, 1);

    // Set model orientation: convert Blender Z-up to Three.js Y-up
    object.rotation.x = -Math.PI / 2;

    // OPTIONAL: tweak material for better highlight on black surfaces
    object.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material.roughness = 0.3; // Lower roughness for more specular highlight
          child.material.metalness = 0.4; // Subtle metallic, helps reflect light
        }
      }
    });

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

// --- LIGHTING SETUP ---
// Key Light - strong white from above and side
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(2, 8, 6);
keyLight.castShadow = true;
scene.add(keyLight);

// Fill Light - softer, opposite side
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-4, 2, 2);
scene.add(fillLight);

// Rim/Back Light - from behind for silhouette highlight
const rimLight = new THREE.DirectionalLight(0xffffff, 0.7);
rimLight.position.set(0, 5, -10);
scene.add(rimLight);

// Ambient Light - subtle grey to soften shadows
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

// OPTIONAL: Spotlight from above for extra focus (can be commented out)
// const spotLight = new THREE.SpotLight(0xffffff, 0.4);
// spotLight.position.set(0, 10, 0);
// spotLight.angle = Math.PI / 6;
// spotLight.penumbra = 0.3;
// scene.add(spotLight);

// --- ORBIT CONTROLS ---
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

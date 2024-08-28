<template>
  <div ref="sceneContainerRef" class="full-width full-height" :data-beat-count="beatType">

  </div>
</template>

<script setup>
// Module Imports
import { ref } from 'vue';
import { gsap, Power1 } from 'gsap';
import * as THREE from 'three';

// Define Props
const props = defineProps({
  beatType: {
    type: Number,
    required: true
  }
})

// Init ThreeJS Scene
const sceneContainerRef = ref(null);
const renderer = ref(undefined);
const sceneRef = ref(undefined);

onMounted(() => {
  const { width, height } = sceneContainerRef.value.getBoundingClientRect();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 100);
  camera.position.set(0, 2, 8);
  camera.lookAt(0, 0, 0);

  renderer.value = new THREE.WebGLRenderer();
  renderer.value.setClearColor('red');
  renderer.value.setSize(width, height);
  renderer.value.setPixelRatio(devicePixelRatio);
  renderer.value.setAnimationLoop(animate);
  sceneContainerRef.value.appendChild(renderer.value.domElement);

  // Create block
  const boxGeometry = new THREE.BoxGeometry(2, 1, 2, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial ({
    color: 'hsl(0, 0%, 40%)'
  });
  // Large Cube Middle
  const cubeLarge = new THREE.Mesh(boxGeometry, boxMaterial);
  cubeLarge.scale.y = 0.2;
  cubeLarge.name = 'cubeLarge';
  scene.add(cubeLarge);
  // Small Cube Left
  const cubeSmallLeft = new THREE.Mesh(boxGeometry, boxMaterial);
  cubeSmallLeft.scale.y = 0.2;
  cubeSmallLeft.position.x = -3;
  cubeSmallLeft.name = 'cubeSmallLeft';
  scene.add(cubeSmallLeft);
  // Small Cube Right
  const cubeSmallRight = new THREE.Mesh(boxGeometry, boxMaterial);
  cubeSmallRight.scale.y = 0.2;
  cubeSmallRight.position.x = 3;
  cubeSmallRight.name = 'cubeSmallRight';
  scene.add(cubeSmallRight);


  // Create Lights
  const ambient = new THREE.AmbientLight('hsl(0, 0%, 30%)');
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight('white', 0.2);
  dirLight.position.set(0, 5, 5);
  scene.add(dirLight);

  // Render Scene
  function animate () {
    scene.rotation.y += 0.01;
    renderer.value.render(scene, camera);
  }

  // Store Scene in Ref
  sceneRef.value = scene;
});

onUpdated(() => {
  const cubeLarge = sceneRef.value.children.find((child) => child.name === 'cubeLarge');
  const cubeSmallLeft = sceneRef.value.children.find((child) => child.name === 'cubeSmallLeft');
  const cubeSmallRight = sceneRef.value.children.find((child) => child.name === 'cubeSmallRight');

  if (props.beatType === 4 || props.beatType === 1) {
    gsap.to(cubeLarge.scale, { y: 2, duration: 0.2, ease: Power1.easeInOut });
    gsap.to(cubeLarge.scale, { y: 0.5, duration: 0.2, delay: 0.2, ease: Power1.easeInOut });
  }
  if (props.beatType === 3) {
    gsap.to(cubeSmallRight.scale, { y: 1, duration: 0.2, ease: Power1.easeInOut });
    gsap.to(cubeSmallRight.scale, { y: 0.5, duration: 0.2, delay: 0.2, ease: Power1.easeInOut });
  }
  if (props.beatType === 3) {
    gsap.to(cubeSmallLeft.scale, { y: 1, duration: 0.2, ease: Power1.easeInOut });
    gsap.to(cubeSmallLeft.scale, { y: 0.5, duration: 0.2, delay: 0.2, ease: Power1.easeInOut });
  }
});

onBeforeUnmount(() => {
  renderer.value.dispose();
})
</script>
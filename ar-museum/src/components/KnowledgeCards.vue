<template>
  <div class="knowledge-cards glass-card">
    <h2>多媒体知识卡</h2>
    <div class="cards">
      <div class="card">
        <h3>3D 模型结构</h3>
        <div ref="viewerRef" class="viewer">
          <p v-if="!modelReady">加载 3D 模型中...</p>
        </div>
        <div class="control-row">
          <button class="chip" @click="rotateModel">旋转</button>
          <button class="chip" @click="resetModel">重置</button>
        </div>
      </div>

      <div class="card">
        <h3>纹饰特写</h3>
        <div class="patterns">
          <div v-for="pattern in patterns" :key="pattern.name" class="pattern">
            <img :src="pattern.image" :alt="pattern.name" />
            <p>{{ pattern.name }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>历史时间轴</h3>
        <div class="timeline">
          <div v-for="event in timeline" :key="event.year" class="event">
            <span class="dot"></span>
            <div>
              <p class="year">{{ event.year }}</p>
              <p class="desc">{{ event.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

const viewerRef = ref(null);
const modelReady = ref(false);

let scene;
let camera;
let renderer;
let mesh;
let animationFrame;

const patterns = [
  { name: '饕餮纹', image: '/placeholder.svg' },
  { name: '云雷纹', image: '/placeholder.svg' },
  { name: '夔龙纹', image: '/placeholder.svg' }
];

const timeline = [
  { year: '公元前 1600 年', desc: '商代早期，铸造工艺成熟' },
  { year: '公元前 1046 年', desc: '周代建立，礼制完善' },
  { year: '现代', desc: '出土修复，进入博物馆收藏' }
];

const initThree = () => {
  const width = viewerRef.value.clientWidth;
  const height = 280;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5fa);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 1, 2.5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  viewerRef.value.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  const directional = new THREE.DirectionalLight(0xffffff, 0.6);
  directional.position.set(2, 2, 2);
  scene.add(ambient, directional);

  const geo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 64, 1, true);
  const material = new THREE.MeshStandardMaterial({
    color: 0x5a7dff,
    metalness: 0.7,
    roughness: 0.25
  });
  mesh = new THREE.Mesh(geo, material);
  scene.add(mesh);
  modelReady.value = true;

  const animate = () => {
    animationFrame = requestAnimationFrame(animate);
    mesh.rotation.y += 0.005;
    renderer.render(scene, camera);
  };
  animate();
};

const rotateModel = () => {
  if (mesh) mesh.rotation.y += Math.PI / 4;
};

const resetModel = () => {
  if (!mesh || !camera) return;
  mesh.rotation.set(0, 0, 0);
  camera.position.set(0, 1, 2.5);
};

onMounted(() => {
  initThree();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);
  renderer?.dispose();
});
</script>

<style scoped lang="scss">
.knowledge-cards {
  padding: clamp(24px, 4vw, 40px);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  padding: 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 28px rgba(90, 125, 255, 0.15);
}

.viewer {
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(90, 125, 255, 0.08), rgba(127, 228, 212, 0.12));
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(31, 42, 68, 0.6);
}

.control-row {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.chip {
  border-radius: 999px;
  border: 1px solid rgba(90, 125, 255, 0.3);
  padding: 8px 16px;
  background: rgba(90, 125, 255, 0.08);
  cursor: pointer;
}

.patterns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;

  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 12px;
  }

  p {
    text-align: center;
    margin: 8px 0 0;
  }
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event {
  display: flex;
  gap: 12px;
  position: relative;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(120deg, #5a7dff, #7fe4d4);
  margin-top: 6px;
}

.year {
  margin: 0;
  font-weight: 600;
  color: #5a7dff;
}

.desc {
  margin: 4px 0 0;
  color: rgba(31, 42, 68, 0.7);
}
</style>


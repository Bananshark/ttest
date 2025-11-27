<template>
  <div class="ar-experience glass-card">
    <div class="ar-header">
      <h2>AR 识别体验</h2>
      <div class="actions">
        <button
          v-if="!isActive"
          class="primary"
          :disabled="loading"
          @click="startAR"
        >
          {{ loading ? '初始化中...' : '启动 AR' }}
        </button>
        <button v-else class="danger" @click="stopAR">停止 AR</button>
      </div>
    </div>

    <div ref="containerRef" class="ar-container">
      <video
        ref="videoRef"
        class="ar-video"
        autoplay
        playsinline
        muted
        v-show="isActive"
      ></video>
      <canvas ref="canvasRef" class="ar-canvas"></canvas>

      <div v-if="!isActive" class="placeholder">
        <div class="icon">📷</div>
        <p>点击“启动 AR”并将摄像头对准 Mind 图像</p>
        <p class="hint">建议在光线充足的环境中体验</p>
      </div>

      <div v-if="detectedArtifact" class="info-overlay">
        <div class="info-card">
          <div class="eyebrow">识别成功</div>
          <h3>{{ detectedArtifact.name }}</h3>
          <p class="meta">{{ detectedArtifact.era }} · {{ detectedArtifact.material }}</p>
          <p class="desc">{{ detectedArtifact.description }}</p>
          <button class="ghost" @click="openAIChat">AI 智能讲解</button>
        </div>
      </div>
    </div>

    <div class="control-row" v-if="isActive">
      <button class="secondary" @click="toggleModel">
        {{ modelVisible ? '隐藏模型' : '显示模型' }}
      </button>
      <button class="secondary" @click="captureFrame">保存画面</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { useArtifactsStore } from '@/store/useArtifactsStore';
import { checkWebARSupport, requestCameraPermission } from '@/utils/arHelper';

const emit = defineEmits(['open-ai-chat']);

const containerRef = ref(null);
const videoRef = ref(null);
const canvasRef = ref(null);
const isActive = ref(false);
const loading = ref(false);
const modelVisible = ref(true);
const detectedArtifact = ref(null);

const store = useArtifactsStore();

let mindarThree;
let anchor;
let mixer;
let currentModel;

const startAR = async () => {
  const support = checkWebARSupport();
  if (!support.supported) {
    alert('请在 HTTPS 环境下并使用支持 WebAR 的浏览器体验');
    return;
  }

  loading.value = true;
  try {
    await requestCameraPermission();
    const MindAR = await import('mind-ar-js/dist/mindar-image-three.prod.js');
    const { MindARThree } = MindAR.default || MindAR;

    mindarThree = new MindARThree({
      container: containerRef.value,
      imageTargetSrc: '/targets/museum.mind'
    });
    const { renderer, scene, camera } = mindarThree;

    anchor = mindarThree.addAnchor(0);
    anchor.onTargetFound = () => {
      detectedArtifact.value = mockArtifact;
      store.setSelected(mockArtifact);
    };
    anchor.onTargetLost = () => {
      detectedArtifact.value = null;
    };

    await loadModel(scene);

    await mindarThree.start();
    isActive.value = true;

    renderer.setAnimationLoop(() => {
      if (mixer) mixer.update(0.016);
      renderer.render(scene, camera);
    });
  } catch (error) {
    console.error(error);
    alert('启动 AR 失败，请检查摄像头或目标图资源');
  } finally {
    loading.value = false;
  }
};

const loadModel = async (scene) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(dracoLoader);

  try {
    const gltf = await loader.loadAsync('/models/bronze.glb');
    currentModel = gltf.scene;
    currentModel.scale.set(0.15, 0.15, 0.15);
    anchor.group.add(currentModel);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const directional = new THREE.DirectionalLight(0xffffff, 0.6);
    directional.position.set(0, 1, 1);
    scene.add(ambient, directional);

    if (gltf.animations?.length) {
      mixer = new THREE.AnimationMixer(currentModel);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }
  } catch (error) {
    console.warn('模型文件缺失，使用占位几何体');
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x5a7dff, metalness: 0.6, roughness: 0.3 })
    );
    anchor.group.add(box);
    currentModel = box;
  }
};

const stopAR = () => {
  if (mindarThree) {
    mindarThree.stop();
    mindarThree = null;
  }
  detectedArtifact.value = null;
  isActive.value = false;
};

const toggleModel = () => {
  modelVisible.value = !modelVisible.value;
  if (currentModel) currentModel.visible = modelVisible.value;
};

const captureFrame = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = url;
  link.download = `ar-capture-${Date.now()}.png`;
  link.click();
};

const openAIChat = () => {
  if (detectedArtifact.value) emit('open-ai-chat', detectedArtifact.value);
};

onUnmounted(() => stopAR());

const mockArtifact = {
  id: 'sample-1',
  name: '商代青铜鼎',
  era: '商代',
  material: '青铜',
  description: '商代礼器的典型代表，纹饰精美，象征祭祀礼制与王权。'
};
</script>

<style scoped lang="scss">
.ar-experience {
  padding: clamp(24px, 4vw, 40px);
}

.ar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;

  h2 {
    margin: 0;
  }
}

.actions {
  display: flex;
  gap: 12px;
}

.primary,
.danger,
.secondary,
.ghost {
  padding: 10px 20px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.primary {
  background: linear-gradient(120deg, #5a7dff, #7fe4d4);
  color: #fff;
  box-shadow: 0 10px 24px rgba(90, 125, 255, 0.35);
}

.danger {
  background: #ff6b6b;
  color: #fff;
}

.secondary {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(31, 42, 68, 0.2);
  color: #1f2a44;
}

.ghost {
  width: 100%;
  text-align: center;
  border: 1px solid rgba(90, 125, 255, 0.3);
  background: rgba(90, 125, 255, 0.08);
  color: #5a7dff;
}

.ar-container {
  position: relative;
  width: 100%;
  min-height: clamp(320px, 60vh, 640px);
  border-radius: 32px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(90, 125, 255, 0.1), rgba(127, 228, 212, 0.1));
}

.ar-video,
.ar-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(31, 42, 68, 0.7);
  gap: 8px;
  text-align: center;
  backdrop-filter: blur(6px);

  .icon {
    font-size: 3rem;
  }

  .hint {
    font-size: 0.9rem;
    opacity: 0.8;
  }
}

.info-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  align-items: flex-end;
  padding: 24px;
}

.info-card {
  width: 100%;
  border-radius: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.18);

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.75rem;
    color: #5a7dff;
  }

  h3 {
    margin: 8px 0;
  }

  .meta {
    color: rgba(31, 42, 68, 0.7);
    font-size: 0.9rem;
  }

  .desc {
    margin: 16px 0;
    color: rgba(31, 42, 68, 0.85);
    line-height: 1.6;
  }
}

.control-row {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .info-card {
    padding: 16px;
  }
}
</style>


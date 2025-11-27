<template>
  <div v-if="isOpen" class="drawer-overlay" @click.self="$emit('close')">
    <section class="drawer glass-card">
      <header>
        <div>
          <p class="eyebrow">AI 讲解助手</p>
          <h3>{{ artifact?.name || '文物讲解' }}</h3>
        </div>
        <button class="close" @click="$emit('close')">×</button>
      </header>

      <div ref="messageRef" class="messages">
        <div v-for="(msg, index) in messages" :key="index" class="bubble" :class="msg.role">
          <p>{{ msg.content }}</p>
        </div>
        <div v-if="loading" class="bubble ai typing">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="quick">
        <button v-for="item in quickQuestions" :key="item" @click="sendQuick(item)">
          {{ item }}
        </button>
      </div>

      <div class="input-row">
        <input
          v-model="draft"
          type="text"
          placeholder="想了解哪些内容？"
          @keyup.enter="sendMessage"
        />
        <button :disabled="!draft.trim()" @click="sendMessage">发送</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  artifact: {
    type: Object,
    default: null
  }
});

const quickQuestions = [
  '这件文物的历史背景？',
  '制作工艺有哪些特点？',
  '有什么文化意义？'
];

const messages = ref([]);
const draft = ref('');
const loading = ref(false);
const messageRef = ref(null);

const sendMessage = async () => {
  if (!draft.value.trim()) return;
  const question = draft.value.trim();
  messages.value.push({ role: 'user', content: question });
  draft.value = '';
  loading.value = true;
  await nextTick(() => scrollBottom());

  setTimeout(() => {
    messages.value.push({
      role: 'ai',
      content: generateMockAnswer(question)
    });
    loading.value = false;
    nextTick(() => scrollBottom());
  }, 800);
};

const sendQuick = (text) => {
  draft.value = text;
  sendMessage();
};

const scrollBottom = () => {
  if (messageRef.value) {
    messageRef.value.scrollTop = messageRef.value.scrollHeight;
  }
};

const generateMockAnswer = (question) => {
  const name = props.artifact?.name || '这件文物';
  if (question.includes('历史')) {
    return `${name}诞生于${props.artifact?.era || '古代'}时期，反映了当时的礼制与审美。`;
  }
  if (question.includes('工艺')) {
    return `其制作采用高温铸造与精细雕刻工艺，细节展现了匠人对力量与秩序的追求。`;
  }
  return `${name}具有重要的文化意义，既是权力象征，也是宗教仪式的重要载体。`;
};

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      messages.value = [
        {
          role: 'ai',
          content: `您好，我是 AI 讲解助手。关于「${props.artifact?.name || '文物'}」，想了解什么？`
        }
      ];
      nextTick(() => scrollBottom());
    }
  }
);
</script>

<style scoped lang="scss">
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 20px;
  z-index: 100;
}

.drawer {
  width: min(640px, 100%);
  border-radius: 28px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 80vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  background: rgba(31, 42, 68, 0.1);
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.bubble {
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 80%;
  line-height: 1.6;
  white-space: pre-wrap;

  &.ai {
    align-self: flex-start;
    background: rgba(90, 125, 255, 0.12);
    color: #1f2a44;
  }

  &.user {
    align-self: flex-end;
    background: linear-gradient(120deg, #5a7dff, #7fe4d4);
    color: #fff;
  }
}

.typing span {
  width: 8px;
  height: 8px;
  margin-right: 4px;
  background: rgba(90, 125, 255, 0.6);
  border-radius: 50%;
  display: inline-block;
  animation: blink 1.2s infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0.2;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

.quick {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  button {
    border-radius: 999px;
    border: 1px solid rgba(90, 125, 255, 0.3);
    background: rgba(90, 125, 255, 0.08);
    padding: 6px 16px;
    cursor: pointer;
  }
}

.input-row {
  display: flex;
  gap: 12px;

  input {
    flex: 1;
    border-radius: 18px;
    border: 1px solid rgba(31, 42, 68, 0.15);
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.9);
  }

  button {
    border-radius: 18px;
    border: none;
    padding: 12px 24px;
    background: linear-gradient(120deg, #5a7dff, #7fe4d4);
    color: #fff;
    font-weight: 600;
    cursor: pointer;
  }
}
</style>


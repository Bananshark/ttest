<template>
  <div class="home">
    <HeroSection />
    <section class="modules">
      <ArExperience @open-ai-chat="handleOpenAI" />
      <ArtifactLibrary
        :items="artifacts"
        @select="selectArtifact"
      />
      <KnowledgeCards />
    </section>

    <AiChatDrawer
      :is-open="drawerOpen"
      :artifact="selectedArtifact"
      @close="drawerOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HeroSection from '@/components/HeroSection.vue';
import ArExperience from '@/components/ArExperience.vue';
import ArtifactLibrary from '@/components/ArtifactLibrary.vue';
import KnowledgeCards from '@/components/KnowledgeCards.vue';
import AiChatDrawer from '@/components/AiChatDrawer.vue';

const artifacts = [
  {
    id: '1',
    name: '青铜鼎',
    era: '商代',
    material: '青铜',
    description: '庄重沉稳的青铜礼器，饕餮纹象征敬畏与权力。',
    featured: true,
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: '青花瓷瓶',
    era: '明代',
    material: '陶瓷',
    description: '釉色纯净、纹饰流畅的经典青花瓷，展现皇家审美。',
    featured: false,
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: '玉璜',
    era: '战国',
    material: '玉石',
    description: '玉器雕刻细腻，象征高贵身份与礼制文明。',
    featured: false,
    image: '/placeholder.svg'
  }
];

const drawerOpen = ref(false);
const selectedArtifact = ref(null);

const selectArtifact = (artifact) => {
  selectedArtifact.value = artifact;
  drawerOpen.value = true;
};

const handleOpenAI = (artifact) => {
  selectedArtifact.value = artifact;
  drawerOpen.value = true;
};
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.modules {
  display: grid;
  gap: 32px;
}
</style>


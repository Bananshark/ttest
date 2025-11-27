<template>
  <div class="artifact-library glass-card">
    <div class="library-header">
      <h2>文物精选</h2>
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索文物..."
        class="search"
      />
    </div>

    <div class="grid">
      <article
        v-for="artifact in filteredArtifacts"
        :key="artifact.id"
        class="card"
        @click="$emit('select', artifact)"
      >
        <div class="cover">
          <img :src="artifact.image" :alt="artifact.name" />
          <span class="badge" v-if="artifact.featured">精选</span>
        </div>
        <div class="content">
          <h3>{{ artifact.name }}</h3>
          <p class="meta">{{ artifact.era }} · {{ artifact.material }}</p>
          <p class="desc">{{ artifact.description }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

const keyword = ref('');

const filteredArtifacts = computed(() => {
  if (!keyword.value) return props.items;
  return props.items.filter((item) =>
    item.name.toLowerCase().includes(keyword.value.toLowerCase())
  );
});
</script>

<style scoped lang="scss">
.artifact-library {
  padding: clamp(24px, 4vw, 40px);
}

.library-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  h2 {
    margin: 0;
  }
}

.search {
  padding: 10px 16px;
  border-radius: 16px;
  border: 1px solid rgba(31, 42, 68, 0.2);
  background: rgba(255, 255, 255, 0.9);
  min-width: 220px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.card {
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 26px rgba(90, 125, 255, 0.15);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 36px rgba(90, 125, 255, 0.25);
  }
}

.cover {
  position: relative;
  height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .card:hover & img {
    transform: scale(1.05);
  }
}

.badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 999px;
  background: linear-gradient(120deg, #5a7dff, #7fe4d4);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
}

.content {
  padding: 20px;

  h3 {
    margin: 0 0 8px;
  }

  .meta {
    color: #5a7dff;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .desc {
    color: rgba(31, 42, 68, 0.75);
    line-height: 1.5;
  }
}
</style>


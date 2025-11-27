<template>
  <section class="dashboard">
    <header class="glass-card hero">
      <div>
        <p class="eyebrow">Analytics</p>
        <h1>数据面板</h1>
        <p>实时掌握 AR 体验表现，洞察用户行为与性能指标。</p>
      </div>
      <select v-model="period">
        <option value="today">今日</option>
        <option value="week">本周</option>
        <option value="month">本月</option>
      </select>
    </header>

    <section class="stats">
      <article v-for="stat in stats" :key="stat.title" class="card glass-card">
        <p class="eyebrow">{{ stat.title }}</p>
        <h2>{{ stat.value }}</h2>
        <p class="delta">{{ stat.delta }}</p>
      </article>
    </section>

    <section class="charts">
      <div class="glass-card chart">
        <h3>识别成功率趋势</h3>
        <canvas ref="chartRef" height="220"></canvas>
      </div>
      <div class="glass-card chart">
        <h3>热门文物</h3>
        <ul>
          <li v-for="item in topArtifacts" :key="item.name">
            <span>{{ item.name }}</span>
            <span>{{ item.count }} 次</span>
          </li>
        </ul>
      </div>
    </section>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const period = ref('today');
const stats = ref([
  { title: '今日访问', value: '12,480', delta: '+18% 较昨日' },
  { title: 'AI 讲解', value: '3,209', delta: '+42% 周环比' },
  { title: '识别成功率', value: '94.2%', delta: '+2.1% 提升' }
]);

const topArtifacts = ref([
  { name: '青铜鼎', count: 1250 },
  { name: '青花瓷瓶', count: 980 },
  { name: '玉璧', count: 756 }
]);

const chartRef = ref(null);

onMounted(() => {
  const canvas = chartRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height;
  const data = [85, 88, 92, 90, 94, 93, 95];

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(90,125,255,0.2)';
  for (let i = 0; i < 5; i++) {
    const y = (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#5a7dff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((value, index) => {
    const x = (width / (data.length - 1)) * index;
    const y = height - (value / 100) * height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
});
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero {
  padding: clamp(24px, 4vw, 40px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;

  select {
    border-radius: 16px;
    border: 1px solid rgba(31, 42, 68, 0.2);
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.9);
  }
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.card {
  padding: 20px;

  .delta {
    color: #5a7dff;
    font-weight: 600;
  }
}

.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.chart {
  padding: 24px;

  ul {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(31, 42, 68, 0.08);
    }
  }
}
</style>


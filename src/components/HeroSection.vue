<template>
  <section class="hero glass-card">
    <div>
      <p class="badge">MindAR.js · Three.js · AI 讲解</p>
      <h1>沉浸式 AR 文物导览</h1>
      <p class="subtitle">
        识别文物纹饰，实时渲染 3D 模型，并调用智能讲解，让用户在任意场景中重现千年珍藏。
      </p>
      <div class="actions">
        <button class="primary">立即体验</button>
        <RouterLink class="ghost" to="/dashboard">查看数据</RouterLink>
      </div>
    </div>
    <div class="hero-visual">
      <div class="orb"></div>
      <div class="orb secondary"></div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  padding: clamp(32px, 8vw, 64px);
  gap: 32px;
}

.badge {
  display: inline-flex;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(90, 125, 255, 0.12);
  color: #5a7dff;
  font-weight: 600;
}

h1 {
  margin: 16px 0;
  font-size: clamp(2.5rem, 6vw, 4rem);
}

.subtitle {
  color: rgba(31, 42, 68, 0.75);
  font-size: 1.1rem;
  line-height: 1.7;
}

.actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.primary,
.ghost {
  border-radius: 999px;
  padding: 12px 28px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.primary {
  background: linear-gradient(120deg, #5a7dff, #7fe4d4);
  color: #fff;
}

.ghost {
  border: 1px solid rgba(26, 32, 69, 0.2);
  background: transparent;
  color: #1a2045;
  text-align: center;
}

.hero-visual {
  position: relative;
  min-height: 320px;
}

.orb {
  position: absolute;
  inset: 0;
  border-radius: 32px;
  background: radial-gradient(circle at 20% 20%, #ffffff 0%, rgba(90, 125, 255, 0.6) 80%);
  box-shadow: 0 40px 80px rgba(90, 125, 255, 0.35);
}

.secondary {
  inset: 60px 40px 0 40px;
  background: radial-gradient(circle at 80% 40%, #ffffff 0%, rgba(127, 228, 212, 0.6) 80%);
  filter: blur(2px);
}
</style>


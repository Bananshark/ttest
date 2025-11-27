<template>
  <div class="app-shell">
    <header class="app-header glass-card">
      <div class="logo">Aurora AR</div>
      <nav>
        <RouterLink to="/">体验 AR</RouterLink>
        <RouterLink to="/dashboard">数据面板</RouterLink>
      </nav>
      <button class="cta">立即体验</button>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  padding: 32px clamp(16px, 6vw, 72px) 96px;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  margin-bottom: 40px;
  position: sticky;
  top: 16px;
  z-index: 10;
}

.logo {
  font-weight: 700;
  font-size: 1.25rem;
  color: #5a7dff;
}

nav {
  display: flex;
  gap: 24px;

  a {
    font-weight: 500;
    color: #1f2a44;
    transition: color 0.2s;

    &:hover {
      color: #5a7dff;
    }
  }
}

.cta {
  border: none;
  padding: 12px 28px;
  border-radius: 999px;
  background: linear-gradient(120deg, #5a7dff, #7fe4d4);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 18px 35px rgba(90, 125, 255, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 24px 45px rgba(90, 125, 255, 0.45);
  }
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 16px;
  }
}
</style>


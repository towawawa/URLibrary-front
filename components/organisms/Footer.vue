<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="links">
        <NuxtLink to="/privacy" class="link">プライバシーポリシー</NuxtLink>
        <span class="divider">|</span>
        <NuxtLink to="/terms" class="link">利用規約</NuxtLink>
        <span class="divider">|</span>
        <a
          class="link"
          href="https://imamoto-lab.com/"
          target="_blank"
          rel="noopener noreferrer"
          >お問い合わせ</a
        >
      </div>
      <div class="copy">© 2025 URLibrary</div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  margin-top: 2rem;
  border-top: 1px solid $border;
  background: $white;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.links {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.link {
  color: $text-muted;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    color: $text;
    text-decoration: underline;
  }
}

.divider {
  color: $border;
}

.copy {
  color: $text-muted;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .footer-inner {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>

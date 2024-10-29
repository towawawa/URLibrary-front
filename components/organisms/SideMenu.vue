<script lang="ts" setup>
import type { Genre } from '@/types/api/genre';

const genres = ref<Genre[]>([]);

const setGenres = async () => {
await fetcher('GET', '/genres')
  .then((res) => {
    genres.value = res.data as Genre[];
  })
  .catch((err) => {
    console.error(err);
  });
};

await setGenres();
</script>

<template>
  <div class="side-menu">
    <ul>
      <li>
        <img src="@/assets/images/tag-icon.svg" />
        <span>ALL</span>
      </li>
      <li v-for="genre in genres" :key="genre.id">
        <img :src="genre.imagePath" />
        <span>{{genre.name}}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.side-menu {
  width: 300px;
  height: 100vh;
  top: 0;
  left: 0;
  padding: 80px 20px 40px 40px;
  ul {
    list-style: none;
    li {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      border-radius: 0 10px 10px 0;
      img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }

      &:hover {
        cursor: pointer;
        background-color: $gray;
      }
    }
  }
}
</style>

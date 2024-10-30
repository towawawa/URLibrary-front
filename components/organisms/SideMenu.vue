<script lang="ts" setup>
import type { Genre } from '@/types/api/genre';
import { routeLocationKey } from 'vue-router';

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

const deleteQueryGenreId = () => {
  const route = useRoute();

  // 現在のクエリからtagIdを消してそのままの画面にrouter.push
  const query = { ...route.query };
  delete query.genreId;

  useRouter().push(joinPathWithQuery(route.path, query));
};

const route = useRoute();
const pushQueryGenreId = (genreId: number) => {
  // 現在のクエリにtagIdを追加してそのままの画面にrouter.push
  useRouter().push(joinPathWithQuery(route.path, { ...route.query, genreId }));
};

await setGenres();
</script>

<template>
  <div class="side-menu">
    <ul>
      <li @click="deleteQueryGenreId()">
        <img src="@/assets/images/tag-icon.svg" />
        <span>ALL</span>
      </li>
      <li
        v-for="genre in genres"
        :key="genre.id"
        :class="{ selected: Number(route.query.genreId) === genre.id }"
        @click="pushQueryGenreId(genre.id)"
      >
        <img :src="genre.imagePath" />
        <span>{{ genre.name }}</span>
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
        background-color: $hover;
      }

      &.selected {
        background-color: $hover;
      }
    }
  }
}
</style>

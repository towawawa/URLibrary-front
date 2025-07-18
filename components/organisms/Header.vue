<script lang="ts" setup>
const searchForm = useForm(
  { keyword: '' },
  { keyword: ['max:255'] },
  { keyword: '検索ワード' },
);

const showRegisterUrlPopup = ref(false);

// @todo ログアウト機能を実装
</script>

<template>
  <OrganismsUrlLibraryPopupRegister
    v-if="showRegisterUrlPopup"
    @close="showRegisterUrlPopup = false;"
  />
  <header>
    <div class="above">
      <nuxt-link class="logo" to="/"> URLibrary </nuxt-link>
      <div class="search-container">
        <button @click="searchForm.pushWithQuery('/')">
          <img src="@/assets/images/search-icon.svg" />
        </button>
        <AtomsInput
          class="contents"
          :value="searchForm.data.keyword"
          :error-message="searchForm.firstError('keyword')"
          @change="searchForm.update('keyword', $event)"
        />
      </div>
      <AtomsBtn class="ml-10" @click="showRegisterUrlPopup = true"
        >URLを追加</AtomsBtn
      >
      <p class="mr-0">User1</p>
    </div>

    <nav>
      <ul>
        <li>
          <nuxt-link to="/">
            <img src="@/assets/images/home-icon.svg" />
            <span>ホーム</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/calendar">
            <img src="@/assets/images/calendar-icon.svg" />
            <span>カレンダー</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
header {
  background-color: $white;
  padding: 0 10px 15px 10px;
  .above {
    display: flex;
    padding: 1rem;
    .logo {
      font-size: 2rem;
      font-weight: bold;
      color: $primary;
    }

    .search-container {
      display: flex;
      align-items: center;
      margin-left: 10%;
      width: 35%;

      img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        // エラーメッセージ分上にずらす
        margin-bottom: 5px;
      }

      input {
        width: 100%;
      }
    }

    p {
      text-align: center;
      align-items: center;
      display: flex;
      margin-left: auto;
      margin-right: 20px;
      font-size: 1.2rem;
      font-weight: bold;
    }
  }

  nav {
    ul {
      display: flex;
      li {
        padding: 5px 7px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        margin-left: 40px;
        a {
          display: flex;
          align-items: bottom;
          span {
            margin-top: 3px;
          }
        }
        img {
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 0.5rem;
        }

        &:hover {
          background-color: $hover;
        }
      }
    }
  }
}
</style>

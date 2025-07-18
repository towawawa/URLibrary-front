<script lang="ts" setup>
type Props = {
  form: ReturnType<typeof useForm<{ ym: string; hashTagId: number | null }>>;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const { hashTags } = useMaster();
const showTagDropdown = ref(false);
const dropdownRef = ref<HTMLElement>();

// 選択されたタグを取得
const selectedTag = computed(() => {
  if (!props.form.data.hashTagId) return null;
  return (
    hashTags.value.find((tag) => tag.id === props.form.data.hashTagId) || null
  );
});

// タグを選択する
const selectTag = (tagId: number | null) => {
  props.form.update('hashTagId', tagId);
  showTagDropdown.value = false;
};

// タグをクリア
const clearTag = () => {
  props.form.update('hashTagId', null);
};

// 外部クリックで閉じる（手動実装）
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showTagDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="calendar-search" :class="props.class">
    <div class="search-controls">
      <div class="date-control">
        <MoleculesChangeDateField
          :value="props.form.data.ym"
          @change="props.form.update('ym', $event)"
        />
      </div>

      <div class="filter-control">
        <!-- ハッシュタグフィルター -->
        <div class="tag-filter" ref="dropdownRef">
          <!-- 選択中のタグ表示 -->
          <div v-if="selectedTag" class="selected-tag-display">
            <div class="selected-tag">
              <i class="fas fa-hashtag tag-icon"></i>
              <span class="tag-name">{{ selectedTag.name }}</span>
              <button
                class="clear-tag-btn"
                @click="clearTag"
                title="フィルターをクリア"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- タグ選択ボタン -->
          <button
            v-else
            class="tag-selector"
            @click="showTagDropdown = !showTagDropdown"
            :class="{ active: showTagDropdown }"
          >
            <i class="fas fa-hashtag tag-icon"></i>
            <span class="selector-text">タグで絞り込み</span>
            <i
              class="fas fa-chevron-down dropdown-icon"
              :class="{ rotated: showTagDropdown }"
            ></i>
          </button>

          <!-- ドロップダウンメニュー -->
          <Transition name="dropdown">
            <div v-if="showTagDropdown" class="tag-dropdown">
              <div class="dropdown-header">
                <i class="fas fa-filter"></i>
                <span>タグで絞り込み</span>
              </div>
              <div class="tag-list">
                <button
                  v-for="tag in hashTags"
                  :key="tag.id"
                  class="tag-option"
                  @click="selectTag(tag.id)"
                >
                  <i class="fas fa-hashtag"></i>
                  <span>{{ tag.name }}</span>
                </button>
                <div v-if="hashTags.length === 0" class="no-tags">
                  <i class="fas fa-info-circle"></i>
                  <span>タグがありません</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-search {
  margin-bottom: 1.5rem;

  .search-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    .date-control {
      flex-shrink: 0;
    }

    .filter-control {
      min-width: 240px;
      max-width: 300px;
      flex: 1;
    }
  }
}

.tag-filter {
  position: relative;
  width: 100%;
}

// 選択中のタグ表示
.selected-tag-display {
  .selected-tag {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    background: linear-gradient(
      135deg,
      $primary-light 0%,
      lighten($primary-light, 5%) 100%
    );
    border: 2px solid $primary;
    border-radius: 25px;
    color: $primary-dark;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(116, 160, 67, 0.2);
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(116, 160, 67, 0.3);
      transform: translateY(-1px);
    }

    .tag-icon {
      font-size: 0.9rem;
      color: $primary;
    }

    .tag-name {
      font-size: 0.9rem;
      flex: 1;
    }

    .clear-tag-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 50%;
      transition: all 0.2s ease;
      color: $primary;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        color: $error;
      }

      i {
        font-size: 0.8rem;
      }
    }
  }
}

// タグ選択ボタン
.tag-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: $white;
  border: 2px solid $border-light;
  border-radius: 12px;
  color: $text-muted;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: $primary-light;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: $primary;
  }

  &.active {
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba(116, 160, 67, 0.15);
    color: $primary;
  }

  .tag-icon {
    font-size: 1rem;
    color: $primary-light;
  }

  .selector-text {
    flex: 1;
    text-align: left;
    font-weight: 500;
  }

  .dropdown-icon {
    font-size: 0.8rem;
    transition: transform 0.2s ease;

    &.rotated {
      transform: rotate(180deg);
    }
  }

  &:hover .tag-icon,
  &.active .tag-icon {
    color: $primary;
  }
}

// ドロップダウンメニュー
.tag-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: $white;
  border: 1px solid $border;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;

  .dropdown-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: $gray-50;
    border-bottom: 1px solid $border-light;
    color: $text-muted;
    font-size: 0.85rem;
    font-weight: 600;

    i {
      font-size: 0.8rem;
      color: $primary;
    }
  }

  .tag-list {
    max-height: 200px;
    overflow-y: auto;

    .tag-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      text-align: left;
      color: $text;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: $primary-light;
        color: $primary-dark;

        i {
          color: $primary;
        }
      }

      i {
        font-size: 0.8rem;
        color: $text-muted;
        transition: color 0.2s ease;
      }

      span {
        font-weight: 500;
      }
    }

    .no-tags {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      color: $text-muted;
      font-size: 0.85rem;
      text-align: center;
      justify-content: center;

      i {
        font-size: 0.8rem;
      }
    }
  }
}

// ドロップダウンアニメーション
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

// レスポンシブ対応
@media (max-width: 768px) {
  .calendar-search {
    margin-bottom: 1rem;

    .search-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;

      .filter-control {
        min-width: auto;
        max-width: none;
      }
    }
  }

  .tag-dropdown {
    .tag-list {
      max-height: 150px;
    }
  }
}

@media (max-width: 480px) {
  .calendar-search {
    margin-bottom: 0.75rem;

    .search-controls {
      gap: 0.5rem;
    }
  }

  .selected-tag-display .selected-tag {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;

    .tag-name {
      font-size: 0.85rem;
    }
  }

  .tag-selector {
    padding: 0.625rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>

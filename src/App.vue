<template>
  <div class="container grid-xxs">
    <template v-if="loggedIn">
      <button
        class="btn btn-sm btn-link"
        v-bind:class="{ loading: loading }"
        @click.prevent="fetchBookmarks()"
      >
        <i class="icon icon-refresh"></i>
      </button>
      <div class="divider"></div>
      <div class="tag-container">
        <a
          href="#"
          @click.prevent="selectLabel('')"
          class="label label-rounded label-primary tag-label"
        >
          All
        </a>
        <a
          v-for="label in labels"
          href="#"
          @click.prevent="selectLabel(label)"
          class="label label-rounded tag-label"
          v-bind:class="{ 'label-secondary': label === selectedLabel }"
        >
          {{ label }}
        </a>
      </div>
      <div class="divider"></div>
      <ul>
        <li v-for="b in bookmarks" class="bookmark-list">
          <a v-bind:href="b.url" @click.prevent="openURL(b.url, false)">{{
            b.title
          }}</a>
          <a
            v-for="label in b.labels"
            href="#"
            @click.prevent="selectLabel(label)"
            class="label label-rounded tag-label"
          >
            {{ label }}
          </a>
        </li>
      </ul>
      <ul class="pagination">
        <template v-for="i in totalPages">
          <li
            class="page-item"
            v-if="
              i === 1 ||
              i === totalPages ||
              (currentPage - 2 <= i - 1 && i - 1 <= currentPage + 2)
            "
            v-bind:class="{ active: i - 1 === currentPage }"
          >
            <a
              v-if="
                i === 1 ||
                i === totalPages ||
                (currentPage - 1 <= i - 1 && i - 1 <= currentPage + 1)
              "
              href="#"
              @click.prevent="setCurrentPage(i - 1)"
            >
              {{ i }}
            </a>
            <span v-else>...</span>
          </li>
        </template>
      </ul>
    </template>
    <template v-else>
      <a
        href="http://www.google.com/bookmarks"
        @click.prevent="openURL('http://www.google.com/bookmarks', true)"
      >
        Login
      </a>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { createStore } from './store';

export default defineComponent({
  name: 'App',

  setup() {
    const loading = ref(true);
    const store = createStore();

    onBeforeMount(async () => {
      loading.value = true;
      try {
        await store.fetchBookmarks();
      } catch (e) {
        console.error(e);
      }
      loading.value = false;
    });

    return {
      loading,

      loggedIn: computed(() => store.loggedIn),
      bookmarks: computed(() => store.bookmarks),
      labels: computed(() => store.labels),
      selectedLabel: computed(() => store.selectedLabel),
      totalPages: computed(() => store.totalPages),
      currentPage: computed(() => store.currentPage),

      selectLabel: store.selectLabel,
      setCurrentPage: store.setCurrentPage,

      async fetchBookmarks() {
        loading.value = true;
        try {
          await store.fetchBookmarks();
        } catch (e) {
          console.error(e);
        }
        loading.value = false;
      },
    };
  },

  methods: {
    openURL(url: string, active: boolean) {
      chrome.tabs.create({ url, active });
    },
  },
});
</script>

<style scoped>
@import '~spectre.css/dist/spectre.min.css';
@import '~spectre.css/dist/spectre-icons.min.css';

.container.grid-xxs {
  font-size: 14px;
  padding-top: 0.4rem;
}

li.bookmark-list {
  margin-top: 0;
}

.label.tag-label {
  margin: 0.1rem;
}

div.tag-container {
  letter-spacing: -0.4em;
}

div.tag-container > .label.tag-label {
  letter-spacing: normal;
}
</style>

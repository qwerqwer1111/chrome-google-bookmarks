<template>
  <div>
    <template v-if="loggedIn">
      <button
          class="btn btn-sm btn-link"
          v-bind:class="{ 'loading': loading }"
          @click.prevent="fetchBookmarks()">
        <i class="icon icon-refresh"></i>
      </button>
      <a href="#" @click.prevent="selectLabel('')">
        <span class="label label-rounded label-primary">Clear</span>
      </a>
      <div class="divider"></div>
      <span v-for="label in labels">
        <a href="#" @click.prevent="selectLabel(label)">
          <span
              class="label label-rounded tag-label"
              v-bind:class="{ 'label-primary': label === selectedLabel }">
            {{ label }}
          </span>
        </a>
      </span>
      <div class="divider"></div>
      <ul>
        <li v-for="b in bookmarks" class="bookmark-list">
          <a v-bind:href="b.url" @click.prevent="openUrl(b.url, false)">{{ b.title }}</a>
          <span v-for="label in b.labels" class="label label-rounded tag-label">{{ label }}</span>
        </li>
      </ul>
      <ul class="pagination">
        <li
            class="page-item"
            v-for="i in totalPage"
            v-bind:class="{ 'active': i - 1 === currentPage }">
          <a href="#" @click.prevent="selectCurrentPage(i - 1)">{{ i }}</a>
        </li>
      </ul>
    </template>
    <template v-else>
      <a
          href="http://www.google.com/bookmarks"
          @click.prevent="openUrl('http://www.google.com/bookmarks', true)">
        Login
      </a>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Bookmark } from '../model';

import {
  dispatchFetchBookmarks,
  dispatchSelectLabel,
  dispatchSetCurrentPage,
  readCurrentPage,
  readLabels,
  readLoggedIn,
  readSelectedBookmarks,
  readSelectedLabel,
  readTotalPage,
  SelectLabelActionPayload,
  SetCurrentPageActionPayload
} from '../store';

export default Vue.extend({
  name: 'Bookmarks',

  data() {
    return {
      loading: true
    };
  },

  computed: {
    labels(): string[] {
      return readLabels(this.$store);
    },

    bookmarks(): Bookmark[] {
      return readSelectedBookmarks(this.$store);
    },

    selectedLabel(): string {
      return readSelectedLabel(this.$store);
    },

    loggedIn(): boolean {
      return readLoggedIn(this.$store);
    },

    currentPage(): number {
      return readCurrentPage(this.$store);
    },

    totalPage(): number {
      return readTotalPage(this.$store);
    }
  },

  beforeMount() {
    dispatchFetchBookmarks(this.$store).then(() => {
      this.loading = false;
    }).catch(err => {
      this.loading = false;
      console.error(err);
    });
  },

  methods: {
    fetchBookmarks() {
      this.loading = true;
      dispatchFetchBookmarks(this.$store).then(() => {
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.error(err);
      });
    },

    selectLabel(label: string) {
      dispatchSelectLabel(this.$store, <SelectLabelActionPayload>{ label }).then();
    },

    openUrl(url: string, active: boolean) {
      chrome.tabs.create({ url, active });
    },

    selectCurrentPage(page: number) {
      dispatchSetCurrentPage(this.$store, <SetCurrentPageActionPayload>{ page }).then();
    }
  }
});
</script>

<style scoped>
  li.bookmark-list {
    margin-top: 0;
  }

  span.tag-label {
    margin: .1rem;
  }
</style>

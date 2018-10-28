<template>
  <div>
    <template v-if="loggedIn">
      <button
          class="btn btn-sm btn-link"
          v-bind:class="{ 'loading': loading }"
          @click.prevent="fetchBookmarks()">
        <i class="icon icon-refresh"></i>
      </button>
      <a href="#" @click.prevent="selectLabel('')" class="label label-rounded label-primary">
        Clear
      </a>
      <div class="divider"></div>
      <a
          v-for="label in labels"
          href="#"
          @click.prevent="selectLabel(label)"
          class="label label-rounded tag-label"
          v-bind:class="{ 'label-primary': label === selectedLabel }">
        {{ label }}
      </a>
      <div class="divider"></div>
      <ul>
        <li v-for="b in bookmarks" class="bookmark-list">
          <a v-bind:href="b.url" @click.prevent="openUrl(b.url, false)">{{ b.title }}</a>
          <a
              v-for="label in b.labels"
              href="#"
              @click.prevent="selectLabel(label)"
              class="label label-rounded tag-label">
            {{ label }}
          </a>
        </li>
      </ul>
      <ul class="pagination">
        <li
            class="page-item"
            v-for="i in totalPage"
            v-if="i === 1
              || i === totalPage
              || (currentPage - 2 <= i - 1 && i - 1 <= currentPage + 2)"
            v-bind:class="{ 'active': i - 1 === currentPage }">
          <a
              v-if="i === 1
                || i === totalPage
                || (currentPage - 1 <= i - 1 && i - 1 <= currentPage + 1)"
              href="#"
              @click.prevent="selectCurrentPage(i - 1)">
            {{ i }}
          </a>
          <span v-else>...</span>
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

  .label.tag-label {
    margin: .1rem;
  }
</style>

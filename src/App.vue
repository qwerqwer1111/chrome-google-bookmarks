<template>
  <div>
    <ul v-if="loggedIn">
      <li v-for="b in bookmarks">
        <a v-bind:href="b.url" @click="openUrl(b.url)">
          {{ b.title }}
        </a>: [{{ b.labels.join(',') }}]
      </li>
    </ul>
    <p v-else>
      <a href="javascript:void(0)" @click="openUrl('http://www.google.com/bookmarks')">
        Login
      </a>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  Bookmark,
  findBookmarks
} from './api';

export default Vue.extend({
  name: 'App',

  data() {
    return {
      bookmarks: <Bookmark[]>[],
      loggedIn: false
    };
  },

  beforeMount() {
    findBookmarks()
      .then(bookmarks => {
        this.loggedIn = true;
        this.bookmarks = bookmarks;
      })
      .catch(err => {
        this.loggedIn = false;
        console.error(err);
      });
  },

  methods: {
    openUrl(url: string): void {
      chrome.tabs.create({url});
    }
  }
});
</script>

<style scoped>
</style>

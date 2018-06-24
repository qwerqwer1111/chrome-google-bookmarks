<template>
  <div>
    <div v-if="loggedIn">
      <p><a href="#" @click="selectLabel('')">Clear</a></p>
      <span v-for="(label, index) in labels">
        <a href="#" @click="selectLabel(label)">
          {{ label }}
        </a>
        <span v-if="index !== labels.length - 1"> / </span>
      </span>
    </div>
    <ul v-if="loggedIn">
      <li v-for="b in bookmarks">
        <a v-bind:href="b.url" @click="openUrl(b.url, false)">
          {{ b.title }}
        </a>: [{{ b.labels.join(',') }}]
      </li>
    </ul>
    <p v-else>
      <a href="http://www.google.com/bookmarks"
         @click="openUrl('http://www.google.com/bookmarks', true)">
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
} from '../api';

export default Vue.extend({
  name: 'Bookmarks',

  data() {
    return {
      label: '',
      allBookmarks: <Bookmark[]>[],
      loggedIn: false
    };
  },

  computed: {
    labels: function (): string[] {
      const s = new Set<string>();
      this.allBookmarks.forEach(b => b.labels.forEach(l => s.add(l)));
      const r = <string[]>[];
      s.forEach(l => r.push(l));
      return r.sort();
    },

    bookmarks: function (): Bookmark[] {
      if (this.label === '') {
        return this.allBookmarks;
      }
      return this.allBookmarks
        .filter(b => b.labels.includes(this.label));
    }
  },

  beforeMount() {
    findBookmarks().then(bookmarks => {
      this.loggedIn = true;
      this.allBookmarks = bookmarks;
    }).catch(err => {
      this.loggedIn = false;
      console.error(err);
    });
  },

  methods: {
    selectLabel(label: string) {
      this.label = label;
    },

    openUrl(url: string, active: boolean) {
      chrome.tabs.create({url, active});
    }
  }
});
</script>

<template>
  <div>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else-if="loggedIn">
      [<a href="#" @click="selectLabel('')">Clear</a>] |
      <span v-for="(label, index) in labels">
        <a href="#" @click="selectLabel(label)">{{ label }}</a>
        <span v-if="index !== labels.length - 1"> / </span>
      </span>
      <ul>
        <li v-for="b in bookmarks">
          <a v-bind:href="b.url" @click="openUrl(b.url, false)">
            {{ b.title }}
          </a>: [{{ b.labels.join(',') }}]
        </li>
      </ul>
    </div>
    <div v-else>
      <p>
        <a href="http://www.google.com/bookmarks"
           @click="openUrl('http://www.google.com/bookmarks', true)">
          Login
        </a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Bookmark} from '../model';

import {
  dispatchFetchBookmarks,
  dispatchSelectLabel,
  readLabels,
  readLoggedIn,
  readSelectedBookmarks,
  SelectLabelActionPayload
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

    loggedIn(): boolean {
      return readLoggedIn(this.$store);
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
    selectLabel(label: string) {
      dispatchSelectLabel(this.$store, <SelectLabelActionPayload>{label}).then();
    },

    openUrl(url: string, active: boolean) {
      chrome.tabs.create({url, active});
    }
  }
});
</script>

<template>
  <div>
    <div>
      <p v-if="loading">Loading...</p>
      <p v-else-if="loggedIn">
        <a href="#" @click.prevent="fetchBookmarks()">Reload</a>
      </p>
    </div>
    <div v-if="loggedIn">
      [<a href="#" @click.prevent="selectLabel('')">Clear</a>] |
      <span v-for="(label, index) in labels">
        <b v-if="label === selectedLabel">
          <a href="#" @click.prevent="selectLabel(label)">{{ label }}</a>
        </b>
        <a v-else href="#" @click.prevent="selectLabel(label)">{{ label }}</a>
        <span v-if="index !== labels.length - 1"> / </span>
      </span>
      <ul>
        <li v-for="b in bookmarks">
          <a v-bind:href="b.url" @click.prevent="openUrl(b.url, false)">
            {{ b.title }}
          </a>: [{{ b.labels.join(',') }}]
        </li>
      </ul>
    </div>
    <div v-else>
      <p>
        <a href="http://www.google.com/bookmarks"
           @click.prevent="openUrl('http://www.google.com/bookmarks', true)">
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
  readSelectedLabel,
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

    selectedLabel(): string {
      return readSelectedLabel(this.$store);
    },

    loggedIn(): boolean {
      return readLoggedIn(this.$store);
    }
  },

  beforeMount() {
    this.fetchBookmarks();
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
      dispatchSelectLabel(this.$store, <SelectLabelActionPayload>{label}).then();
    },

    openUrl(url: string, active: boolean) {
      chrome.tabs.create({url, active});
    }
  }
});
</script>

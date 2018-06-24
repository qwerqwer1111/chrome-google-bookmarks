<template>
  <div>
    <p v-if="loggedIn">{{ text }}</p>
    <p v-else>
      <a href="javascript:void(0)" @click="openLoginLink">Login</a>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data() {
    return {
      text: '',
      loggedIn: false
    };
  },

  beforeMount() {
    fetch('https://www.google.com/bookmarks/?output=xml', {credentials: 'include'})
      .then(r => r.text())
      .then(text => {
        this.loggedIn = true;
        this.text = text;
      })
      .catch(err => {
        this.loggedIn = false;
        console.error(err);
      });
  },

  methods: {
    openLoginLink() {
      chrome.tabs.create({url: 'http://www.google.com/bookmarks'});
    }
  }
});
</script>

<style scoped>
</style>

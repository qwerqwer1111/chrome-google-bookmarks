<template>
  <div class="container grid-xxs">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App'
});
</script>

<style>
  @import "~spectre.css/dist/spectre.min.css";
  @import "~spectre.css/dist/spectre-icons.min.css";

  .container.grid-xxs {
    max-width: 380px;
    font-size: 14px;
    padding-top: .4rem;
  }
</style>

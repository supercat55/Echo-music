<template>
  <div id="app">
    <tab></tab>
    <router-view></router-view>
    <player></player>
  </div>
</template>

<script>
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  name: 'app',
  components: {
    Tab,
    Player
  }
}
</script>

<style>
#app {
  color: #fff;
  height: 100%;
}
.wrap {
  width: 0 .3rem;
}
</style>

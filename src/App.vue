<template>
  <div id="app" style="background-image: url(http://42.193.251.7:8003/developer/image/20240107/1704635261124.jpg);background-size: cover;">
    <router-view />
  </div>
</template>

<style>
 @import './assets/global.css';

 #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>

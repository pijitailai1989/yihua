<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import Vue from 'vue'
  Vue.prototype.toRoute = [];
  Vue.prototype.fromRoute = [];
  Vue.prototype.obj = {};
  export default {
    name: 'app',
    watch: {
      '$route'(to, from) {
        Vue.prototype.$formPath = from.path;
        if(!Vue.prototype.obj[from.path]){
          Vue.prototype.fromRoute.push(from.path);
          Vue.prototype.obj[from.path] = from.path;
        }else{
          Vue.prototype.fromRoute.pop(from.path);
          delete Vue.prototype.obj[from.path]
        }
        // console.log(Vue.prototype.fromRoute);

      }
    }
  }

</script>

<style>
  #app {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
  }
</style>

<template>
  <div id="app">
    <MapFilters />
    <Map />
  </div>
</template>

<script>
import Map from './components/Map.vue';
import MapFilters from './components/MapFilters';

export default {
  name: 'app',
  components: {
    Map,
    MapFilters
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

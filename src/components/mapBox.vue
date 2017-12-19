<template>
<div class="mapboxWrap">
  <div class="row">
   <div class="theMap col s9 m9">
    <g-map :name="mapName" :data="mapData" ></g-map>
  </div>
    <div class="filterBox col s3 m3">
      <map-filter v-for="(filter, key, index) in filters" :o-key="'mapOptions-'+index" :filter-title="key" :data="filter" :checktype="'radio'" @getValue="getfilterValue" :key="'mapOptions-'+index"></map-filter>
       <div class="clearfix"></div>
    </div>
  </div>
</div>
</template>

<script>

// import { mapGetters, mapActions } from 'vuex';
import loadingAni from './LoadingAni.vue';
import mapFilter from './mapFilter.vue';
import gMap from './gMap.vue';


export default {
  name: 'mapBox',
  data() {
    return {
      // countries,
      mapName: 'data',
      filterOption: {},
      mapDatakey: '',
    };
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  components: {
    loadingAni,
    mapFilter,
    gMap,
  },
  created() {
    this.initFilter();
  },
  computed: {
    filters() {
      return this.data.filters || {};
    },
    mapData() {
      return this.data.values[this.mapDatakey] || {};
    },
  },
  methods: {
    initFilter() {
      for (let i = 0; i < Object.keys(this.filters).length; i += 1) {
        this.$set(this.filterOption, Object.keys(this.filters)[i], '');
      }
    },
    getfilterValue(value) {
      this.filterOption[value.key] = value.value;
      const mapDatakey = [];
      for (let i = 0; i < Object.values(this.filterOption).length; i += 1) {
        mapDatakey.push(Object.values(this.filterOption)[i]);
      }
      this.mapDatakey = mapDatakey.join('-');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .mapboxWrap{
    height: calc(100vh - 50px);
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    vertical-align: top;
    width: 100%;
    align-content: stretch;
    .row{
      width: inherit;
      height: inherit;
    }
    .theMap{
      height: inherit;
    }
  }
</style>

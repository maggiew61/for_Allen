<template>
  <div class="mapWarp">
    <div :id="mapName" class="mapBox" @mousemove="getPosition"></div>
    <div class="colorSet">
      <div class="colorLabels">
        <div class="colorLabel" :title="minValue">{{minValue}}</div>
        <div class="colorLabel" :title="maxValue">{{maxValue}}</div>
      </div>
      <div class="colorBlocks" style="background: #157A6E"></div><div class="colorBlocks" style="background: #00853F"></div><div class="colorBlocks" style="background: #8EA604"></div><div class="colorBlocks" style="background: #F2B500"></div><div class="colorBlocks" style="background: #E94F37"></div><div class="colorBlocks" style="background: #92140C"></div>
    </div>
    <div v-html="tooltipHtml"
        :style="{ 'top': tooltipPosition.y +'px', 'left': tooltipPosition.x  +'px'}"
        :class="['chart-tooltip', {'active': tooltipHtml }]">
    </div>
  </div>
</template>


<script>

import * as d3 from 'd3';
import loadingAni from './LoadingAni';
import countries from '../js/store/countries.json';
import mapStyle from '../js/googleMapStyle.json';

let map = null;

export default {
  name: 'gMap',
  created() {
  },
  data() {
    return {
      countries,
      mapName: this.name + '-map',
      geoJsonData: null,
      tooltipHtml: '',
      tooltipPosition: { x: 0, y: 0 },
    };
  },
  props: {
    name: {
      type: String,
    },
    data: {
      type: Object,
      default: {},
    },
  },
  components: {
    loadingAni,
  },
  mounted() {
    this.initMap();
  },
  watch: {
    data() {
      this.mapData();
    },
  },
  computed: {
    minValue() {
      return d3.min(Object.values(this.data));
    },
    maxValue() {
      return d3.max(Object.values(this.data));
    },
  },
  methods: {
    initMap() {
      // 初始化地圖
      const element = document.getElementById(this.mapName);
      const options = {
        zoom: 3,
        center: new google.maps.LatLng(32, 90),
        styles: mapStyle,
      };
      map = new google.maps.Map(element, options);
    },
    getPosition(event) {
      this.tooltipPosition = { x: event.pageX + 10, y: event.pageY + 10 };
    },
    mapData() {
      // 轉換成 DataLayer 需要的格式
      const countrykey = Object.keys(this.data);
      const features = [];
      for (let i = 0; i < countrykey.length; i += 1) {
        const geo = this.countries.find(d => d.name === countrykey[i]);
        const properties = {
          name: countrykey[i],
          country: geo.country || null,
          value: this.data[countrykey[i]],
        };
        const geometry = {
          type: 'Point',
          coordinates: [geo.longitude, geo.latitude],
        };
        const obj = {
          type: 'Feature',
          properties,
          geometry,
        };
        features.push(obj);
      }
      const geoJsonData = {
        type: 'FeatureCollection',
        features,
      };
      // 清空上一次地圖結果
      if (this.geoJsonData) {
        map.data.forEach((feature) => {
          map.data.remove(feature);
        });
      }
      // 調整標示圓形大小層級
      const Max = d3.max(Object.values(this.data));
      const Min = d3.min(Object.values(this.data));
      const Scale = d3.scaleLinear()
        .domain([Min, Max])
        .range([5, 100]);
      const colorArrLevel = d3.scaleLinear()
        .domain([Min, Max])
        .range([0, 5]);
      const color = d3.scaleLinear()
        .domain([0, 1, 2, 3, 4, 5])
        .range(['#157A6E', '#00853F', '#8EA604', '#F2B500', '#E94F37', '#92140C']);
      // 得到地圖標點形狀
      function getCircle(value) {
        return {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: color(colorArrLevel(value)),
          fillOpacity: 0.6,
          scale: Math.round(Scale(value) * 1000) / 1000,
          strokeColor: 'white',
          strokeWeight: 0.5,
        };
      }
      // 加入圖形
      map.data.setStyle((feature) => {
        const value = feature.getProperty('value');
        return {
          icon: getCircle(value),
        };
      });
      // save geoJsonData
      this.geoJsonData = geoJsonData;
      map.data.addGeoJson(geoJsonData);
      // tooltip 滑鼠事件
      map.data.addListener('mouseover', (event) => {
        map.data.overrideStyle(event.feature, { strokeWeight: 8 });
        const name = event.feature.getProperty('name');
        const value = event.feature.getProperty('value');
        this.tooltipHtml = `<div><span>國家：</span><span>${name}</span> </div> <div><span>數量：</span><span>${value}</span> <div`;
      });
      map.data.addListener('mouseout', (event) => {
        map.data.revertStyle();
        this.tooltipHtml = '';
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .mapBox, .mapWarp{
    height: inherit;
    position: relative;
  }
  .colorSet {
    position: absolute;
    bottom: 0;
    z-index: 1;
    padding: 5px 10px;
    background: #fff;
    .colorBlocks {
      width: 32px;
      height: 16px;
      display: inline-block;
      margin: 0;
      padding: 0;
    }
  }
  .colorLabels {
    width: 100%;
    .colorLabel {
      display: inline-block;
    }
    .colorLabel:nth-child(2) {
      float: right;
    }
  }
</style>

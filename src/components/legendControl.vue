<template>
  <transition name="fade">
    <div class="legendSet">
      <ul>
        <li v-for="(d, index) in ColorSet" :class="{'active': highlight === d.label}" @click="getHighlight(d.label)">
          <span class="colorBlock" :style="{'background': d.color}"></span>
          <span class="legendBlock">{{d.label}}</span>
        </li>
      </ul>
    </div>
  </transition>
</template>


<script>
import * as d3 from 'd3';
import color from '../js/colorset.js';

export default {
  // name: 'lineChart',
  data() {
    return {
      chartData: [],
      ColorSet: [],
      highlight: '',
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    this.getColorSet();
    const obj = { highlight: '', colorSet: this.ColorSet };
    this.$emit('input', obj);
  },
  watch: {
    data() {
      this.highlight = '';
      this.getColorSet();
      const obj = { highlight: '', colorSet: this.ColorSet };
      this.$emit('input', obj);
    },
  },
  methods: {
    getColorSet() {
      const arr = [];
      const colorScheme = d3.scaleOrdinal(d3.schemeCategory10);
      for (let i = 0; i < this.data.length; i += 1) {
        arr.push({ label: this.data[i], color: colorScheme(this.data[i]) });
      }
      this.ColorSet = arr;
    },
    getHighlight(d) { //click legend&show highlight
      if (this.highlight !== d || !this.highlight) {
        this.highlight = d;
      } else {
        this.highlight = '';
      }
      const obj = { highlight: this.highlight, colorSet: this.ColorSet };
      console.log('obj is',obj)
      this.$emit('input', obj);
    },
  },
};

</script>

<style lang="scss" scoped>
  .legendSet {
    li{
      display: inline-block;
      padding: 4px;
      cursor: pointer;
      transition: .3s;
      margin: 1px 2px;
      &:hover, &.active{
        background: #efefef;
      }
    }
    .colorBlock {
      background: rgb(44, 160, 44);
      width: 12px;
      height: 12px;
      display: inline-block;
      margin: 0px 5px;
    }
  }
</style>

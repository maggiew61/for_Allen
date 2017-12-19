<template>
  <div class="main-container container">
    <div class="row">
      <div class="col s8 m8">
        <div class="currWrap card">
          <div class="card-content">
            <p>類別：</p>
            <v-select :options="options" placeholder="請選擇" v-model="category"></v-select>
          </div>
        </div>
      </div>
      <div class="col s4 m4">
        <div class="currWrap card">
          <div class="card-content">
            <p>年份：</p>
            <v-select :options="yearoptions" placeholder="請選擇" v-model="year"></v-select>
          </div>
        </div>
      </div>
      <div class="col s12 m12">
        <div class="card">
          <div class="card-content" v-if="chartData">
            <legend-control :data="legend" v-model="highlight"></legend-control>
            <scatter-chart :data="chartData"
                        :height="'450px'"
                        :width="'100%'"
                        :options="scatterChartOptions"
                        :id="'sc-chart'">
            </scatter-chart>
           </div>
          <div class="card-content" v-if="!chartData">
            無資料
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import vSelect from 'vue-select';
import rangeInput from './rangeInput.vue';
import textTable from './textTable.vue';
import legendControl from './legendControl.vue';
import scatterChart from './scatterChart.vue';
import data from '../js/store/trading_amt_scatter_20171017.json';

export default {
  name: 'linePlatform',
  components: {
    vSelect,
    legendControl,
    scatterChart,
  },
  data() {
    return {
      data,
      category: '',
      year: '',
      highlight: '',
    };
  },
  computed: {
    options() {
      return this.data.meta.filters[0].map(d => ({ value: d[0], label: d[1] }));
    },
    yearoptions() {
      return this.data.meta.filters[1].map(d => ({ value: String(d), label: String(d) }));
    },
    legend() {
      // this.category ? this.data.value_data[this.category.value].meta.x[1] :
      return this.category && this.year ? this.data.meta.legends : [];
    },
    scatterChartOptions() {
      const fn = (c) => {
        const colorSet = this.highlight.colorSet;
        return colorSet.find(d => d.label === c).color;
      };
      return {
        legend: false, // 使用 legendControl 控制時 關閉 自有的 legend
        highlight: this.highlight.highlight,
        XaxisUnit: this.data.meta.axis[0],
        YaxisUnit: this.data.meta.axis[1],
        color: fn, // 使用 legendControl 使用 legendControl 自帶 colorSet
      };
    },
    chartLegend() {
      return this.chartData.map(d => d.name);
    },
    chartData() {
      if (!this.category || !this.year) return null;
      const obj = [];
      const keyName = `${this.category.value}-${this.year.value}`;
      const chdata = this.data.data[keyName];
      // name
      const names = this.legend;
      for (let i = 0; i < names.length; i += 1) {
        const map = [];
        const datas = chdata.find(d => d.v.legend === names[i]);
         // 應保留單一legend 多組的可能性。
        const m = {};
        m.name = names[i]; // legend
        m.axis = datas ? datas.v.v[0] : 0; // axis X 軸
        m.value = datas ? datas.v.v[1] : 0; // axis Y 軸
        m.amount = datas ? datas.v.v[2] : 0; // 大小
        m.info = datas ? datas.info : [['無資料', '--']];
        map.push(m);
        const o = {
          name: names[i],
          data: map,
        };
        obj.push(o);
      }
      return obj;
    },
  },
};

</script>

<style  lang="scss" scoped>
  .main-container{
    height: calc(100vh - 50px);
    overflow: auto;
    padding: 0 0.75rem;
  }
  .filterWrap{
    width: 50%;
  }
  .textTableWrap{
    padding: 20px;
    margin: auto; 
  }
  .LinechartWrap{
    margin: 5px auto;
    padding: 10px;
    border-bottom: 1px solid #f3f3f3;
    overflow: auto;
    &:last-child{
      border-bottom: 1px solid transparent;
    }
  }
  .textTableWrap{
    overflow: auto;
    margin: 5px auto;
    padding: 10px;
  }
</style>
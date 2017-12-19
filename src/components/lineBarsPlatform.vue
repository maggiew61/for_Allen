<template>
  <div class="main-container container">
    <div class="row">
      <div class="col s12 m12">
        <div class="currWrap card">
          <div class="card-content">
            <p>類別：</p>
            <v-select :options="options" placeholder="請選擇" v-model="category"></v-select>
          </div>
        </div>
      </div>
      <div class="col s12 m12">
        <div class="card">
          <div class="card-content" v-if="chartData">
            <legend-control :data="chartLegend" v-model="highlight"></legend-control>
            <line-chart :data="chartData"
                        :height="'450px'"
                        :width="'100%'"
                        :options="lineChartOptions"
                        :id="'lc-chart'">
            </line-chart>
            <bar-chart :data="chartData"
                        :height="'450px'"
                        :width="'100%'"
                        :options="barChartOptions"
                        :id="'bc-chart'">
            </bar-chart>
            <h5>Pie chart: 2009</h5>
            <pie-chart :data="pieChartData"
                        :height="'300px'"
                        :width="'100%'"
                        :options="pieChartOptions"
                        :id="'bc-pie-chart'">
            </pie-chart>
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
import lineChart from './lineChart.vue';
import barChart from './barChart.vue';
import pieChart from './pieChart.vue';
import data from '../js/store/mock_trading_amt_barchart.json';

export default {
  name: 'linePlatform',
  components: {
    vSelect,
    legendControl,
    lineChart,
    barChart,
    pieChart,
  },
  data() {
    return {
      data,
      category: '',
      highlight: '',
    };
  },
  computed: {
    options() {
      return this.data.filter_options.map(d => ({ value: d[0], label: d[1] }));
    },
    hightLightOptions() {
      return this.category ? this.data.value_data[this.category.value].meta.x[1] : null;
    },
    lineChartOptions() {
      const fn = (c) => {
        const colorSet = this.highlight.colorSet;
        return colorSet.find(d => d.label === c).color || '#111';
      };
      const Unit = Object.values(this.data.value_data)[0].meta.axis;
      return {
        legend: false, // 使用 legendControl 控制時 關閉 自有的 legend
        highlight: this.highlight.highlight,
        XaxisUnit: Unit[0],
        YaxisUnit: Unit[1],
        color: fn, // 使用 legendControl 使用 legendControl 自帶 colorSet
      };
    },
    barChartOptions() {
      const fn = (c) => {
        const colorSet = this.highlight.colorSet;
        return colorSet.find(d => d.label === c).color || '#111';
      };
      const Unit = Object.values(this.data.value_data)[0].meta.axis;
      return {
        type: 'barX', // 垂直堆疊
        legend: false, // 使用 legendControl 控制時 關閉 自有的 legend
        rotateXLabel: -45,
        fixXLabelSize: 4,
        highlight: this.highlight.highlight,
        XaxisUnit: Unit[0],
        YaxisUnit: Unit[1],
        color: fn, // 使用 legendControl 使用 legendControl 自帶 colorSet
      };
    },
    pieChartOptions() {
      const fn = (c) => {
        const colorSet = this.highlight.colorSet;
        return colorSet.find(d => d.label === c).color || '#111';
      };
      const clickfn = (click) => {
        alert('click arc! data info in console.log');
        console.log(click);
      };
      return {
        legend: true, // 使用 legendControl 控制時 關閉 自有的 legend
        highlight: this.highlight.highlight,
        clickfn, // 自定義 function
        outerRadius: 120,
        innerRadius: 0,
        textOffset: 2.6,
        showLabel: false,
        color: fn, // 使用 legendControl 使用 legendControl 自帶 colorSet
      };
    },
    chartLegend() {
      return this.chartData.map(d => d.name);
    },
    chartData() {
      if (!this.category) return null;
      const obj = [];
      const chdata = this.data.value_data[this.category.value].values;
      const category = this.data.value_data[this.category.value].meta.x[0];
      const names = this.hightLightOptions;
      for (let i = 0; i < names.length; i += 1) {
        const map = [];
        for (let j = 0; j < category.length; j += 1) {
          const m = {};
          const datas = chdata[`${category[j]}-${names[i]}`];
          m.axis = category[j];
          m.value = datas ? datas[0] : 0;
          m.info = datas ? datas[1] : [['無資料', '--']];
          m.name = names[i];
          map.push(m);
        }
        const o = {
          name: names[i],
          data: map,
        };
        obj.push(o);
      }
      return obj;
    },
    pieChartData() {
      if (!this.category) return null;
      const obj = [];
      const chdata = this.data.value_data[this.category.value].values;
      const axises = this.data.value_data[this.category.value].meta.x[0];
      const names = this.hightLightOptions;
      for (let i = 0; i < names.length; i += 1) {
        const map = [];
        for (let j = 0; j < axises.length; j += 1) {
          if (axises[j] === 2009) {
            const m = {};
            const datas = chdata[`${axises[j]}-${names[i]}`];
            m.axis = axises[j];
            m.value = datas ? datas[0] : 0;
            m.info = datas ? datas[1] : [['無資料', '--']];
            m.name = names[i];
            map.push(m);
          }
        }
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
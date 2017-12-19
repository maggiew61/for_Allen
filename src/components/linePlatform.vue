<template>
  <div class="main-container container">
    <div class="row">
      <div class="col s6 m6">
        <div class="currWrap card">
          <div class="card-content">
            <p>貨幣類別：</p>
            <v-select :options="options" placeholder="請選擇貨幣" v-model="currency"></v-select>
          </div>
        </div>
      </div>
       <div class="col s6 m6">
          <div class="dateWrap card">
            <div class="card-content" v-if="dateoptions">
                <div>開始日期 : {{startDate}} <span v-if="startDate"> ~ </span></div>
                <div>結束日期 : {{endDate}}</div>
                <div>
                  <range-input  :mutiple="true" :min="0" :max="dateoptions.length - 1" v-model="date"></range-input>
                </div>
             </div>
          </div>
       </div>
      <div class="col s12 m12">
        <div class="card">
          <div class="card-content" v-if="currencyData">
            <div class="chartLegendFilter hide">
              <ul>
                <li>本行賣出</li>
                <li>本行買入</li>
                <li>{{chartLegend}}</li>
              </ul>
            </div>
            <template v-if="chartData">  
              <div class="LinechartWrap" v-for="(d, index) in chartData" v-bind:key="index">
                <line-chart :title="d.title"
                            :data="d.data"
                            :height="'400px'"
                            :width="'100%'"
                            :options="lineChartOptions"
                            :id="'lc-'+ index">
                </line-chart>
              </div>
            </template>
             <div class="textTableWrap">
                <text-table v-if="filterData" :data="filterData"></text-table>
             </div>
           </div>
          <div class="card-content" v-if="!currencyData">
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
import lineChart from './lineChart.vue';
import data from '../js/store/linechart_currencies.json';

export default {
  name: 'linePlatform',
  components: {
    rangeInput,
    vSelect,
    lineChart,
    textTable,
  },
  props: {
  },
  data() {
    return {
      date: '',
      data,
      currency: '',
      lineChartOptions: {
        legend: true,
        rotateXLabel: -45,
        fixXLabelSize: 4,
      },
    };
  },
  computed: {
    options() {
      return this.data.options;
    },
    currencyData() {
      return this.currency ? this.data.data[this.currency] : null;
    },
    dateoptions() {
      if (!this.currencyData) return null;
      const date = [];
      for (let i = 0; i < this.currencyData.length; i += 1) {
        for (let j = 0; j < this.currencyData[i].data.length; j += 1) {
          if (date.indexOf(this.currencyData[i].data[j][0]) < 0) {
            date.push(this.currencyData[i].data[j][0]);
          }
        }
      }
      return date;
    },
    startDate() {
      let startDate = '';
      if (this.date) {
        startDate = this.dateoptions[this.date[0]];
      } else {
        startDate = this.dateoptions[0];
      }
      return startDate;
    },
    endDate() {
      let endDate = '';
      if (this.date) {
        endDate = this.dateoptions[this.date[1]];
      } else {
        endDate = this.dateoptions[this.dateoptions.length - 1];
      }
      return endDate;
    },
    filterData() {
      if (!this.currencyData) return null;
      if (!this.date) return this.currencyData;
      const clone = JSON.parse(JSON.stringify(this.currencyData));
      for (let i = 0; i < clone.length; i += 1) {
        clone[i].data = clone[i].data.slice(this.date[0], this.date[1]);
      }
      return clone;
    },
    chartData() {
      const chartDatas = [];
      for (let i = 0; i < this.filterData.length; i += 1) {
        const datas = [];
        // 第一個為 資料日期
        for (let j = 1; j < this.filterData[i].columns.length; j += 1) {
          const dataSet = {};
          dataSet.name = this.filterData[i].columns[j];
          dataSet.data = this.filterData[i].data.map(d => ({ axis: d[0], value: d[j] }));
          datas.push(dataSet);
        }
        const chartData = {
          title: this.filterData[i].title,
          data: datas,
        };
        chartDatas.push(chartData);
      }
      return chartDatas;
    },
    chartLegend() {
      const arr = [];
      this.chartData.forEach((d) => {
        d.data.forEach(dd => arr.push(dd.name));
      });
      return arr;
    },
  },
  methods: {
    chartColors() {
      console.log('cc');
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
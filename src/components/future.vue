<template>
<!-- whole page -->
<div>

    <!-- main -->
    <div class="main">
        <div class="card">
          <div class="card-content">
            <header>
              票價波動趨勢(data: 02/26~02/27)
            </header>
            <div>
              <p>飛航日期:</p>
              <rangedate-picker
                  :format="'YYYY-MM-DD'"
                  @selected="onDateSelected"
                  v-model="date2" i18n="EN"></rangedate-picker>
            </div>
            <div>
              <p>航空公司(可複選):</p>
              <v-select multiple :options="options" placeholder="可複選" v-model="company"></v-select>
            </div>
            <div class="thirdChild">
              <p>航線(只可單選/連動):</p>
              <v-select :options="options3" placeholder="單選" v-model="flightInfo"></v-select>
            </div>
            <div class="fourthChild">
              <p>票種(只可單選/連動):</p>
              <v-select :options="options4" placeholder="單選" v-model="ticketType"></v-select>
            </div>
            <div class="secondChild" >
              <p>時間區間(可複選/連動):</p>
              <v-select multiple :options="options2" placeholder="請選擇" v-model="interval"></v-select>
            </div>
          </div>
        </div>
      <div class="col s12 m12" >
        <div class="card">
          <div class="card-content" v-if="chartData">
            <div style="font-size:30px; font-weight:bold; text-align:center; border-bottom:1px dotted grey">
              {{this.interval.label}}
            </div>
            <legend-control :data="chartLegend" v-model="highlight"></legend-control>
            <line-chart :data="chartData"
                        :height="'450px'"
                        :width="'100%'"
                        :options="lineChartOptions"
                        :id="'lc-chart'">
            </line-chart>
          </div>
          <div class="card-content" v-if="!chartData">
            <div style="font-size:30px; font-weight:bold; text-align:center; border-bottom:1px dotted grey">
              時間區間
            </div>
            無資料
          </div>
        </div>
        <div>
          <div class="card" style="padding-right:40px;">
          </div>
        </div>
      </div>
    </div>
</div>
</template>


<script>
import vSelect from 'vue-select';
import legendControl from './legendControl.vue';
import lineChart from './lineChart.vue';
import data from '../js/store/future.json';
import Datepicker from 'vuejs-datepicker';


export default {
  components: {
    vSelect,
    legendControl,
    lineChart
  },
  data() {
    return {
      date: '',
      date2:"",
      dateStart:"",
      dateEnd:"",
      data,
      barData: this.data,
      filter1:[
        ["華信航空","華信航空"],
        ["立榮航空","立榮航空"],
        ["遠東航空","遠東航空"]
      ],
      filter2: [
          ["07:00~08:00", "07:00~08:00"],
          ["08:00~09:00", "08:00~09:00"],
          ["09:00~10:00", "09:00~10:00"],
          ["10:00~11:00", "10:00~11:00"],
          ["11:00~12:00", "11:00~12:00"],
          ["12:00~13:00", "12:00~13:00"],
          ["15:00~16:00", "15:00~16:00"]
      ],
      filter3: [
          ["songshan_kinmen", "松山-金門"],
          ["kinmen_songshan", "金門-松山"],
          ["hualien_kaohsiung", "花蓮-高雄"],
      ],
      filter4: [
          ["fullfare", "全票"]
      ],
      company:"",
      interval:"",
      // flightInfo: {label:"松山-金門",value:"songshan_kinmen"},
      flightInfo: '',
      // ticketType:{label:"全票",value:"fullfare"},
      ticketType:'',
      highlight: '',
      changeData: '',
      atestd1: null,
    };
  },
  updated(){
    console.log("dateStart",this.dateStart,'-',this.dateEnd)
  },
  methods:{
    //選擇日期後事件,並回傳起始與結束日期到msg
    onDateSelected(msg){
      let info=msg
      let dateCalc = this.$moment(info.start).subtract(2, 'days').format('YYYY-MM-DD');  //減兩天圖才顯示正確(待解)
      this.dateStart=dateCalc
      this.dateEnd = this.$moment(info.end).format('YYYY-MM-DD');
    }
  },
  computed: {
    options() {
      return this.filter1.map(d => ({ value: d[0], label: d[1] }));
    },
    options2() {
      return this.filter2.map(d => ({ value: d[0], label: d[1] }));
    },
    options3() {
      return this.filter3.map(d => ({ value: d[0], label: d[1] }));
    },
    options4() {
      return this.filter4.map(d => ({ value: d[0], label: d[1] }));
    },
    //圖上的線; 三家航空
    hightLightOptions() {
      return this.company ? this.company.map(i=>i.value) : null;
    },
    lineChartOptions() {
      const fn = (c) => {
        const colorSet = this.highlight.colorSet;
        return colorSet.find(d => d.label === c).color || '#111';
      };
      const Unit = this.data.axis;
      return {
        rotateXLabel: -25,  //was 45
        legend: false, // 使用 legendControl 控制時 關閉 自有的 legend
        highlight: this.highlight.highlight,
        XaxisUnit: Unit[0],
        YaxisUnit: Unit[1],
        color: fn, // 使用 legendControl 使用 legendControl 自帶 colorSet
      };
    },
    chartLegend() {
      return this.chartData.map(d => d.name);
    },
    //x軸上的區間資料;最終結果輸出給chartDate()使用
    xAxis(){
      //isBetween是moment用法;只丟有符合 飛航日期 filter區間的資料到dayNew[]
      //e.g., ["2018-02-26", "2018-02-27"]
      let day=this.data.dateInfo.day  //json裡面所有的日期
      let dayNew=[]
      for (let i in day){
        if (this.$moment(day[i]).isBetween(this.dateStart, this.dateEnd)){
          let text=day[i]
          dayNew.push(text)
        }
      }

      //把時間區間 filter的資料 丟到新的timeNew[]; e.g.,["07:00~08:00", "08:00~09:00"]
      let timeNew=this.interval ? this.interval.map(i=>i.value) : null;
      let finalArr=[]
      for (let i in dayNew){
        for (let j in timeNew){
          let text = `${dayNew[i]}-${timeNew[j]}`  //組成e.g., 2018-01-05-07~08的格式
           finalArr.push(text)
        }
      }return finalArr //組成像["2018-01-05-07:00~08:00", "2018-01-06-07:00~08:00"]給chartData()使用
    },
    //畫圖的function
    chartData() {
      if (!this.company|| !this.ticketType || !this.flightInfo) return null;
      const obj = [];
      const xAxis = this.xAxis
      const names = this.hightLightOptions;  //幾家航空eg., ["華信航空", "立榮航空"]
      for (let i in names) { //跑幾家航空(圖上幾條線)
        const map = [];
        for (let j in xAxis) { //跑幾個時間區間, x軸用的e.g., 2018-02-26-12:50

          //處理有些航空公司沒有某段時間區間的值的問題
          let xAxisValue = this.data[names[i]][this.flightInfo.value][this.ticketType.value][xAxis[j]]
          let timeNew =xAxisValue? xAxisValue.meta.x:null

            for (let k in timeNew){
              //撈出價格, 用於y軸 e.g., 2276
              const price = this.data[names[i]][this.flightInfo.value][this.ticketType.value][xAxis[j]].value[timeNew[k]]
              const m = {};

              //以下4個是d3的規範 畫圖要給的東西
              m.axis = timeNew[k]; //每一個時間區間
              m.value = price ? price[0] : 0;  //第一筆資料的值 e.g., 305133
              m.info = price ? price[1] : [['無資料', '--']];  //用於 tooltip的資訊
              m.name = names[i];  //航空名稱
              map.push(m);
            }
          }
        const o = {
          name: names[i],
          data: map,
        };
        obj.push(o);  //把所有的{}一個一個推到obj[]裡面: 把object放到array變成 [{},{}..]; obj>1, 外面要用[]包起來
      }
      return obj;
    },
  },
};

</script>

<style lang="scss" scoped>
  div{
    font-family:microsoft jhenghei;
    font-size:22px;
  }
  .main{
    max-width:1200px;
    margin:0 auto
  }
  header{
    text-align: center;
    font-size:35px;
    margin-top:50px;
  }
  .dataSource{
    font-size:24px;
    text-align:center;
    margin: 20px 0px;
  }

  .v-select {
    // dropdown filter
    /deep/
  .dropdown-toggle{
  background: white;
  }
  // 下拉選單
  /deep/
  .dropdown-menu {
    border: solid 2px rgba(151, 193, 190, 1);
    box-shadow: 3px 3px 10px -3px #98a8a4;
  }
  /deep/
  .dropdown-menu > li > a:hover {
    background:  rgba(100, 129, 142, 1);
  }
  /deep/
  .dropdown-menu > .highlight > a {
    background:  rgba(100, 129, 142, 1);
  }
  /deep/
  ::-webkit-scrollbar {
    width: 0px;
  }
}

// scroll bar
::-webkit-scrollbar {
  width: 12px;
}

</style>

<template>
  <div class="card">
    <div class="card-content">
      <div class="title">
      <i class="material-icons md-16 filter-title">stars</i>
      <span class="filter-title">{{filterTitle}}</span>
    </div>
    <ul class="options card-action" v-if="checktype === 'radio'">
      <li v-for="(option, index) in data">
        <input  type="radio" :id="oKey+'-'+index" :name="oKey" @click="getValue(option)" :checked="checkoptions === option">
        <label :for="oKey+'-'+index" :value="option">{{option}}</label>
      </li>
    </ul>
    <ul class="options card-action" v-if="checktype === 'check'">
      <li v-for="(option, index) in data">
        <input class="filled-in" type="checkbox" :id="oKey+'-'+index" :name="oKey" @click="getValue(option)" :checked="checkoptions.indexOf(option) >= 0">
        <label :for="oKey+'-'+index" :value="option">{{option}}</label>
      </li>
    </ul>
    </div>
  </div>
</template>

<script>


export default {
  name: 'mapFilter',
  created() {
  },
  data() {
    return {
      checkoptions: [],
      init: true,
    };
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
    filterTitle: {
      type: String,
      default: '選項',
    },
    oKey: {
      type: String,
      default: 'opitons',
    },
    checktype: {
      type: String,
      default: '',
      required: true,
    },
  },
  mounted() {
    this.getValue(this.data[0]);
  },
  methods: {
    getValue(option) {
      this.init = false;
      if (this.checktype !== 'radio') {
        if (this.checkoptions.indexOf(option) < 0) {
          this.checkoptions.push(option);
        } else {
          this.checkoptions.splice(this.checkoptions.indexOf(option), 1);
        }
      } else {
        this.checkoptions = option;
      }
      const obj = { key: this.filterTitle, value: this.checkoptions };
      this.$emit('getValue', obj);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .title{
    // border-left: 4px solid #72c1ba;
    padding: 3px 5px;
    color: #41716d;
  }
  .filter-title{
    vertical-align: middle;
    font-size: 1rem;
  }
  .min-medium{
    min-height: 200px;
  }
  .options{
    padding: 8px 5px;
    li{
      padding: 5px;
      transition: .3s;
    }
    li:hover{
      background: rgba(0,0,0,0.05);
    }
  }
  
</style>

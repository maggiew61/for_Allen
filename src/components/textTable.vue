<template>
  <div class="text-table">
    <table class="highlight">
      <thead>
        <tr>
          <th class="center"></th>
          <template v-for="cat in category">
            <th class="center" :colspan="cat.columns.length">{{cat.title}}</th>
          </template>
        </tr>
        <tr>
          <th class="center">{{thead}}</th>
          <template v-for="cat in category">
            <th class="center"  v-if="col" v-for="col in cat.columns">{{col}}</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, i) in dateArray">
          <td  
            @mouseover="highlightTd(0)"
            @mouseout.self="highlightTd('')"
            class="center"
            :class="{'onhover': 0 === highlighttd}" 
           >
            {{data}}
          </td>
          <template v-for="(cat, catIndex) in category">
            <td 
              @mouseover="highlightTd(catIndex + '-' + colindex)"
              @mouseout.self="highlightTd('')"
              class="center"
              v-for="(col, colindex) in cat.columns"
              :class="{'onhover': catIndex + '-' + colindex === highlighttd}" 
              >
              {{getTableData(col, data)}}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>

export default {
  name: 'textTable',
  data() {
    return {
      highlighttd: '',
    };
  },
  props: {
    data: {
      type: Array,
    },
  },
  computed: {
    contentData() {
      const data = [];
      for (let i = 0; i < this.data.length; i += 1) {
        for (let j = 0; j < this.data[i].data.length; j += 1) {
          const obj = {};
          const exist = data.find(d => d[this.thead] === this.data[i].data[j][0]);
          for (let k = 0; k < this.data[i].data[j].length; k += 1) {
            const key = this.data[i].columns[k];
            if (exist) {
              exist[key] = this.data[i].data[j][k];
            } else {
              obj[key] = this.data[i].data[j][k];
            }
          }
          if (!exist) {
            data.push(obj);
          }
        }
      }
      return data;
    },
    dateArray() {
      const date = [];
      for (let i = 0; i < this.data.length; i += 1) {
        for (let j = 0; j < this.data[i].data.length; j += 1) {
          if (date.indexOf(this.data[i].data[j][0]) < 0) {
            date.push(this.data[i].data[j][0]);
          }
        }
      }
      return date;
    },
    category() {
      const date = [];
      for (let i = 0; i < this.data.length; i += 1) {
        const columns = this.data[i].columns.filter((d, index) => index !== 0);
        if (this.data[i].title) {
          date.push({ title: this.data[i].title, columns });
        } else {
          date.push({ columns });
        }
      }
      return date;
    },
    thead() {
      return this.data[0].columns[0];
    },
  },
  methods: {
    getDataRowspan(d, index) {
      return d + '-' + index;
    },
    dateSplit(d) {
      return d ? d.replace(' ', '-').split('-') : d;
    },
    getTableData(col, date) {
      return this.contentData.find(d => d[this.thead] === date)[col];
    },
    highlightTd(td) {
      this.highlighttd = td;
    },
  },
};

</script>

<style lang="scss" scrope>
  .onhover{
    background: #f2f2f2;
  }
</style>
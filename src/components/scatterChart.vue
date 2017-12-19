<template>
  <transition name="fade">
    <div class="chartBox lineChart">
      <div v-if="title" class="flow-text title">{{title}}</div>
      <div :ref="id" class="chartPlace" :data-chart-id="id"  :style="{'min-height': height}"></div>
    </div>
  </transition>
</template>


<script>
import * as d3 from 'd3';
import color from '../js/colorset.js';

export default {
  name: 'lineChart',
  data() {
    return {
      loading: false,
      el: null,
      chartData: [],
      highlight: '', // legend
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    title: String,
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {
    this.init();
    this.renderData();
    this.renderChart();
  },
  watch: {
    data() {
      this.highlight = '';
      this.renderData();
      this.renderChart();
    },
    options() {
      if (!this.config.legend) {
        this.highlight = this.options.highlight;
      }
    },
    highlight() {
      this.renderData();
      this.renderChart();
    },
  },
  computed: {
    total() {
      return d3.sum(this.chartData, (data => d3.sum(data.data, d => d.value)));
    },
    maxValue() {
      return d3.max(this.chartData, (data => d3.max(data.data, d => d.value)));
    },
    minValue() {
      return d3.min(this.chartData, (data => d3.min(data.data, d => d.value)));
    },
    maxAmount() {
      return d3.max(this.chartData, (data => d3.max(data.data, d => d.amount)));
    },
    minAmount() {
      return d3.min(this.chartData, (data => d3.min(data.data, d => d.amount)));
    },
    maxAxis() {
      return d3.max(this.chartData, (data => d3.max(data.data, d => d.axis)));
    },
    minAxis() {
      return d3.min(this.chartData, (data => d3.min(data.data, d => d.axis)));
    },
    allLegend() {
      return this.chartData.map(d => d.name);
    },
    config() {
      const c = color.generate(this.allLegend.length);
      const myConfig = {
        tooltip: true,
        legend: true,
        radius: [3, 20],
        XaxisUnit: '',
        YaxisUnit: '',
        color: d3.scaleOrdinal(d3.schemeCategory10),
      };
      // Import custom options
      if (this.options) {
        const keys = Object.keys(this.options);
        for (let i = 0; i < keys.length; i += 1) {
          myConfig[keys[i]] = this.options[keys[i]];
        }
      }
      return myConfig;
    },
  },
  methods: {
    init() {
      this.el = d3.select(this.$refs[this.id]);
    },
    renderData() {
      const data = JSON.parse(JSON.stringify(this.data));
      const dataSet = [];
      for (let i = 0; i < data.length; i += 1) {
        const obj = {
          name: data[i].name,
          data: data[i].data.map((d) => {
            d.parent = data[i].name;
            return d;
          }),
        };
        dataSet.push(obj);
      }
      this.chartData = dataSet;// .slice().sort((a, b) => a.value < b.value);
    },
    renderChart() {
      const id = this.id;
      const el = this.el;
      el.html('');
      const config = this.config;
      const BBRect = el.node().getBoundingClientRect();
      const className = `.chartPlace[data-chart-id="${this.id}"]`;
      const width = BBRect.width; // 圖表大小
      const height = BBRect.height; // 圖表大小
      const chartData = this.chartData;
      const padding = {
        top: 15,
        bottom: 35,
        right: 35,
        left: 35,
      };
      const regionWidth = width - padding.right - padding.left;
      const regionHeight = height - padding.top - padding.bottom;
      const yAxisWidth = 55;
      const xAxisHeight = 45;
      const radiusWidth = 45;
      const radiusHeight = 45;
      function translation(x, y) {
        return `translate(${x}, ${y})`;
      }
       // wrap text function
      function wrap(text, textWidth) {
        text.each(function () {
          const tt = d3.select(this);
          const words = tt.text().split(/\s+/).reverse();
          const lineHeight = 1.1; // ems
          const y = tt.attr('y');
          const dy = parseFloat(tt.attr('dy'));
          tt.text(null);
          for (let i = 0; i < words.length; i += 1) {
            const tspan = tt.append('tspan')
              .attr('x', 0)
              .attr('y', y)
              .attr('dy', (dy + (lineHeight * i)) + 'em')
              .text(words[i]);
            // console.log(tspan.node().getComputedTextLength());
            // if (tspan.node().getComputedTextLength() > textWidth) {

            // }
          }
        });
      }
      const tooltip = el.append('div')
        .classed('chart-tooltip', true);
      const legendSet = el.append('div')
            .classed('legendSet', true)
            .append('ul');
      const div = el.append('div')
        .classed('chart', true);
      const svg = div.append('svg')
        .attr('width', width)
        .attr('height', height);
      const g = svg.append('g')
        .attr('transform', translation(((width - regionWidth) / 2) + yAxisWidth, ((height - regionHeight) / 2) - xAxisHeight));
      // legend
      if (this.config.legend) {
        const legend = legendSet.selectAll('li')
         .data(chartData)
         .enter()
         .append('li')
         .attr('class', (d, i) => 'scatter-chart-series scatter-chart-series-' + i)
         .style('display', 'inline-block')
         .style('padding', '4px')
         .style('cursor', 'pointer')
         .on('click', (d, i) => {
           if (this.highlight === d.name) {
             this.highlight = '';
             for (let j = 0; j < this.allLegend.length; j += 1) {
               d3.select(`${className} li.scatter-chart-series-${j}`)
               .transition()
               .duration(100)
               .style('opacity', 1);
               d3.select(`${className} g.scatter-chart-series-${j} circle`)
               .transition()
               .duration(100)
               .style('stroke-width', 1);
             }
           } else {
             this.highlight = d.name;
             for (let j = 0; j < this.allLegend.length; j += 1) {
               if (i !== j) {
                 d3.select(`${className} li.scatter-chart-series-${j}`)
                  .transition()
                  .duration(100)
                  .style('opacity', 0.3);
                 d3.select(`${className} g.scatter-chart-series-${j} circle`)
                 .transition()
                 .duration(100)
                 .style('stroke-width', 1);
               } else {
                 d3.select(`${className} li.scatter-chart-series-${j}`)
                  .transition()
                  .duration(100)
                  .style('opacity', 1);
                 d3.select(`${className} g.scatter-chart-series-${j} circle`)
                 .transition()
                 .duration(100)
                 .style('stroke-width', 2);
               }
             }
           }
         });
         // .on('mouseover', (d, i) => {
         //   d3.select('.chartPlace[data-chart-id="' + this.id + '"] li.scatter-chart-series-' + i)
         //     .transition()
         //     .duration(100)
         //     .style('opacity', 0.8);
         // })
         // .on('mouseout', (d, i) => {
         //   d3.select('.chartPlace[data-chart-id="' + this.id + '"] li.scatter-chart-series-' + i)
         //     .transition()
         //     .duration(100)
         //     .style('opacity', 1);
         // });
        legend.append('span')
         .classed('colorBlock', true)
         .style('background', (d, i) => config.color(d.name))
         .style('width', '12px')
         .style('height', '12px')
         .style('display', 'inline-block')
         .style('margin', '0px 5px');
        legend.append('span')
         .classed('legendBlock', true)
         .html((d, i) => d.name);
      }
      // draw axixes
      const x = d3.scaleLinear().rangeRound([0, regionWidth - yAxisWidth]);
      const y = d3.scaleLinear().rangeRound([regionHeight, xAxisHeight]);
      const amount = d3.scaleLinear().rangeRound(config.radius);
      x.domain([this.minAxis, this.maxAxis]);
      y.domain([this.minValue, this.maxValue]);
      amount.domain([this.minAmount, this.maxAmount]);
      const xAxis = d3.axisBottom()
          .scale(x)
          .tickFormat(d3.format('.3s')); // .3f
      const yAxis = d3.axisLeft()
          .scale(y)
          .tickFormat(d3.format('.3s')); // .3f
      g.append('g')
       .attr('class', 'axis axis--x')
       .attr('transform', translation(0, regionHeight))
       .call(xAxis)
       .selectAll('.tick text')
       .style('font-size', '13px')
       .call(wrap, 60);
      g.append('g')
       .attr('class', 'axis axis--y')
       .call(yAxis);
      g.append('text')
        .attr('class', 'axis axisUnit--x')
        .attr('text-anchor', 'middle')
        .attr('transform', translation(regionWidth / 2, (regionHeight + xAxisHeight)))
        .text(config.XaxisUnit);
      g.append('text')
        .attr('class', 'axis axisUnit--y')
        .attr('text-anchor', 'middle')
        .attr('transform', translation((-1 * yAxisWidth) - 5, regionHeight / 2) + 'rotate(-90)')
        .text(config.YaxisUnit);
      // draw lines
      const linePath = g.selectAll('.line')
       .data(chartData)
       .enter()
       .append('g')
       .attr('class', ((d, i) => 'scatter-chart-series scatter-chart-series-' + i));
      const lineGroup = g
            .append('g')
            .attr('class', 'lineGroup');
      const Xline = lineGroup.append('line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', 0)
            .style('opacity', 0)
            .attr('stroke', '#aaa')
            .attr('stroke-dasharray', '10 5')
            .attr('stroke-width', '1');
      const Yline = lineGroup.append('line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', height - xAxisHeight)
            .attr('y2', 0)
            .style('opacity', 0)
            .attr('stroke', '#aaa')
            .attr('stroke-dasharray', '10 5')
            .attr('stroke-width', '1');
      const dots = linePath.append('g')
       .attr('class', 'scatter');
      dots.selectAll('bubble')
        .data(d => d.data)
        .enter()
        .append('circle')
        .attr('class', ((d, i) => 'circle circle-' + i))
        .attr('r', (d) => {
          let r = amount(d.amount);
          if (d.amount === 'Infinity') {
            r = config.radius[1];
          } else if (!d.amount) {
            r = 0;
          }
          return r;
        })
        .attr('cx', d => x(d.axis))
        .attr('cy', d => y(d.value))
        .style('opacity', 1)
        .style('cursor', 'pointer')
        .style('fill', 'transparent')
        .style('stroke', d => config.color(d.parent))
        .style('stroke-width', 1)
        .style('stroke-opacity', (d, index) => {
          let opacity = 1;
          if (d.name === this.highlight || !this.highlight) {
            opacity = 1;
          } else {
            opacity = 0.3;
          }
          return opacity;
        })
        .on('click', (d, i) => {
          if (this.highlight === d.name) {
            this.highlight = '';
            this.renderData();
            this.renderChart();
          } else {
            this.highlight = d.name;
            this.renderData();
            this.renderChart();
          }
        })
        .on('mouseover', (d, i) => {
          const parentIndex = chartData.map(pd => pd.name);
          const point = `.chartPlace[data-chart-id="${id}"] .scatter-chart-series-${parentIndex.indexOf(d.parent)} .circle-${i}`;
          const node = d3.select(point);
          node.style('stroke-width', 2);
          let tooltipStr = '';
          if (d.info) {
            tooltipStr = d.info.map(dd => `<div><span class="label">${dd[0]} :</span> <span class="value">${dd[1]}</span></div>`).join('');
          } else {
            tooltipStr = `<div>${d.axis}</div> <div>${d.value}</div>`;
          }
          Xline.style('opacity', 1)
                .attr('x2', node.attr('cx'))
               .attr('y1', node.attr('cy'))
               .attr('y2', node.attr('cy'));
          Yline.style('opacity', 1)
               .attr('y2', node.attr('cy'))
               .attr('x1', node.attr('cx'))
               .attr('x2', node.attr('cx'));
          tooltip.html(tooltipStr);
          tooltip.classed('active', true);
          tooltip
           .transition(200)
           .style('opacity', 1);
           // 準線
        })
        .on('mouseout', (d, i) => {
          d3.selectAll('.circle').style('stroke-width', 1);
          tooltip.classed('active', false);
          Xline.style('opacity', 0);
          Yline.style('opacity', 0);
        })
        .on('mousemove', (d) => {
          tooltip
           .style('top', (d3.event.pageY + 10) + 'px')
           .style('left', (d3.event.pageX + 10) + 'px');
        });
    },
  },
};

</script>

<style lang="scss" scrope>
 .chartBox {
    margin: 30px auto;
  }
  .title{
    padding: 15px;
  }
</style>
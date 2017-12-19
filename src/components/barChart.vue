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

export default {
  name: 'lineChart',
  data() {
    return {
      loading: false,
      el: null,
      chartData: [],
      highlight: '', // legend
      barhighlight: '',
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
      this.renderData();
      this.renderChart();
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
    maxDeltaValue() {
      return d3.max(this.chartData, (data => d3.max(data.data, d => d.deltavalue)));
    },
    minValue() {
      return d3.min(this.chartData, (data => d3.min(data.data, d => d.value)));
    },
    allLegend() {
      return this.data.map(d => d.name);
    },
    allAxis() {
      const axis = [];
      for (let i = 0; i < this.chartData.length; i += 1) {
        for (let j = 0; j < this.chartData[i].data.length; j += 1) {
          if (axis.indexOf(this.chartData[i].data[j].axis) < 0) {
            axis.push(this.chartData[i].data[j].axis);
          }
        }
      }
      return axis;
    },
    config() {
      const myConfig = {
        tooltip: true,
        legend: true,
        type: 'barX', // barX barY groupX groupY
        XaxisUnit: '',
        YaxisUnit: '',
        fixXLabelSize: 0,
        rotateXLabel: 0,
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
      const dataSet = [];
      if (!this.highlight) {
        const data = JSON.parse(JSON.stringify(this.data));
        for (let i = 0; i < data.length; i += 1) {
          const obj = {
            name: data[i].name,
            data: data[i].data.map((d, index) => {
              let deltavalue = 0;
              if (i === 0) {
                deltavalue = 0;
              } else {
                deltavalue = data[i - 1].data[index].value + data[i - 1].data[index].deltavalue;
              }
              d.parent = data[i].name;
              d.deltavalue = deltavalue;
              return d;
            }),
          };
          dataSet.push(obj);
        }
      } else {
        const oridata = JSON.parse(JSON.stringify(this.data));
        const data = oridata.filter(d => d.name === this.highlight);
        const dataleft = oridata.filter(d => d.name !== this.highlight);
        for (let j = 0; j < dataleft.length; j += 1) {
          data.push(dataleft[j]);
        }
        for (let i = 0; i < data.length; i += 1) {
          const obj = {
            name: data[i].name,
            data: data[i].data.map((d, index) => {
              let deltavalue = 0;
              if (i === 0) {
                deltavalue = 0;
              } else {
                deltavalue = data[i - 1].data[index].value + data[i - 1].data[index].deltavalue;
              }
              d.parent = data[i].name;
              d.deltavalue = deltavalue;
              return d;
            }),
          };
          dataSet.push(obj);
        }
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
      const allAxis = this.allAxis;
      const padding = {
        top: 15,
        bottom: 35,
        right: 35,
        left: 35,
      };
      const regionWidth = width - padding.right - padding.left;
      const regionHeight = height - padding.top - padding.bottom;
      const yAxisWidth = 55;
      const xAxisHeight = 65;
      function translation(x, y) {
        return `translate(${x}, ${y})`;
      }
      const fixArr = [0];
      if (config.fixXLabelSize > 0) {
        const fixedAmount = Math.round(allAxis.length / (config.fixXLabelSize - 1));
        for (let amount = fixedAmount; amount < allAxis.length - 1; amount += fixedAmount) {
          fixArr.push(amount);
        }
        fixArr.push(allAxis.length - 1);
      }
       // wrap text function
      function wrap(text, textWidth) {
        text.each(function (d, index) {
          const tt = d3.select(this);
          const words = tt.text().split(/\s+/).reverse();
          const lineHeight = 1.1; // ems
          const y = tt.attr('y');
          const dy = parseFloat(tt.attr('dy'));
          tt.text(null)
            .attr('transform', `rotate(${config.rotateXLabel})`)
            .attr('text-anchor', (td => (config.rotateXLabel !== 0 ? 'end' : 'middle')));
          for (let i = 0; i < words.length; i += 1) {
            if (config.fixXLabelSize > 0) {
              if (fixArr.indexOf(index) > -1) {
                tt.append('tspan')
                  .attr('x', 0)
                  .attr('y', y)
                  .attr('dy', (dy + (lineHeight * i)) + 'em')
                  .text(words[i]);
              }
            } else {
              tt.append('tspan')
                .attr('x', 0)
                .attr('y', y)
                .attr('dy', (dy + (lineHeight * i)) + 'em')
                .text(words[i]);
            }
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
         .data(this.allLegend)
         .enter()
         .append('li')
         .attr('class', (d, i) => 'bar-chart-series bar-chart-series-' + i)
         .style('display', 'inline-block')
         .style('padding', '4px')
         .style('cursor', 'pointer')
         .style('opacity', (d) => {
           let opacity = 1;
           if (d === this.highlight || !this.highlight) {
             opacity = 1;
           } else {
             opacity = 0.3;
           }
           return opacity;
         })
         .on('click', (d, i) => {
           if (this.highlight === d) {
             this.highlight = '';
             this.renderData();
             this.renderChart();
           } else {
             this.highlight = d;
             this.renderData();
             this.renderChart();
           }
         });
        legend.append('span')
         .classed('colorBlock', true)
         .style('background', (d, i) => config.color(d))
         .style('width', '12px')
         .style('height', '12px')
         .style('display', 'inline-block')
         .style('margin', '0px 5px');
        legend.append('span')
         .classed('legendBlock', true)
         .html((d, i) => d);
      }
      // draw axixes
      if (this.config.type === 'barX') {
        const x = d3.scaleBand().rangeRound([0, regionWidth - yAxisWidth]).padding(0.1);
        const y = d3.scaleLinear().rangeRound([regionHeight, xAxisHeight]);
        const y1 = d3.scaleLinear().rangeRound([regionHeight, xAxisHeight]);
        x.domain(this.allAxis);
        y.domain([0, this.maxDeltaValue]);
        y1.domain([0, this.maxValue]);
        const xAxis = d3.axisBottom()
            .scale(x);
        const yAxis = d3.axisLeft()
            .scale(y)
            .tickFormat(d3.format('.3s')); // .3f
        const axisX = g.append('g')
         .attr('class', 'axis axis--x')
         .attr('transform', translation(0, regionHeight + 1))
         .call(xAxis);
        axisX.selectAll('.tick text')
         .style('font-size', '13px')
         .call(wrap, 100);
        axisX.selectAll('.tick line')
          .style('opacity', ((d, index) => {
            if (config.fixXLabelSize > 0) {
              return fixArr.indexOf(index) > -1 ? 1 : 0;
            }
            return 1;
          }));
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
        const barGroup = g.selectAll('.barGroup')
         .data(chartData)
         .enter()
         .append('g')
         .attr('class', ((d, i) => 'bar-chart-series bar-chart-series-' + i));
        const barRects = barGroup.selectAll('.barRects')
          .data(d => d.data)
          .enter()
          .append('rect')
          .attr('class', 'barRects')
          .attr('data-name', d => d.name)
          .attr('x', (d => x(d.axis)))
          .attr('y', d => y(d.deltavalue + d.value))
          .style('width', x.bandwidth())
          .style('height', d => (regionHeight - y(d.value)) + 1)
          .attr('fill', d => this.config.color(d.name))
          .style('cursor', 'pointer')
          .style('fill-opacity', (d) => {
            let opacity = 1;
            if (d.name === this.highlight || !this.highlight) {
              opacity = 1;
            } else {
              opacity = 0.3;
            }
            return opacity;
          })
          .on('click', (d, i) => {
            const serise = chartData.map(dd => dd.name);
            const legendserise = this.allLegend;
            for (let j = 0; j < this.allLegend.length; j += 1) {
              d3.selectAll(`${className} li.bar-chart-series-${j}`)
              .transition()
              .duration(100)
              .style('opacity', 0.3);
              d3.selectAll(`${className} g.bar-chart-series-${j} rect`)
              .transition()
              .duration(100)
              .style('fill-opacity', 0.3);
            }
            if (this.barhighlight !== d.name) {
              d3.selectAll(`${className} li.bar-chart-series-${legendserise.indexOf(d.name)}`)
               .transition()
               .duration(100)
               .style('opacity', 1);
              d3.selectAll(`${className} g.bar-chart-series-${serise.indexOf(d.name)} rect`)
                .transition()
                .duration(100)
                .style('fill-opacity', 1);
              this.barhighlight = d.name;
            } else {
              this.barhighlight = '';
              for (let j = 0; j < this.allLegend.length; j += 1) {
                d3.selectAll(`${className} li.bar-chart-series-${j}`)
                .transition()
                .duration(100)
                .style('opacity', 1);
                d3.selectAll(`${className} g.bar-chart-series-${j} rect`)
                .transition()
                .duration(100)
                .style('fill-opacity', 1);
              }
            }
          })
          .on('mouseover', (d, i) => {
            let tooltipStr = '';
            if (d.info) {
              tooltipStr = d.info.map(dd => `<div><span class="label">${dd[0]} :</span> <span class="value">${dd[1]}</span></div>`).join('');
            } else {
              tooltipStr = `<div>${d.axis}</div> <div>${d.value}</div>`;
            }
            tooltip.html(tooltipStr);
            tooltip.classed('active', true);
            tooltip
             .transition(200)
             .style('opacity', 1);
          })
          .on('mouseout', (d, i) => {
            tooltip.classed('active', false);
          })
          .on('mousemove', (d) => {
            tooltip
              .style('top', (d3.event.pageY + 10) + 'px')
              .style('left', (d3.event.pageX + 10) + 'px');
          });
      }
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
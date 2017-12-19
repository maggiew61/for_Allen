<template>
  <transition name="fade">
    <div class="chartBox lineChart">
      <div v-if="title" class="flow-text title">{{title}}</div>
      <div :ref="id" class="chartPlace" :data-chart-id="id"  :style="{'min-height': height}"></div>
      <div class="clearfix"></div>
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
        XaxisUnit: '',
        YaxisUnit: '',
        outerRadius: 100,
        innerRadius: 0,
        textOffset: 2.4,
        clickfn: null,
        showLabel: false,
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
              d.parent = data[i].name;
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
              d.parent = data[i].name;
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
      const width = this.config.legend ? BBRect.width / 2 : BBRect.width; // 圖表大小
      const height = BBRect.height; // 圖表大小
      const chartData = this.chartData;
      const pie = d3.pie().value(d => d.data[0].value).sort(null);
      const padding = {
        top: 15,
        bottom: 35,
        right: 35,
        left: 35,
      };
      const regionWidth = width - padding.right - padding.left;
      const regionHeight = height - padding.top - padding.bottom;
      const maxValue = this.maxValue;
      const outerRadius = config.outerRadius;
      const innerRadius = config.innerRadius;
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
            tt.append('tspan')
              .attr('x', 0)
              .attr('y', y)
              .attr('dy', (dy + (lineHeight * i)) + 'em')
              .text(words[i]);
          }
        });
      }
      const tooltip = el.append('div')
        .classed('chart-tooltip', true);
      const legendSet = el.append('div')
            .classed('legendSet', true)
            .style('width', '50%')
            .style('float', 'right')
            .append('ul');
      const div = el.append('div')
        .classed('chart', true);
      const svg = div.append('svg')
        .attr('width', width)
        .attr('height', height);
      const g = svg.append('g')
        .attr('transform', translation((width - regionWidth) / 2, (height - regionHeight) / 2));
      // legend
      if (this.config.legend) {
        const legend = legendSet.selectAll('li')
         .data(this.allLegend)
         .enter()
         .append('li')
         .attr('class', (d, i) => 'pie-chart-series pie-chart-series-' + i)
         .style('display', 'block')
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
          //  const className = `.chartPlace[data-chart-id="${this.id}"]`;
          //  if (this.highlight === d) {
          //    this.highlight = '';
          //    this.renderData();
          //    this.renderChart();
          //  } else {
          //    this.highlight = d;
          //    this.renderData();
          //    this.renderChart();
          //  }
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
         .html((d, i) => {
           const data = pie(chartData).find(dd => dd.data.name === d);
           const value = data ? data.value : '---';
           return `${d} : ${value}`;
         });
      }
      g.append('g')
        .attr('class', 'slices')
        .attr('transform', translation(regionWidth / 2, regionHeight / 2));
      g.append('g')
        .attr('class', 'labels')
        .attr('transform', translation(regionWidth / 2, regionHeight / 2));
      const lines = g.append('g')
        .attr('class', 'lines')
        .attr('transform', translation(regionWidth / 2, regionHeight / 2));
      const arc = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);
      const outerArc = d3.arc()
        .outerRadius(outerRadius * 1.2)
        .innerRadius(outerRadius * 1.2);
      const slice = g.select('.slices')
        .selectAll('path.slice')
        .data(pie(chartData));
      slice.enter()
        .append('path')
        .attr('class', ((d, i) => 'arc pie-chart-series pie-chart-series-' + i))
        .style('opacity', 1)
        .style('cursor', 'pointer')
        .attr('fill', d => config.color(d.data.name))
        .on('mouseover', (d, i) => {
          const point = `.chartPlace[data-chart-id="${id}"] path.pie-chart-series-${i}`;
          const node = d3.select(point);
          node.classed('hover', true);
          node.style('opacity', 0.8);
          let tooltipStr = '';
          if (d.data.data[0].info) {
            tooltipStr = d.data.data[0].info.map(dd => `<div><span class="label">${dd[0]} :</span> <span class="value">${dd[1]}</span></div>`).join('');
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
          const point = '.chartPlace[data-chart-id="' + this.id + '"] path.pie-chart-series-' + i;
          const node = d3.select(point);
          node.classed('hover', false);
          tooltip.classed('active', false);
          g.selectAll('path')
           .transition(200)
           .style('opacity', 1);
        })
        .on('mousemove', (d) => {
          tooltip
            .style('top', (d3.event.pageY + 10) + 'px')
            .style('left', (d3.event.pageX + 10) + 'px');
        })
        .on('click', (d) => {
          if (config.clickfn) {
            config.clickfn(d);
          }
        })
        .transition()
        .duration(1000)
        .attrTween('d', (d) => {
          const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
          return (t => arc(interpolate(t)));
        });
      slice.exit().remove();
      if (config.showLabel) {
        // let history = {
        //   distance: 0,
        //   count: 0,
        // };
        const midAngle = d => d.startAngle + ((d.endAngle - d.startAngle) / 2);
        const label = g.select('.labels')
          .selectAll('text')
          .data(pie(chartData));
        const text = label.enter()
          .append('text')
          .attr('class', ((d, i) => 'arcLabel pie-chart-series pie-chart-series-' + i));
          // .attr('dy', '2em');
          // .text(d => `${d.data.name} - ${d.value}`)
        text.transition()
          .duration(1000)
          .attrTween('transform', (d, index) => {
            const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return ((t) => {
              const d2 = interpolate(t);
              const pos = outerArc.centroid(d2);
              // const getAngle = 0;
              const x = pos[0];
              const y = pos[1];
              const direction = midAngle(d2) < Math.PI ? 1 : -1;
              let getAngle = ((180 / Math.PI) * (d2.startAngle + d2.endAngle) * 0.5) - 90;
              getAngle = direction > 0 ? getAngle : getAngle + 180;
              // const last = history;
              // const x = outerRadius * 1.4 * direction;
              // const y = 50 * history.count;
              // // if (Math.abs(pos[1] - last.distance) < 40) {
              // //   y = pos[1] + (40 * last.count * direction);
              // //   history = {
              // //     lastPi: direction,
              // //     distance: y,
              // //     count: last.lastPi === direction ? last.count + 1 : 0,
              // //   };
              // // } else {
              // //   y = pos[1];
              // //   history = {
              // //     lastPi: direction,
              // //     distance: y,
              // //     count: last.lastPi === direction ? last.count + 1 : 0,
              // //   };
              // // }
              // history = {
              //   lastPi: direction,
              //   count: last.lastPi === direction ? last.count + 1 : 0,
              // };
              // console.log(d.data.name);
              // console.log(history);
              // return `translate(${x}, ${y}) rotate(${getAngle})`;
              return `translate(${x}, ${y})`;
            });
          })
          .styleTween('text-anchor', (d) => {
            const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return ((t) => {
              const d2 = interpolate(t);
              return midAngle(d2) <= Math.PI ? 'start' : 'end';
              // return 'start';
            });
          });
        // text
        //   .append('tspan')
        //   .attr('x', '0')
        //   .attr('y', '0')
        //   .text(d => d.data.name);
        text
          .append('tspan')
          .attr('x', '0')
          .attr('y', '0')
          .text(d => d.value);
        text.exit().remove();
        const polylines = g.select('.lines').selectAll('polyline')
          .data(pie(chartData));
        const polyline = polylines.enter()
          .append('polyline')
          .attr('class', ((d, i) => 'arcpolyline pie-chart-series pie-chart-series-' + i));
        polyline
          .attr('fill', 'none')
          .attr('stroke', '#111')
          .attr('stroke-width', '1px')
          .attr('opacity', '0.5')
          .transition()
          .duration(1000)
          .attrTween('points', (d) => {
            const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return ((t) => {
              const d2 = interpolate(t);
              const pos = outerArc.centroid(d2);
              pos[0] = outerRadius * 1.3 * (midAngle(d2) < Math.PI ? 1 : -1);
              // return [arc.centroid(d2), outerArc.centroid(d2), pos];
              return [arc.centroid(d2), outerArc.centroid(d2)];
            });
          });
        polyline.exit().remove();
      }
    },
  },
};

</script>

<style lang="scss" scoped>
 .chartBox {
    margin: 30px auto;
  }
  .title{
    padding: 15px;
  }
</style>
<template>
  <div>
    <v-chart :options="chartOptions"/>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';

import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/axis';
import 'echarts/lib/component/polar';

export default {
  props: [
    'node'
  ],
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      chartOptions: {
        xAxis: {
          data: this.node.historicalData.points
            .filter((item, index) => (index < 100))
            .map((item) => item.era)
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              color: '#434657'
            }
          }
        },
        series: [
          {
            type: 'bar',
            data: this.node.historicalData.points
              .filter((item, index) => (index < 100))
              .map((item) => item.points)
          }
        ],
        grid: {
          left: 52,
          top: 52,
          right: 52,
          bottom: 52
        },
        backgroundColor: '#1e2029',
        color: ['#85C1E9'],
        textStyle: {
          color: '#fff'
        }
      }
    };
  }
};
</script>

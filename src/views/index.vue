<script setup>
import * as echarts from 'echarts'
import a2 from '@/assets/images/starfield.jpg'
import a1 from '@/assets/images/world.topo.bathy.200401.jpg'
import 'echarts-gl'

const chartDom = ref(null)
const data = [{
  name: '数据1',
  // 数据项值
  value: [12, 14, 10],
}]
let myChart
const option = {
  backgroundColor: '#000',
  globe: {
    baseTexture: a1,
    heightTexture: a1,
    displacementScale: 0.04,
    shading: 'realistic',
    environment: a2,
    realisticMaterial: {
      roughness: 0.9,
    },
    postEffect: {
      enable: true,
    },
    light: {
      main: {
        intensity: 5,
        shadow: true,
      },
      // ambientCubemap: {
      //   texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
      //   diffuseIntensity: 0.2
      // }
    },
  },
  series: {
    type: 'bar3D',
    coordinateSystem: 'globe',
    blendMode: 'lighter',
    symbolSize: 2,
    itemStyle: {
      color: 'rgb(50, 50, 150)',
      opacity: 1,
    },
    data,
  },
}
onMounted(() => {
  myChart = echarts.init(chartDom.value)
  myChart.setOption(option)
})
</script>

<template>
  <div style="height: 100%">
    <div ref="chartDom" class="chart" />
  </div>
</template>

<style lang="scss" scoped>
.chart {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
}
</style>

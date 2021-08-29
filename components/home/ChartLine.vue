<template>
  <div id="chartLine" class="chartLine">
  </div>
</template>
<script>
import { getDashboardJob } from '@/service/dashboard'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
am4core.useTheme(am4themesAnimated)
export default {
  async mounted () {
    const res = await getDashboardJob()
    const chart = am4core.create('chartLine', am4charts.XYChart)

    // Add data
    chart.data = res.data

    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd'

    // Create axes
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
    // eslint-disable-next-line no-unused-vars
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())

    // Create series
    const series = chart.series.push(new am4charts.LineSeries())
    series.dataFields.valueY = 'value'
    series.dataFields.dateX = 'date'
    series.tooltipText = '{value}'
    series.strokeWidth = 2
    series.minBulletDistance = 15

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20
    series.tooltip.background.strokeOpacity = 0
    series.tooltip.pointerOrientation = 'vertical'
    series.tooltip.label.minWidth = 40
    series.tooltip.label.minHeight = 40
    series.tooltip.label.textAlign = 'middle'

    // Make bullets grow on hover
    const bullet = series.bullets.push(new am4charts.CircleBullet())
    bullet.circle.strokeWidth = 2
    bullet.circle.radius = 4
    bullet.circle.fill = am4core.color('#fff')

    const bullethover = bullet.states.create('hover')
    bullethover.properties.scale = 1.3

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor()
    chart.cursor.behavior = 'panXY'
    chart.cursor.xAxis = dateAxis
    chart.cursor.snapToSeries = series

    dateAxis.start = 0.79
    dateAxis.keepSelection = true
  }
}
</script>
<style lang="css">
.chartLine {
  min-height: 460px;
}
</style>

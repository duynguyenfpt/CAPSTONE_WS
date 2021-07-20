<template>
  <div id="chartLine" class="chartLine">
  </div>
</template>
<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
am4core.useTheme(am4themesAnimated)
export default {
  mounted () {
    const chart = am4core.create('chartLine', am4charts.XYChart)

    // Add data
    chart.data = [{
      date: '2012-07-27',
      value: 13
    }, {
      date: '2012-07-28',
      value: 11
    }, {
      date: '2012-07-29',
      value: 15
    }, {
      date: '2012-07-30',
      value: 16
    }, {
      date: '2012-07-31',
      value: 18
    }, {
      date: '2012-08-01',
      value: 13
    }, {
      date: '2012-08-02',
      value: 22
    }, {
      date: '2012-08-03',
      value: 23
    }, {
      date: '2012-08-04',
      value: 20
    }, {
      date: '2012-08-05',
      value: 17
    }, {
      date: '2012-08-06',
      value: 16
    }, {
      date: '2012-08-07',
      value: 18
    }, {
      date: '2012-08-08',
      value: 21
    }, {
      date: '2012-08-09',
      value: 26
    }, {
      date: '2012-08-10',
      value: 24
    }, {
      date: '2012-08-11',
      value: 29
    }, {
      date: '2012-08-12',
      value: 32
    }, {
      date: '2012-08-13',
      value: 18
    }, {
      date: '2012-08-14',
      value: 24
    }, {
      date: '2012-08-15',
      value: 22
    }, {
      date: '2012-08-16',
      value: 18
    }, {
      date: '2012-08-17',
      value: 19
    }, {
      date: '2012-08-18',
      value: 14
    }]

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
    series.tooltip.label.textValign = 'middle'

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

    // // Create vertical scrollbar and place it before the value axis
    // chart.scrollbarY = new am4core.Scrollbar()
    // chart.scrollbarY.parent = chart.leftAxesContainer
    // chart.scrollbarY.toBack()

    // // Create a horizontal scrollbar with previe and place it underneath the date axis
    // chart.scrollbarX = new am4charts.XYChartScrollbar()
    // chart.scrollbarX.series.push(series)
    // chart.scrollbarX.parent = chart.bottomAxesContainer

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

<template>
  <div>
    <div class="row">
      <div class="col-xl-8 col-lg-12">
        <h5>Orders Report</h5>
        <div class="card">
          <a-tabs defaultActiveKey="1" class="kit-tabs-bordered">
            <a-tab-pane tab="Weekly" key="1">
              <order-chart type="week" />
            </a-tab-pane>
            <a-tab-pane tab="Monthly" key="2">
              <order-chart type="month" />
            </a-tab-pane>
            <a-tab-pane tab="Yearly" key="3">
              <order-chart type="year" />
            </a-tab-pane>
          </a-tabs>
        </div>
        <h5>Deliver rate report</h5>
        <div class="card">
          <a-tabs defaultActiveKey="1" class="kit-tabs-bordered">
            <a-tab-pane tab="Weekly" key="1">
              <delivery-chart type="week" />
            </a-tab-pane>
            <a-tab-pane tab="Monthly" key="2">
              <delivery-chart type="month" />
            </a-tab-pane>
            <a-tab-pane tab="Yearly" key="3">
              <delivery-chart type="year" />
            </a-tab-pane>
          </a-tabs>
          <div class="card-body"></div>
        </div>
      </div>
      <div class="col-xl-4 col-lg-12">
        <div id="chart">
          <apexchart type="donut" width="380" :options="chartOptions" :series="series"></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import OrderChart from './orderChart/orderChart'
import DeliveryChart from './deliveryChart/deliveryChart'

export default {
  components: {
    apexchart: VueApexCharts,
    OrderChart,
    DeliveryChart,
  },
  data: function () {
    return {
      series: [44, 55, 41, 17, 15],
      chartOptions: {
        chart: {
          width: 380,
          type: 'donut',
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          type: 'gradient',
        },
        legend: {
          formatter: function (val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex]
          },
        },
        title: {
          text: 'Gradient Donut with custom Start-angle',
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
    }
  },
}
</script>
<style scoped>
.clickable-card {
  cursor: pointer;
}
</style>

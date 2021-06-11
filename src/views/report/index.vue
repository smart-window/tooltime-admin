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
            <a-tab-pane tab="Featued Products" key="1" />
          </a-tabs>
          <div class="card-body"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OrderChart from './orderChart/orderChart'
// import OrderList from './orderList/orderList'
// import TotalOrders from './totalOrders'
// import TotalProducts from './totalProducts'
// import TotalAssets from './totalAssets'
// import ServiceAreas from './serviceAreas'

export default {
  components: {
    OrderChart,
    // OrderList,
    // TotalOrders,
    // TotalProducts,
    // TotalAssets,
    // ServiceAreas,
  },
}
</script>
<style scoped>
.clickable-card {
  cursor: pointer;
}
</style>

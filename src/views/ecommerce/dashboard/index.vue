<template>
  <div>
    <div class="cui__utils__heading">
      <strong>TOOLTIME: Dashboard</strong>
    </div>
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
            <!-- <a-tab-pane tab="Yearly" key="3">
              <order-chart type="year" />
            </a-tab-pane> -->
          </a-tabs>
        </div>
        <h5>Deliver rate report</h5>
        <div class="card">
          <a-tabs defaultActiveKey="1" class="kit-tabs-bordered">
            <a-tab-pane tab="Featued Products" key="1" />
          </a-tabs>
          <div class="card-body">
            <product-category />
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-lg-12">
        <router-link to="/product/list">
          <div class="card clickable-card text-white bg-success">
            <div class="card-body">
              <total-products class="clickable" />
            </div>
          </div>
        </router-link>
        <router-link to="/asset/list">
          <div class="card clickable-card">
            <div class="card-body">
              <total-assets />
            </div>
          </div>
        </router-link>
        <router-link to="/order/list">
          <div class="card clickable-card">
            <div class="card-body">
              <total-orders />
            </div>
          </div>
        </router-link>
        <router-link to="/service-area/list">
          <div class="card clickable-card">
            <div class="card-body">
              <service-areas />
            </div>
          </div>
        </router-link>
        <div class="card">
          <div class="card-body">
            <order-list />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OrderChart from './orderChart/orderChart'
import OrderList from './orderList/orderList'
import TotalOrders from './totalOrders'
import TotalProducts from './totalProducts'
import TotalAssets from './totalAssets'
import ServiceAreas from './serviceAreas'
import ProductCategory from '../product-catalog/index'

export default {
  components: {
    OrderChart,
    OrderList,
    TotalOrders,
    TotalProducts,
    TotalAssets,
    ServiceAreas,
    ProductCategory,
  },
  methods: {
    // goPage() {
    //   store.set('app.menu.selectedKeys', 'location')
    //   console.log(111)
    // },
  },
}
</script>
<style scoped>
.clickable-card {
  cursor: pointer;
}
</style>

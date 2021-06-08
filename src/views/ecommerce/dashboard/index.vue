<template>
  <div>
    <div class="cui__utils__heading">
      <strong>TOOLTIME: Dashboard</strong>
    </div>
    <div class="row">
      <div class="col-xl-8 col-lg-12">
        <div class="card">
          <a-tabs defaultActiveKey="1" class="kit-tabs-bordered">
            <a-tab-pane tab="Orders" key="1" />
          </a-tabs>
          <div class="card-body">
            <cui-chart-3 />
          </div>
        </div>
        <div class="card">
          <a-tabs defaultActiveKey="1" class="kit-tabs-bordered">
            <a-tab-pane tab="Featued Products" key="1" />
          </a-tabs>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6" v-for="(product, index) in products" :key="index">
                <cui-general-16
                  :isNew="product.isNew"
                  :isFavorite="product.isFavorite"
                  :image="product.image"
                  :name="product.name"
                  :price="product.price"
                  :oldPrice="product.oldPrice"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-lg-12">
        <div class="card text-white bg-success">
          <div class="card-body">
            <total-products />
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <total-assets />
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <total-orders />
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <service-areas />
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <cui-list-12 />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CuiChart3 from '@/components/kit/widgets/Charts/3/index'
import TotalOrders from './totalOrders'
import TotalProducts from './totalProducts'
import TotalAssets from './totalAssets'
import ServiceAreas from './serviceAreas'
import CuiGeneral16 from '@/components/kit/widgets/General/16/index'
import CuiList12 from '@/components/kit/widgets/Lists/12/index'
import products from './data.json'

export default {
  components: {
    CuiChart3,
    TotalOrders,
    TotalProducts,
    TotalAssets,
    ServiceAreas,
    CuiGeneral16,
    CuiList12,
  },
  data: function () {
    return {
      products,
    }
  },
}
</script>

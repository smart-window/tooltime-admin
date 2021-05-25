export const getMenuData = [
  {
    category: true,
    title: 'Dashboards',
  },
  {
    title: 'Home',
    icon: 'fe fe-home',
    key: 'dashboard',
    url: '/ecommerce/dashboard',
  },
  {
    title: 'Customer',
    icon: 'fas fa-users',
    key: 'customer',
    url: '/customer',
  },
  {
    title: 'Location',
    icon: 'fas fa-map-marker-alt',
    key: 'location',
    url: '/location',
  },
  {
    title: 'Service Area',
    icon: 'fas fa-truck-pickup',
    key: 'service-area',
    url: '/service-area/list',
  },
  {
    title: 'Orders',
    icon: 'fas fa-bookmark',
    key: 'orders',
    url: '/order/list',
  },
  {
    title: 'Categories',
    icon: 'fas fa-boxes',
    key: 'categories',
    url: '/category/list',
  },
  {
    title: 'Sections',
    icon: 'fas fa-tags',
    key: 'sections',
    url: '/section/list',
  },
  {
    title: 'Offer',
    icon: 'fas fa-truck-monster',
    key: 'Offers',
    url: '/offer',
  },
  {
    title: 'Products',
    icon: 'fas fa-tools',
    key: 'Products',
    url: '/product/list',
  },

  {
    title: 'Ecommerce',
    key: 'ecommerce',
    icon: 'fe fe-shopping-cart',
    children: [
      {
        title: 'Orders',
        key: 'ecommerceOrders',
        url: '/ecommerce/orders',
      },
      {
        title: 'Propduct Catalog',
        key: 'ecommerceProductCatalog',
        url: '/ecommerce/product-catalog',
      },
      {
        title: 'Product Details',
        key: 'ecommerceProductDetails',
        url: '/ecommerce/product-details',
      },
      {
        title: 'Cart',
        key: 'ecommerceCart',
        url: '/ecommerce/cart',
      },
    ],
  },
]

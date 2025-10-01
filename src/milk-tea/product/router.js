import ProductListView from './views/ProductListView.vue'
import ProductDetailView from './views/ProductDetailView.vue'

const productRoutes = [
  { path: '/products', name: 'products', component: ProductListView },
  { path: '/products/:id', name: 'product-detail', component: ProductDetailView },
]

export default productRoutes

import { createRouter, createWebHistory } from "vue-router";
import ProductsView from "../views/ProductsView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import CozinhaView from "../views/CozinhaView.vue";
import PedidosTodosView from "../views/PedidosTodosView.vue";

const routes = [
  {
    path: "/",
    name: "products",
    component: ProductsView,
  },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutView,
  },
  {
    path: "/cozinha",
    name: "cozinha",
    component: CozinhaView,
  },
  {
    path: "/pedidos", // 🆕 nova rota
    name: "pedidos-todos",
    component: PedidosTodosView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

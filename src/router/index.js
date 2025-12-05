import { createRouter, createWebHistory } from "vue-router";
import ProductsView from "../views/ProductsView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import CozinhaView from "../views/CozinhaView.vue";
import PedidosTodosView from "../views/PedidosTodosView.vue";
import UpdatePedidoView from "../views/UpdatePedidoView.vue";

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
  {
    path: "/pedidos/:id/editar",
    name: "editar-pedido",
    component: UpdatePedidoView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

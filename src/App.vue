<template>
  <div id="app" class="min-h-screen bg-gray-50 touch-pan-y">
    <!-- Header -->
    <header class="bg-cafe-500 text-white shadow-lg sticky top-0 z-40">
      <div class="container mx-auto px-4 py-3">
        <div
          class="flex flex-col md:flex-row md:justify-between md:items-center"
        >
          <!-- Título -->
          <div class="text-center md:text-left">
            <h1 class="text-3xl font-bold touch-element">CASA ARARI CAFÉ</h1>

            <!-- 🔹 Menu de Navegação -->
            <nav class="mt-3 flex justify-center md:justify-start space-x-4">
              <RouterLink
                to="/"
                class="text-white text-lg font-semibold px-5 py-2 rounded-lg hover:bg-cafe-600 transition-colors"
                active-class="bg-cafe-700"
              >
                ☕ Produtos
              </RouterLink>

              <RouterLink
                to="/cozinha"
                class="text-white text-lg font-semibold px-5 py-2 rounded-lg hover:bg-cafe-600 transition-colors"
                active-class="bg-cafe-700"
              >
                🍳 Cozinha
              </RouterLink>
            </nav>
          </div>

          <!-- Carrinho -->
          <div class="mt-4 md:mt-0 text-center md:text-right">
            <button
              @click="openCart"
              class="relative bg-white text-cafe-600 px-6 py-3 rounded-lg font-semibold touch-element hover:bg-gray-100 transition-colors"
            >
              🛒 Carrinho
              <span
                v-if="cartItemsCount > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
              >
                {{ cartItemsCount }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-4 mt-auto">
      <div class="container mx-auto px-4 text-center">
        <p class="text-sm">
          Sistema de Autoatendimento - Desenvolvido para melhor atendê-lo
        </p>
      </div>
    </footer>

    <!-- Carrinho Lateral -->
    <CartSidebar v-if="isCartSidebarMounted" />

    <!-- Debug (pode remover depois) -->
    <CartSidebar v-if="true" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useProductsStore } from "./stores/products";
import CartSidebar from "./components/CartSidebar.vue";
import { RouterLink } from "vue-router";

const productsStore = useProductsStore();
const cartItemsCount = computed(() => productsStore.cartItemsCount);

const openCart = () => {
  productsStore.openCart();
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Ajuste visual para manter o foco */
.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>

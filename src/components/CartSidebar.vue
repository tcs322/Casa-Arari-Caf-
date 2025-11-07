<template>
  <!-- Overlay -->
  <div
    v-if="showCart"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
    @click="closeCart"
  ></div>

  <!-- Carrinho Sidebar -->
  <div
    class="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
    :class="showCart ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Header -->
    <div class="bg-cafe-500 text-white p-4 flex justify-between items-center">
      <h2 class="text-xl font-bold">Meu Carrinho</h2>
      <button
        @click="closeCart"
        class="text-2xl hover:text-gray-200 touch-element"
      >
        ×
      </button>
    </div>

    <!-- Lista de Itens -->
    <div class="flex-1 overflow-y-auto h-[calc(100vh-200px)]">
      <div v-if="cart.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🛒</div>
        <p class="text-gray-600">Carrinho vazio</p>
        <button
          @click="closeCart"
          class="mt-4 bg-cafe-500 text-white px-6 py-2 rounded-lg touch-element"
        >
          Continuar Comprando
        </button>
      </div>

      <div v-else class="p-4 space-y-4">
        <div
          v-for="item in cart"
          :key="item.id"
          class="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
        >
          <!-- Imagem/Ícone -->
          <div
            class="w-16 h-16 bg-cafe-100 rounded-lg flex items-center justify-center"
          >
            <span class="text-2xl">☕</span>
          </div>

          <!-- Informações -->
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">{{ item.nome }}</h3>
            <p class="text-cafe-600 font-bold">
              R$ {{ item.preco.toFixed(2) }}
            </p>
          </div>

          <!-- Controles de Quantidade -->
          <div class="flex items-center space-x-2">
            <button
              @click="updateQuantity(item.id, item.quantity - 1)"
              class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center touch-element hover:bg-gray-300"
            >
              −
            </button>

            <span class="w-8 text-center font-semibold">{{
              item.quantity
            }}</span>

            <button
              @click="updateQuantity(item.id, item.quantity + 1)"
              class="w-8 h-8 bg-cafe-500 text-white rounded-full flex items-center justify-center touch-element hover:bg-cafe-600"
            >
              +
            </button>
          </div>

          <!-- Remover -->
          <button
            @click="removeFromCart(item.id)"
            class="text-red-500 hover:text-red-700 touch-element p-2"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Footer/Total -->
    <div v-if="cart.length > 0" class="border-t p-4 bg-white">
      <div class="flex justify-between items-center mb-4">
        <span class="text-lg font-semibold">Total:</span>
        <span class="text-2xl font-bold text-cafe-600"
          >R$ {{ cartTotal.toFixed(2) }}</span
        >
      </div>

      <button
        @click="goToCheckout"
        class="w-full bg-green-500 text-white py-4 rounded-lg font-semibold text-lg touch-element hover:bg-green-600 transition-colors"
      >
        Finalizar Pedido
      </button>

      <button
        @click="closeCart"
        class="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold mt-2 touch-element hover:bg-gray-300 transition-colors"
      >
        Continuar Comprando
      </button>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from "../stores/products";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const router = useRouter();
const productsStore = useProductsStore();

// CORREÇÃO: Use storeToRefs para propriedades reativas
const { showCart, cart, cartTotal } = storeToRefs(productsStore);
const { updateQuantity, removeFromCart, closeCart } = productsStore;

const goToCheckout = () => {
  closeCart();
  router.push("/checkout");
};
</script>

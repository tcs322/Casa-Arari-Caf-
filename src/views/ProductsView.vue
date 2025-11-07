<template>
  <div class="products-view">
    <!-- Filtros de Categoria -->
    <div class="mb-6 bg-white rounded-lg shadow p-4">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Categorias</h2>
      <div class="flex flex-wrap gap-2">
        <button
          @click="productsStore.setCategory(null)"
          :class="[
            'px-4 py-3 rounded-lg font-medium touch-element transition-colors',
            !productsStore.selectedCategory
              ? 'bg-cafe-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Todos
        </button>
        <button
          v-for="category in productsStore.categories"
          :key="category"
          @click="productsStore.setCategory(category)"
          :class="[
            'px-4 py-3 rounded-lg font-medium touch-element transition-colors',
            productsStore.selectedCategory === category
              ? 'bg-cafe-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Campo de Busca -->
    <div class="mb-6 bg-white rounded-lg shadow p-4 flex items-center gap-3">
      <input
        v-model="productsStore.searchQuery"
        type="text"
        placeholder="Buscar produtos..."
        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-500"
      />
      <button
        @click="productsStore.clearSearch"
        v-if="productsStore.searchQuery"
        class="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Limpar
      </button>
    </div>

    <!-- Grid de Produtos -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="product in productsStore.filteredProducts"
        :key="product.id"
        class="product-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 touch-element"
      >
        <!-- Imagem do Produto -->
        <div
          class="h-48 bg-gradient-to-br from-cafe-400 to-cafe-600 flex items-center justify-center"
        >
          <span class="text-6xl">☕</span>
        </div>

        <!-- Informações do Produto -->
        <div class="p-4">
          <h3 class="text-xl font-bold text-gray-800 mb-2">
            {{ product.nome }}
          </h3>
          <p class="text-gray-600 text-sm mb-3">{{ product.descricao }}</p>

          <div class="flex justify-between items-center mb-3">
            <span class="text-2xl font-bold text-cafe-600">
              R$ {{ product.preco.toFixed(2) }}
            </span>
            <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {{ product.categoria }}
            </span>
          </div>

          <!-- Botão Adicionar -->
          <button
            @click="addToCart(product)"
            class="w-full bg-cafe-500 text-white py-3 rounded-lg font-semibold hover:bg-cafe-600 transition-colors touch-element flex items-center justify-center gap-2"
          >
            <span>+</span>
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>

    <!-- Mensagem quando não há produtos -->
    <div
      v-if="productsStore.filteredProducts.length === 0"
      class="text-center py-12"
    >
      <div class="text-6xl mb-4">😔</div>
      <p class="text-xl text-gray-600">
        Nenhum produto encontrado nesta categoria.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from "../stores/products";

const productsStore = useProductsStore();

const addToCart = (product) => {
  productsStore.addToCart(product);
  console.log(`${product.nome} adicionado ao carrinho!`);
};
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-card:active {
  transform: translateY(-2px);
}
</style>

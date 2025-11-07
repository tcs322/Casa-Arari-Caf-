<!-- src/components/ProductCard.vue -->
<template>
  <div
    class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
  >
    <img
      :src="product.imagem || '/placeholder-food.jpg'"
      :alt="product.nome"
      class="w-full h-48 object-cover"
    />

    <div class="p-4">
      <h3 class="font-semibold text-lg mb-2">{{ product.nome }}</h3>
      <p class="text-gray-600 text-sm mb-3">{{ product.descricao }}</p>

      <div class="flex justify-between items-center">
        <span class="text-2xl font-bold text-orange-600">
          R$ {{ product.preco.toFixed(2) }}
        </span>

        <button
          @click="$emit('add-to-cart', product)"
          class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Adicionar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
});

defineEmits(["add-to-cart"]);
</script>

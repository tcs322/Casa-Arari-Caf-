<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4"
  >
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
      <h1 class="text-2xl font-bold text-cafe-600 mb-6 text-center">
        Finalizar Pedido
      </h1>

      <div class="mb-4">
        <label for="cliente_nome" class="block text-gray-700 font-medium mb-2">
          Nome do Cliente
        </label>
        <input
          v-model="clienteNome"
          id="cliente_nome"
          type="text"
          placeholder="Digite o nome do cliente"
          class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cafe-400 outline-none"
        />
      </div>

      <button
        @click="enviarPedido"
        :disabled="isLoading"
        class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {{ isLoading ? "Enviando..." : "Enviar Pedido" }}
      </button>

      <button
        @click="voltar"
        class="mt-3 w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
      >
        Voltar
      </button>

      <div v-if="mensagem" class="mt-4 text-center font-medium text-cafe-600">
        {{ mensagem }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useProductsStore } from "../stores/products";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const productsStore = useProductsStore();

const clienteNome = ref("");
const isLoading = ref(false);
const mensagem = ref("");

const enviarPedido = async () => {
  
  if (!clienteNome.value.trim()) {
    mensagem.value = "Por favor, informe o nome do cliente.";
    return;
  }

  if (productsStore.cart.length === 0) {
    mensagem.value = "O carrinho está vazio!";
    return;
  }

  try {
    isLoading.value = true;

    console.log('passei aqui 3');

    await axios.post("http://192.168.15.22:8050/api/pedidos", {
      cliente_nome: clienteNome.value,
      itens: productsStore.cart,
    });

    mensagem.value = "✅ Pedido enviado com sucesso!";
    productsStore.clearCart();

    // Redireciona após alguns segundos
    setTimeout(() => router.push("/"), 2000);
  } catch (error) {
    console.error(error);
    mensagem.value = "❌ Erro ao enviar o pedido.";
  } finally {
    isLoading.value = false;
  }
};

const voltar = () => {
  router.push("/");
};
</script>

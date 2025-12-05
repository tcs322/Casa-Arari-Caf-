<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <h1 class="text-3xl font-bold text-cafe-600 mb-6">
      Editar Pedido #{{ pedidoId }}
    </h1>

    <div v-if="carregando" class="text-gray-600">Carregando pedido...</div>

    <div v-else>
      <!-- Cliente -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <label class="block font-medium text-gray-700 mb-1">Cliente</label>
        <input
          v-model="clienteNome"
          type="text"
          class="border border-gray-300 rounded-lg px-3 py-2 w-full"
        />
      </div>

      <!-- Itens -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <h2 class="text-xl font-semibold text-cafe-600 mb-3">
          Itens do Pedido
        </h2>

        <div v-if="itens.length === 0" class="text-gray-500">
          Nenhum item restante no pedido.
        </div>

        <div
          v-for="item in itens"
          :key="item.id"
          class="flex justify-between items-center border-b py-3"
        >
          <div>
            <p class="font-medium text-gray-800">{{ item.nome }}</p>
            <p class="text-sm text-gray-600">R$ {{ item.preco.toFixed(2) }}</p>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="diminuirItem(item)"
              class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              -
            </button>

            <span class="font-medium">{{ item.quantidade }}x</span>
          </div>
        </div>
      </div>

      <!-- Botão Salvar -->
      <button
        @click="salvar"
        :disabled="itens.length === 0 || salvando"
        class="px-5 py-2 bg-cafe-600 text-white rounded-lg hover:bg-cafe-700 disabled:opacity-50"
      >
        {{ salvando ? "Salvando..." : "Salvar alterações" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import api from "../services/api"; // Agora realmente será usado

const route = useRoute();
const router = useRouter();

const pedidoId = route.params.id;

const carregando = ref(true);
const salvando = ref(false);

const clienteNome = ref("");
const itens = ref([]);

/**
 * Busca o pedido atual
 */
const carregarPedido = async () => {
  try {
    const response = await axios.get(
      `http://192.168.15.22:8050/api/pedidos/${pedidoId}`
    );

    const pedido = response.data.data; // <-- CORREÇÃO AQUI

    clienteNome.value = pedido.cliente_nome;
    itens.value = pedido.itens ?? []; // garante array
  } catch (error) {
    console.error("Erro ao carregar pedido:", error);
  } finally {
    carregando.value = false;
  }
};

/**
 * Diminui a quantidade do item
 */
const diminuirItem = (item) => {
  item.quantidade -= 1;

  if (item.quantidade <= 0) {
    itens.value = itens.value.filter((i) => i.id !== item.id);
  }
};

/**
 * Recalcula o total
 */
const calcularTotal = () => {
  return itens.value.reduce((total, item) => {
    return total + item.preco * item.quantidade;
  }, 0);
};

/**
 * Envia alterações para o backend
 */
const salvar = async () => {
  if (itens.value.length === 0) {
    alert("O pedido deve ter ao menos 1 item.");
    return;
  }

  salvando.value = true;

  try {
    const payload = {
      id: Number(pedidoId),
      cliente_nome: clienteNome.value,
      itens: itens.value,
      valor_total: calcularTotal(),
    };

    await axios.put(
      `http://192.168.15.22:8050/api/pedidos/${pedidoId}`,
      payload
    );

    alert("Pedido atualizado com sucesso!");
    router.push("/todos-os-pedidos");
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar alterações.");
  } finally {
    salvando.value = false;
  }
};

onMounted(() => {
  carregarPedido();
});
</script>

<style scoped>
.text-cafe-600 {
  color: #6b3e26;
}
.bg-cafe-600 {
  background-color: #6b3e26;
}
.bg-cafe-700 {
  background-color: #4e2f1c;
}
</style>

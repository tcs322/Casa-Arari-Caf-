<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Cabeçalho -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"
    >
      <h1 class="text-3xl font-bold text-cafe-600">Todos os Pedidos</h1>

      <!-- Filtros -->
      <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
        <!-- Filtro por status -->
        <select
          v-model="statusFiltro"
          class="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring focus:ring-cafe-300"
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendentes</option>
          <option value="preparado">Preparados</option>
        </select>

        <!-- Campo de busca -->
        <input
          v-model="busca"
          type="text"
          placeholder="Buscar por cliente..."
          class="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring focus:ring-cafe-300 w-full sm:w-64"
        />
      </div>
    </div>

    <!-- Contadores -->
    <div class="flex flex-wrap gap-4 mb-4">
      <div class="bg-white rounded-lg shadow px-4 py-2 text-sm text-gray-700">
        <strong>{{ totalPedidos }}</strong> total
      </div>
      <div
        class="bg-yellow-100 text-yellow-800 rounded-lg shadow px-4 py-2 text-sm"
      >
        <strong>{{ totalPendentes }}</strong> pendentes
      </div>
      <div
        class="bg-green-100 text-green-800 rounded-lg shadow px-4 py-2 text-sm"
      >
        <strong>{{ totalPreparados }}</strong> preparados
      </div>
    </div>

    <!-- Lista -->
    <div
      v-if="pedidosFiltradosOrdenados.length === 0"
      class="text-center text-gray-500 mt-10"
    >
      Nenhum pedido encontrado ☕
    </div>

    <div
      v-for="pedido in pedidosPaginados"
      :key="pedido.id"
      class="bg-white shadow-md rounded-lg p-5 mb-4 border border-gray-200"
    >
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-semibold text-cafe-600">
          Pedido #{{ pedido.id }}
        </h2>
        <span
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            pedido.status === 'pendente'
              ? 'bg-yellow-100 text-yellow-700'
              : pedido.status === 'preparado'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700',
          ]"
        >
          {{ pedido.status }}
        </span>
      </div>

      <p class="font-medium text-gray-700 mb-2">
        Cliente:
        <span class="text-cafe-600">
          {{ pedido.cliente_nome || "—" }}
        </span>
      </p>

      <ul class="list-disc pl-5 mb-3">
        <li
          v-for="item in pedido.itens"
          :key="item.id"
          class="text-gray-700 text-sm"
        >
          {{ item.nome }} — <strong>{{ item.quantidade }}x</strong>
        </li>
      </ul>

      <p class="text-gray-600 text-sm">
        Criado em:
        <span class="text-gray-800 font-medium">
          {{ formatarData(pedido.created_at) }}
        </span>
      </p>

      <p class="text-gray-700 text-sm mt-2">
        Valor total:
        <span class="font-semibold text-cafe-600">
          R$ {{ Number(pedido.valor_total).toFixed(2) }}
        </span>
      </p>
    </div>

    <!-- Paginação -->
    <div
      v-if="totalPaginas > 1"
      class="flex justify-center items-center gap-3 mt-6"
    >
      <button
        @click="paginaAtual--"
        :disabled="paginaAtual === 1"
        class="px-3 py-1 rounded bg-cafe-500 text-white hover:bg-cafe-600 disabled:opacity-50"
      >
        ◀ Anterior
      </button>

      <span class="text-gray-700 text-sm">
        Página {{ paginaAtual }} de {{ totalPaginas }}
      </span>

      <button
        @click="paginaAtual++"
        :disabled="paginaAtual === totalPaginas"
        class="px-3 py-1 rounded bg-cafe-500 text-white hover:bg-cafe-600 disabled:opacity-50"
      >
        Próxima ▶
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";

const pedidos = ref([]);
const statusFiltro = ref(""); // '' | 'pendente' | 'preparado'
const busca = ref("");

// paginação
const paginaAtual = ref(1);
const itensPorPagina = 10;

/**
 * Busca todos os pedidos
 */
const fetchTodosPedidos = async () => {
  try {
    const response = await axios.get(
      "http://192.168.15.22:8050/api/pedidos/todos"
    );
    pedidos.value = response.data || [];
  } catch (error) {
    console.error("Erro ao buscar todos os pedidos:", error);
  }
};

/**
 * Filtra por status e busca
 */
const pedidosFiltrados = computed(() => {
  return pedidos.value.filter((p) => {
    const filtroStatus = statusFiltro.value
      ? p.status === statusFiltro.value
      : true;

    const filtroBusca = busca.value
      ? p.cliente_nome?.toLowerCase().includes(busca.value.toLowerCase())
      : true;

    return filtroStatus && filtroBusca;
  });
});

/**
 * Ordena por data mais recente (created_at desc)
 */
const pedidosFiltradosOrdenados = computed(() => {
  return [...pedidosFiltrados.value].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });
});

/**
 * Paginação (10 por página)
 */
const totalPaginas = computed(() =>
  Math.ceil(pedidosFiltradosOrdenados.value.length / itensPorPagina)
);

const pedidosPaginados = computed(() => {
  const start = (paginaAtual.value - 1) * itensPorPagina;
  return pedidosFiltradosOrdenados.value.slice(start, start + itensPorPagina);
});

/**
 * Contadores
 */
const totalPedidos = computed(() => pedidos.value.length);
const totalPendentes = computed(
  () => pedidos.value.filter((p) => p.status === "pendente").length
);
const totalPreparados = computed(
  () => pedidos.value.filter((p) => p.status === "preparado").length
);

/**
 * Formata data
 */
const formatarData = (data) => {
  if (!data) return "—";
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

// Atualiza periodicamente
let intervalId = null;
onMounted(() => {
  fetchTodosPedidos();
  intervalId = setInterval(fetchTodosPedidos, 10000); // atualiza a cada 10s
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.text-cafe-600 {
  color: #6b3e26;
}
.bg-cafe-500 {
  background-color: #8b5e3c;
}
.bg-cafe-600 {
  background-color: #6b3e26;
}
.focus\:ring-cafe-300:focus {
  box-shadow: 0 0 0 3px rgba(139, 94, 60, 0.4);
}
</style>

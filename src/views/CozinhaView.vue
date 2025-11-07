<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-cafe-600">Pedidos da Cozinha</h1>

      <!-- Botão para ativar som quando bloqueado -->
      <div>
        <button
          v-if="soundBlocked"
          @click="unlockSound"
          class="bg-cafe-500 text-white px-4 py-2 rounded hover:bg-cafe-600"
        >
          Ativar som
        </button>
      </div>
    </div>

    <div v-if="pedidos.length === 0" class="text-center text-gray-500">
      Nenhum pedido no momento ☕
    </div>

    <div
      v-for="pedido in pedidos"
      :key="pedido.id"
      class="bg-white shadow-md rounded-lg p-5 mb-4 border border-gray-200"
    >
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-semibold text-cafe-600">
          Pedido #{{ pedido.id }}
        </h2>
        <span
          class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
        >
          {{ pedido.status }}
        </span>
      </div>

      <p class="font-medium text-gray-700 mb-2">
        Cliente: <span class="text-cafe-600">{{ pedido.cliente_nome }}</span>
      </p>

      <ul class="list-disc pl-5 mb-3">
        <li
          v-for="item in pedido.itens"
          :key="item.id"
          class="text-gray-700 text-sm"
        >
          {{ item.nome }} — <strong>{{ item.quantity }}x</strong>
        </li>
      </ul>

      <button
        @click="marcarComoPreparado(pedido.id)"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Marcar como preparado
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

const pedidos = ref([]);

// Set de IDs já vistos (mais confiável que contar)
const seenIds = new Set();
// Controla se já teve uma primeira carga para evitar tocar som na primeira vez
const initialLoaded = ref(false);

// flag para quando o navegador bloquear áudio
const soundBlocked = ref(false);
let pollIntervalId = null;

// Caminho para o arquivo de som (coloque em public/sounds/new-order.mp3)
const SOUND_PATH = "/sounds/new-order.mp3";

/**
 * Tenta tocar som criando um novo objeto Audio.
 * Se o navegador bloquear, marca soundBlocked = true
 */
const playSound = async () => {
  try {
    const audio = new Audio(SOUND_PATH);
    await audio.play();
    soundBlocked.value = false;
  } catch (err) {
    console.warn("Falha ao tocar som:", err);
    soundBlocked.value = true;
  }
};

/**
 * Função chamada quando o usuário clica em "Ativar som"
 * Faz uma reprodução curta para desbloquear o autoplay do navegador.
 */
const unlockSound = async () => {
  try {
    // criar e tocar
    const audio = new Audio(SOUND_PATH);
    await audio.play();
    soundBlocked.value = false;
  } catch (err) {
    console.warn("Não foi possível desbloquear o som:", err);
    soundBlocked.value = true;
  }
};

/**
 * Busca pedidos e detecta novos pedidos por ID.
 * Não toca som na primeira carga (initialLoaded === false)
 */
const fetchPedidos = async () => {
  try {
    const response = await axios.get("http://192.168.15.12:8050/api/pedidos");
    const data = response.data || [];

    // Detecta novos ids
    const newOrders = data.filter((p) => !seenIds.has(p.id));

    // Se já tinha carregado antes e vieram novos pedidos => tocar som
    if (initialLoaded.value && newOrders.length > 0) {
      await playSound();
    }

    // Atualiza a lista de pedidos exibida
    pedidos.value = data;

    // Marca todos os IDs como vistos
    data.forEach((p) => seenIds.add(p.id));

    // Marca que já houve a primeira carga
    initialLoaded.value = true;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
  }
};

onMounted(() => {
  // primeira carga
  fetchPedidos();

  // polling periódico — ajuste o intervalo se quiser (ex: 3000 para 3s)
  pollIntervalId = setInterval(fetchPedidos, 5000);
});

onUnmounted(() => {
  if (pollIntervalId) clearInterval(pollIntervalId);
});

/**
 * Marca pedido como preparado no backend e atualiza a lista
 */
const marcarComoPreparado = async (id) => {
  try {
    await axios.post(`http://192.168.15.12:8050/api/pedidos/${id}/preparado`);
    // Remover do seenIds para que, se o mesmo id reaparecer, seja tratado como novo
    seenIds.delete(id);
    // Recarrega
    await fetchPedidos();
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
  }
};
</script>

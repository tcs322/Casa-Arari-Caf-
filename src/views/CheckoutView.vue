<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4"
  >
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
      <h1 class="text-2xl font-bold text-cafe-600 mb-6 text-center">
        Finalizar Pedido
      </h1>

      <div class="mb-4 relative">
        <label for="cliente_nome" class="block text-gray-700 font-medium mb-2">
          Nome do Cliente
        </label>
        <input
          v-model="clienteNome"
          id="cliente_nome"
          type="text"
          placeholder="Digite o nome do cliente"
          @input="onClienteInput"
          @keydown.down.prevent="highlightNext"
          @keydown.up.prevent="highlightPrev"
          @keydown.enter.prevent="selectHighlighted"
          class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cafe-400 outline-none"
          autocomplete="off"
        />

        <!-- Dropdown de autocomplete -->
        <ul
          v-if="showDropdown"
          class="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow max-h-60 overflow-auto"
        >
          <li
            v-for="(p, idx) in filteredPedidos"
            :key="p.id"
            :class="[
              'px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between',
              { 'bg-gray-100': idx === highlightedIndex },
            ]"
            @mousedown.prevent="selectPedido(p)"
            @mouseover="highlightedIndex = idx"
          >
            <div>
              <div class="font-medium text-sm">{{ p.cliente_nome }}</div>
              <div class="text-xs text-gray-500">
                Pedido #{{ p.id }} — R$ {{ formatCurrency(p.valor_total) }}
              </div>
            </div>
            <div class="text-xs text-gray-400 self-center">
              itens: {{ (p.itens || []).length }}
            </div>
          </li>
          <li
            v-if="filteredPedidos.length === 0"
            class="px-3 py-2 text-gray-500"
          >
            Nenhum pedido encontrado
          </li>
        </ul>

        <!-- Mostra pedido selecionado -->
        <div v-if="selectedPedidoId" class="mt-2 text-sm text-gray-600">
          Pedido selecionado:
          <span class="font-semibold">#{{ selectedPedidoId }}</span>
          <button class="ml-3 text-xs text-red-500" @click="clearSelected">
            Remover seleção
          </button>
        </div>
      </div>

      <!-- Exibe o valor total -->
      <div class="mb-6 text-lg font-semibold text-gray-800 text-center">
        Total: R$ {{ total.toFixed(2).replace(".", ",") }}
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
import { ref, computed, onMounted } from "vue";
import { useProductsStore } from "../stores/products";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const productsStore = useProductsStore();

const clienteNome = ref("");
const isLoading = ref(false);
const mensagem = ref("");

const pedidosTodos = ref([]); // carregado do endpoint existente
const selectedPedidoId = ref(null);

// dropdown state
const showDropdown = ref(false);
const highlightedIndex = ref(-1);

// 🧮 Calcula o total do pedido (somatório dos itens)
const total = computed(() =>
  productsStore.cart.reduce(
    (acc, item) =>
      acc + (item.preco || 0) * (item.quantity || item.quantidade || 1),
    0
  )
);

// Formata valor para exibir no dropdown
const formatCurrency = (value) => {
  if (value == null) return "0,00";
  return Number(value).toFixed(2).replace(".", ",");
};

// Filtra pedidos carregados localmente pelo nome do cliente
const filteredPedidos = computed(() => {
  const q = clienteNome.value.trim().toLowerCase();
  if (q.length < 2) {
    return [];
  }
  return pedidosTodos.value.filter((p) =>
    (p.cliente_nome || "").toLowerCase().includes(q)
  );
});

onMounted(async () => {
  try {
    // carrega todos os pedidos (conforme você já tem o endpoint)
    const res = await axios.get("http://192.168.15.22:8050/api/pedidos/todos");
    pedidosTodos.value = res.data || [];
  } catch (err) {
    console.error("Erro ao carregar pedidos:", err);
    // não bloqueia o uso do componente, apenas deixa autocomplete indisponível
  }
});

// comportamento input/autocomplete
const onClienteInput = () => {
  highlightedIndex.value = -1;
  showDropdown.value = filteredPedidos.value.length > 0;
  // se usuário está digitando manualmente, remove seleção anterior
  if (!clienteNome.value || !clienteNome.value.trim()) {
    selectedPedidoId.value = null;
  }
};

const highlightNext = () => {
  if (!showDropdown.value) return;
  const len = filteredPedidos.value.length;
  highlightedIndex.value = (highlightedIndex.value + 1 + len) % len;
};

const highlightPrev = () => {
  if (!showDropdown.value) return;
  const len = filteredPedidos.value.length;
  highlightedIndex.value = (highlightedIndex.value - 1 + len) % len;
};

const selectHighlighted = () => {
  if (
    highlightedIndex.value >= 0 &&
    filteredPedidos.value[highlightedIndex.value]
  ) {
    selectPedido(filteredPedidos.value[highlightedIndex.value]);
  }
};

const selectPedido = (pedido) => {
  selectedPedidoId.value = pedido.id;
  clienteNome.value = pedido.cliente_nome || clienteNome.value;
  showDropdown.value = false;
  highlightedIndex.value = -1;
  // OBS: NÃO modificamos productsStore.cart — você pediu que o carrinho mostre só os novos itens.
};

const clearSelected = () => {
  selectedPedidoId.value = null;
};

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

    const payload = {
      pedido_id: selectedPedidoId.value || null, // se existir, backend fará merge/update
      cliente_nome: clienteNome.value,
      itens: productsStore.cart,
      valor_total: total.value,
    };

    const itensNormalizados = productsStore.cart.map((item) => ({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      quantidade_pendente: item.quantity,
      quantidade: item.quantity, // 🔥 normaliza
    }));

    await axios.post("http://192.168.15.22:8050/api/pedidos", {
      id: selectedPedidoId.value || null,
      cliente_nome: clienteNome.value,
      itens: itensNormalizados,
      valor_total: total.value,
    });

    mensagem.value = "✅ Pedido enviado com sucesso!";
    // limpa o carrinho porque os novos itens foram adicionados ao pedido (novo ou existente)
    productsStore.clearCart();

    setTimeout(() => router.push("/"), 1200);
  } catch (error) {
    console.error(error);
    // tenta pegar mensagem mais descritiva do backend
    if (error.response && error.response.data && error.response.data.message) {
      mensagem.value = `❌ Erro: ${error.response.data.message}`;
    } else {
      mensagem.value = "❌ Erro ao enviar o pedido.";
    }
  } finally {
    isLoading.value = false;
  }
};

const voltar = () => {
  router.push("/");
};
</script>

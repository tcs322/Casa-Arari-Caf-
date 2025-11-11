import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useProductsStore = defineStore("products", () => {
  const products = ref([]);
  const cart = ref([]);
  const selectedCategory = ref(null);
  const isLoading = ref(false);
  const showCart = ref(false);

  // 🔹 Novo: campo de busca
  const searchQuery = ref("");

  // 🔹 Buscar produtos da API
  const fetchProducts = async () => {
    try {
      isLoading.value = true;

      const response = await axios.get(
        "http://192.168.15.22:8050/api/produtos/cafeteria"
      );

      // Mapeia o formato vindo da API para o formato usado no app
      products.value = response.data.data.map((p) => ({
        id: p.id,
        nome: p.nome_titulo,
        descricao: p.descricao ?? "",
        preco: parseFloat(p.preco_venda ?? 0),
        categoria: p.categoria ?? p.tipo ?? "Sem Categoria",
        imagem: p.imagem ?? "/placeholder-coffee.jpg",
        disponivel: p.disponivel ?? true,
      }));
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      isLoading.value = false;
    }
  };

  fetchProducts();

  // 🔹 Categorias únicas
  const categories = computed(() => {
    return [...new Set(products.value.map((p) => p.categoria))];
  });

  // 🔹 Produtos filtrados (categoria + busca)
  const filteredProducts = computed(() => {
    return products.value.filter((product) => {
      const matchCategory =
        !selectedCategory.value || product.categoria === selectedCategory.value;

      const matchSearch = product.nome
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

      return matchCategory && matchSearch && product.disponivel;
    });
  });

  // 🔹 Total do carrinho
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      return total + item.preco * item.quantity;
    }, 0);
  });

  // 🔹 Quantidade de itens
  const cartItemsCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0);
  });

  // 🔹 Adicionar item
  const addToCart = (product) => {
    const existingItem = cart.value.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.value.push({
        ...product,
        quantity: 1,
      });
    }
  };

  // 🔹 Remover item
  const removeFromCart = (productId) => {
    const index = cart.value.findIndex((item) => item.id === productId);
    if (index !== -1) {
      cart.value.splice(index, 1);
    }
  };

  // 🔹 Atualizar quantidade
  const updateQuantity = (productId, quantity) => {
    const item = cart.value.find((item) => item.id === productId);
    if (item) {
      if (quantity <= 0) removeFromCart(productId);
      else item.quantity = quantity;
    }
  };

  // 🔹 Limpar carrinho
  const clearCart = () => {
    cart.value = [];
  };

  // 🔹 Selecionar categoria
  const setCategory = (category) => {
    selectedCategory.value = category;
  };

  // 🔹 Limpar busca
  const clearSearch = () => {
    searchQuery.value = "";
  };

  // 🔹 Controle do carrinho flutuante
  const openCart = () => (showCart.value = true);
  const closeCart = () => (showCart.value = false);
  const toggleCart = () => (showCart.value = !showCart.value);

  return {
    // Estado reativo
    products,
    cart,
    selectedCategory,
    isLoading,
    showCart,
    searchQuery, // 👈 novo campo

    // Computed
    categories,
    filteredProducts,
    cartTotal,
    cartItemsCount,

    // Métodos
    fetchProducts,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCategory,
    clearSearch, // 👈 novo método
    openCart,
    closeCart,
    toggleCart,
  };
});

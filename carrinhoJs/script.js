// =========================
// Lista de produtos
// =========================
const lista_produtos = [
  { id: 1, name: "Product A", price: 19.99, image: "https://placehold.co/500x500" },
  { id: 2, name: "Product B", price: 29.99, image: "https://placehold.co/500x500" },
  { id: 3, name: "Product C", price: 99.99, discounts: 10.00, image: "https://placehold.co/500x500" },
  { id: 4, name: "Product D", price: 9.99, image: "https://placehold.co/500x500" },
  { id: 5, name: "Product E", price: 9.99, discounts: 5.00, image: "https://placehold.co/500x500" },
  { id: 6, name: "Product F", price: 199.99, discounts: 50.00, image: "https://placehold.co/500x500" },
  { id: 7, name: "Product G", price: 399.99, image: "https://placehold.co/500x500" },
  { id: 8, name: "Product H", price: 59.99, image: "https://placehold.co/500x500" }
];
// → Definimos a lista de produtos disponíveis na loja.
// → Cada produto possui: id, nome, preço, imagem e opcionalmente desconto.


// =========================
// Estado do carrinho
// =========================
let carrinho = JSON.parse(localStorage.getItem("meuCarrinho")) || [];
// → Recupera o carrinho salvo no navegador (localStorage) e converte de string para array.
// → Se não houver nada salvo, inicializa com um array vazio.


// =========================
// Seletores
// =========================
const listaProdutosHTML = document.getElementById("lista-produtos");
const carrinhoHTML = document.getElementById("carrinho");
const itensCarrinho = document.getElementById("itens-carrinho");
const qtdItens = document.getElementById("qtd-itens");
const valorDesconto = document.getElementById("valor-desconto");
const valorTotal = document.getElementById("valor-total");
// → Seleciona elementos do HTML onde vamos renderizar os produtos, carrinho e totais.


// =========================
// Funções auxiliares
// =========================

// Formata preço com ou sem desconto
function formatarPreco(produto) {
  return produto.discounts
    ? `<s>R$ ${produto.price.toFixed(2)}</s> R$ ${(produto.price - produto.discounts).toFixed(2)}`
    : `R$ ${produto.price.toFixed(2)}`;
}
// → Recebe um produto e retorna uma string HTML com preço.
// → Se tiver desconto, mostra preço antigo riscado (<s>) e preço com desconto.


// Salva o carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem("meuCarrinho", JSON.stringify(carrinho));
}
// → Converte o array do carrinho para string JSON e salva no localStorage.
// → Permite que o carrinho seja mantido mesmo ao atualizar a página.


// Calcula totais e descontos
function calcularTotais() {
  const total = carrinho.reduce((acc, item) => acc + item.price * item.qtd, 0);
  const descontos = carrinho.reduce((acc, item) => acc + (item.discounts || 0) * item.qtd, 0);
  return { total, descontos };
}
// → Calcula o valor total dos produtos e o total de descontos aplicados.
// → reduce percorre o array acumulando o valor de cada item.


// =========================
// Renderização dos produtos
// =========================
function renderizarProdutos() {
  listaProdutosHTML.innerHTML = ""; // Limpa a lista antes de renderizar
  const fragment = document.createDocumentFragment(); 
  // → DocumentFragment é usado para melhorar performance, evitando múltiplas re-renderizações.

  lista_produtos.forEach(produto => {
    const div = document.createElement("div");
    div.classList.add("produto");
    div.innerHTML = `
      <img src="${produto.image}" alt="${produto.name}">
      <div class="nome-produto">${produto.name}</div>
      <span class="preco-produto">${formatarPreco(produto)}</span>
      <button class="botao-adicionar" data-id="${produto.id}">Adicionar</button>
    `;
    fragment.appendChild(div);
  });

  listaProdutosHTML.appendChild(fragment);
  // → Adiciona todos os produtos ao container de uma vez, evitando múltiplas atualizações do DOM.
}


// =========================
// Renderiza o carrinho
// =========================
function renderCarrinho() {
  itensCarrinho.innerHTML = ""; // Limpa antes de renderizar
  const fragment = document.createDocumentFragment();

  carrinho.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("item-carrinho");
    div.innerHTML = `
      <span>${item.name}</span>
      <span>Qtd: ${item.qtd}</span>
      <span>R$ ${(item.price * item.qtd).toFixed(2)}</span>
      <button class="remover" data-index="${index}">❌</button>
    `;
    fragment.appendChild(div);
  });

  itensCarrinho.appendChild(fragment);

  const { total, descontos } = calcularTotais();

  qtdItens.textContent = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  valorDesconto.textContent = "R$ " + descontos.toFixed(2);
  valorTotal.textContent = "R$ " + (total - descontos).toFixed(2);

  // Mostra ou oculta carrinho
  if (carrinho.length > 0) {
    carrinhoHTML.classList.add("show");
  } else {
    carrinhoHTML.classList.remove("show");
  }

  salvarCarrinho();
  // → Atualiza o DOM com todos os itens, totais e descontos.
  // → Salva o carrinho atualizado no localStorage.
}


// =========================
// Manipulação do carrinho
// =========================

// Adiciona item ao carrinho
function adicionarAoCarrinho(id) {
  const produto = lista_produtos.find(p => p.id === id); // Procura produto pelo id
  const itemExistente = carrinho.find(item => item.id === id); // Verifica se já existe no carrinho

  if (itemExistente) {
    itemExistente.qtd++; // Incrementa quantidade se já existe
  } else {
    carrinho.push({ ...produto, qtd: 1 }); // Adiciona novo item com quantidade 1
  }

  renderCarrinho(); // Atualiza o carrinho
}


// Remove item via delegação
itensCarrinho.addEventListener("click", e => {
  if (e.target.classList.contains("remover")) {
    const index = e.target.dataset.index; // Pega índice do item
    carrinho.splice(index, 1); // Remove do array
    renderCarrinho(); // Atualiza carrinho
  }
});


// =========================
// Eventos
// =========================

// Delegação para botões "Adicionar"
listaProdutosHTML.addEventListener("click", e => {
  if (e.target.classList.contains("botao-adicionar")) {
    const id = parseInt(e.target.dataset.id); // Pega id do produto
    adicionarAoCarrinho(id);
  }
});

// Sincronização entre abas
window.addEventListener('storage', e => {
  if (e.key === 'meuCarrinho') {
    carrinho = e.newValue ? JSON.parse(e.newValue) : [];
    renderCarrinho(); // Atualiza carrinho caso outra aba mude o localStorage
  }
});


// =========================
// Inicialização
// =========================
renderizarProdutos(); // Renderiza todos os produtos da loja
renderCarrinho();     // Renderiza o carrinho salvo (ou vazio)

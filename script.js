
"use strict";

const produtos = [];
let proximoId = 1;

const formProduto = document.getElementById("form-produto");
const formMovimentacao = document.getElementById("form-movimentacao");
const campoNome = document.getElementById("nome");
const campoQuantidade = document.getElementById("quantidade");
const campoMinimo = document.getElementById("minimo");
const campoProduto = document.getElementById("produto");
const campoTipo = document.getElementById("tipo");
const campoQtdMovimento = document.getElementById("qtd-movimento");
const mensagem = document.getElementById("mensagem");

function salvarDados() {
  try {
    localStorage.setItem("estoque-produtos", JSON.stringify(produtos));
    localStorage.setItem("estoque-proximo-id", String(proximoId));
    return true;
  } catch {
    mensagem.textContent = "Não foi possível salvar os dados neste navegador.";
    return false;
  }
}

function carregarDados() {
  try {
    const dados = JSON.parse(localStorage.getItem("estoque-produtos") || "[]");
    const idSalvo = Number(localStorage.getItem("estoque-proximo-id") || "1");

    if (!Array.isArray(dados)) {
      throw new Error("Dados inválidos");
    }

    const validos = dados.every((p) =>
      p &&
      Number.isSafeInteger(p.id) &&
      p.id > 0 &&
      typeof p.nome === "string" &&
      p.nome.trim() !== "" &&
      Number.isSafeInteger(p.quantidade) &&
      p.quantidade >= 0 &&
      Number.isSafeInteger(p.minimo) &&
      p.minimo >= 0
    );

    if (!validos || new Set(dados.map((p) => p.id)).size !== dados.length) {
      throw new Error("Dados inválidos");
    }

    if (!Number.isSafeInteger(idSalvo) || idSalvo <= 0) {
      throw new Error("Identificador inválido");
    }

    produtos.push(...dados);
    proximoId = Math.max(idSalvo, ...dados.map((p) => p.id + 1), 1);
  } catch {
    produtos.length = 0;
    proximoId = 1;
    mensagem.textContent = "Não foi possível carregar os dados salvos. Confira o armazenamento do navegador.";
  }
}

function renderizarProdutos() {
  const lista = document.getElementById("lista-produtos");
  const totalProdutos = document.getElementById("total-produtos");
  const totalBaixo = document.getElementById("total-baixo");

  lista.replaceChildren();
  campoProduto.replaceChildren();

  const opcaoInicial = document.createElement("option");
  opcaoInicial.value = "";
  opcaoInicial.textContent = "Selecione um produto";
  campoProduto.appendChild(opcaoInicial);

  produtos.forEach((produto) => {
    const opcao = document.createElement("option");
    opcao.value = String(produto.id);
    opcao.textContent = produto.nome;
    campoProduto.appendChild(opcao);

    const linha = document.createElement("tr");

    const celulaNome = document.createElement("td");
    celulaNome.textContent = produto.nome;

    const celulaQuantidade = document.createElement("td");
    celulaQuantidade.textContent = String(produto.quantidade);

    const celulaMinimo = document.createElement("td");
    celulaMinimo.textContent = String(produto.minimo);

    const celulaStatus = document.createElement("td");
    if (produto.quantidade <= produto.minimo) {
      celulaStatus.textContent = "Estoque baixo";
      celulaStatus.className = "status-baixo";
    } else {
      celulaStatus.textContent = "Normal";
      celulaStatus.className = "status-ok";
    }

    linha.append(celulaNome, celulaQuantidade, celulaMinimo, celulaStatus);
    lista.appendChild(linha);
  });

  totalProdutos.textContent = String(produtos.length);
  totalBaixo.textContent = String(
    produtos.filter((p) => p.quantidade <= p.minimo).length
  );
}

formProduto.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = campoNome.value.trim();
  const quantidade = Number(campoQuantidade.value);
  const minimo = Number(campoMinimo.value);

  if (!nome || nome.length > 80) {
    mensagem.textContent = "Informe um nome válido de até 80 caracteres.";
    return;
  }

  if (
    !Number.isSafeInteger(quantidade) ||
    quantidade < 0 ||
    !Number.isSafeInteger(minimo) ||
    minimo < 0
  ) {
    mensagem.textContent = "Informe quantidades inteiras e não negativas.";
    return;
  }

  if (produtos.some((p) => p.nome.toLocaleLowerCase("pt-BR") === nome.toLocaleLowerCase("pt-BR"))) {
    mensagem.textContent = "Já existe um produto com esse nome.";
    return;
  }

  const produto = { id: proximoId, nome, quantidade, minimo };
  produtos.push(produto);
  proximoId += 1;

  if (!salvarDados()) {
    produtos.pop();
    proximoId -= 1;
    return;
  }

  renderizarProdutos();
  formProduto.reset();
  mensagem.textContent = "Produto cadastrado com sucesso!";
});

formMovimentacao.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const id = Number(campoProduto.value);
  const quantidade = Number(campoQtdMovimento.value);
  const tipo = campoTipo.value;
  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    mensagem.textContent = "Selecione um produto válido.";
    return;
  }

  if (!Number.isSafeInteger(quantidade) || quantidade <= 0) {
    mensagem.textContent = "Informe uma quantidade inteira maior que zero.";
    return;
  }

  if (tipo !== "entrada" && tipo !== "saida") {
    mensagem.textContent = "Selecione uma movimentação válida.";
    return;
  }

  const novaQuantidade = tipo === "entrada"
    ? produto.quantidade + quantidade
    : produto.quantidade - quantidade;

  if (!Number.isSafeInteger(novaQuantidade) || novaQuantidade < 0) {
    mensagem.textContent = "Estoque insuficiente ou quantidade muito grande.";
    return;
  }

  const quantidadeAnterior = produto.quantidade;
  produto.quantidade = novaQuantidade;

  if (!salvarDados()) {
    produto.quantidade = quantidadeAnterior;
    return;
  }

  renderizarProdutos();
  formMovimentacao.reset();
  mensagem.textContent = tipo === "entrada"
    ? "Entrada registrada com sucesso!"
    : "Saída registrada com sucesso!";
});

carregarDados();
renderizarProdutos();


export function cadastrarProduto(nome, quantidade, minimo) {
  if (!nome || !nome.trim()) {
    throw new Error("Nome inválido");
  }

  if (
    !Number.isSafeInteger(quantidade) ||
    quantidade < 0 ||
    !Number.isSafeInteger(minimo) ||
    minimo < 0
  ) {
    throw new Error("Quantidade inválida");
  }

  return {
    nome: nome.trim(),
    quantidade,
    minimo
  };
}

export function movimentarEstoque(produto, tipo, quantidade) {
  if (!Number.isSafeInteger(quantidade) || quantidade <= 0) {
    throw new Error("Quantidade inválida");
  }

  if (tipo !== "entrada" && tipo !== "saida") {
    throw new Error("Tipo inválido");
  }

  const novaQuantidade = tipo === "entrada"
    ? produto.quantidade + quantidade
    : produto.quantidade - quantidade;

  if (!Number.isSafeInteger(novaQuantidade) || novaQuantidade < 0) {
    throw new Error("Estoque insuficiente");
  }

  return { ...produto, quantidade: novaQuantidade };
}

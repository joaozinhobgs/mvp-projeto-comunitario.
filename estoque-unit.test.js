
import { describe, it, expect } from "vitest";
import {
  cadastrarProduto,
  movimentarEstoque
} from "../estoque.js";

describe("Testes unitários do estoque", () => {
  it("cadastra um produto corretamente", () => {
    const produto = cadastrarProduto("Arroz", 10, 3);

    expect(produto.nome).toBe("Arroz");
    expect(produto.quantidade).toBe(10);
    expect(produto.minimo).toBe(3);
  });

  it("não permite cadastrar produto sem nome", () => {
    expect(() => cadastrarProduto("", 10, 3))
      .toThrow("Nome inválido");
  });

  it("registra entrada de produtos", () => {
    const produto = { nome: "Arroz", quantidade: 10, minimo: 3 };
    const atualizado = movimentarEstoque(produto, "entrada", 5);

    expect(atualizado.quantidade).toBe(15);
  });

  it("registra saída de produtos", () => {
    const produto = { nome: "Arroz", quantidade: 10, minimo: 3 };
    const atualizado = movimentarEstoque(produto, "saida", 4);

    expect(atualizado.quantidade).toBe(6);
  });

  it("impede saída maior que o estoque disponível", () => {
    const produto = { nome: "Arroz", quantidade: 5, minimo: 2 };

    expect(() => movimentarEstoque(produto, "saida", 8))
      .toThrow("Estoque insuficiente");
  });
});

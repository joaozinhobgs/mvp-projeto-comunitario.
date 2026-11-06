/**
 * @vitest-environment jsdom
 */

/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach } from "vitest";

describe("Integração do sistema de estoque", () => {
  beforeEach(async () => {
    localStorage.clear();

    document.body.innerHTML = `
      <form id="form-produto">
        <input id="nome" />
        <input id="quantidade" />
        <input id="minimo" />
        <button type="submit">Cadastrar</button>
      </form>

      <form id="form-movimentacao">
        <select id="produto"></select>
        <select id="tipo">
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <input id="qtd-movimento" />
        <button type="submit">Movimentar</button>
      </form>

      <div id="mensagem"></div>
      <div id="total-produtos"></div>
      <div id="total-baixo"></div>
      <table><tbody id="lista-produtos"></tbody></table>
    `;

    await import("../script.js");
  });

  it("cadastra produto e atualiza a tela e o armazenamento", () => {
    document.getElementById("nome").value = "Arroz";
    document.getElementById("quantidade").value = "10";
    document.getElementById("minimo").value = "3";

    document.getElementById("form-produto").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );

    expect(document.getElementById("mensagem").textContent)
      .toBe("Produto cadastrado com sucesso!");

    expect(document.querySelector("#lista-produtos tr td").textContent)
      .toBe("Arroz");

    expect(document.getElementById("total-produtos").textContent)
      .toBe("1");

    const salvos = JSON.parse(localStorage.getItem("estoque-produtos"));
    expect(salvos[0].nome).toBe("Arroz");
    expect(salvos[0].quantidade).toBe(10);
  });
});


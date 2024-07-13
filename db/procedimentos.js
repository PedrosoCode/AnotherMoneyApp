// procedimentos.js

import { db } from './db';

// Função para listar todas as máquinas
export const listarMaquinas = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM tb_cad_maquina',
      [],
      (tx, results) => {
        let rows = results.rows;
        let maquinas = [];
        for (let i = 0; i < rows.length; i++) {
          maquinas.push(rows.item(i));
        }
        callback(maquinas);
      },
      (error) => {
        console.error("Erro ao recuperar as máquinas:", error);
      }
    );
  });
};

// Função para buscar uma máquina pelo ID
export const buscarMaquinaPorId = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM tb_cad_maquina WHERE id = ?',
      [id],
      (tx, results) => {
        if (results.rows.length > 0) {
          callback(results.rows.item(0));
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error("Erro ao recuperar a máquina:", error);
      }
    );
  });
};

// Função para inserir uma nova máquina
export const inserirMaquina = (maquina, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO tb_cad_maquina (numero_serie, modelo, cor, obs, cliente, contato, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [maquina.numero_serie, maquina.modelo, maquina.cor, maquina.obs, maquina.cliente, maquina.contato, maquina.imagem],
      (tx, results) => {
        callback(results);
      },
      (error) => {
        console.error("Erro ao inserir a máquina:", error);
      }
    );
  });
};

// Função para atualizar uma máquina
export const atualizarMaquina = (id, maquina, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE tb_cad_maquina SET numero_serie = ?, modelo = ?, cor = ?, obs = ?, cliente = ?, contato = ?, imagem = ? WHERE id = ?',
      [maquina.numero_serie, maquina.modelo, maquina.cor, maquina.obs, maquina.cliente, maquina.contato, maquina.imagem, id],
      (tx, results) => {
        callback(results);
      },
      (error) => {
        console.error("Erro ao atualizar a máquina:", error);
      }
    );
  });
};

// Função para excluir uma máquina
export const excluirMaquina = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM tb_cad_maquina WHERE id = ?',
      [id],
      (tx, results) => {
        callback(results);
      },
      (error) => {
        console.error("Erro ao excluir a máquina:", error);
      }
    );
  });
};

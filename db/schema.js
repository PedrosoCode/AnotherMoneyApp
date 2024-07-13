import { db } from './db';

const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tb_cad_maquina (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_serie TEXT,
        modelo TEXT,
        cor TEXT,
        obs TEXT,
        cliente TEXT,
        contato TEXT,
        imagem TEXT
      );`,
      [],
      () => {
        console.log("Tabela tb_cad_maquina criada com sucesso");
      },
      error => {
        console.log("Erro ao criar a tabela tb_cad_maquina", error);
      }
    );
  });
};

export default createTables;

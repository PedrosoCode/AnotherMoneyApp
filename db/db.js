// db.js
import SQLite from 'react-native-sqlite-storage';

const database_name = "appDB.sqlite";
const database_version = "1.0";
const database_displayname = "SQLite Database";

let db;

const openDatabase = (callback) => {
  SQLite.openDatabase(
    {
      name: database_name,
      location: 'default',
    },
    (database) => {
      db = database;
      console.log("Database OPENED");
      createTable(callback);
    },
    (error) => {
      console.error("Error opening database: ", error);
    }
  );
};

const createTable = (callback) => {
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
        console.log("Tabela criada com sucesso");
        if (callback) callback();
      },
      error => {
        console.log("Erro ao criar a tabela", error);
      }
    );
  });
};

export { openDatabase, createTable, db };

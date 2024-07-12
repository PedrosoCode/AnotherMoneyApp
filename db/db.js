import SQLite from 'react-native-sqlite-storage';

const database_name = "appDB.sqlite";
const database_version = "1.0";
const database_displayname = "SQLite Database";
const database_size = 200000;

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
      callback();
    },
    (error) => {
      console.error("Error: ", error);
    }
  );
};

export { openDatabase, db };

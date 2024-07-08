import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const database_name = "appDB.sqlite";
const database_version = "1.0";
const database_displayname = "SQLite Database";
const database_size = 1024 * 1024 * 1024;

let db;

SQLite.openDatabase(
  {
    name: database_name,
    location: 'default',
  },
  (database) => {
    db = database;
  },
  (error) => {
    console.error(error);
  }
);

const UsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tb_usuario', [], (tx, results) => {
        let rows = results.rows;
        let users = [];

        for (let i = 0; i < rows.length; i++) {
          users.push(rows.item(i));
        }

        setUsuarios(users);
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Usuários</Text>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userText}>ID: {item.id}</Text>
            <Text style={styles.userText}>Nome: {item.nome}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  userContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userText: {
    fontSize: 18,
  },
});

export default UsuariosScreen;

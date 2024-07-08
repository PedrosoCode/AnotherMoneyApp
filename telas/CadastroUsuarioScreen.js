import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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

const CadastroUsuarioScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira um nome');
      return;
    }

    db.transaction(tx => {
      tx.executeSql('INSERT INTO tb_usuario (nome) VALUES (?)', [name], (tx, results) => {
        tx.executeSql('UPDATE tb_primeiro_acesso SET primeiro_acesso = 0 WHERE id = 1', [], (tx, results) => {
          navigation.replace('Home');
        });
      }, (error) => {
        console.log(error);
        Alert.alert('Erro', 'Houve um erro ao salvar o nome. Por favor, tente novamente.');
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text>Cadastro de Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={name}
        onChangeText={setName}
      />
      <Button
        title="Salvar e ir para Home"
        onPress={handleSave}
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '80%',
  },
});

export default CadastroUsuarioScreen;

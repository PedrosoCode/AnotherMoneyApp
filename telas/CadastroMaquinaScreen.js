// import React, { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-storage';

const database_name = "appDB.sqlite";
const database_version = "1.0";
const database_displayname = "SQLite Database";
const database_size = 1024 * 1024 * 1024;

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
      createTable(); // Chama a função para criar a tabela
      callback();
    },
    (error) => {
      console.error(error);
    }
  );
};

const createTable = () => {
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
      },
      error => {
        console.log("Erro ao criar a tabela", error);
      }
    );
  });
};

const CadastroMaquinaScreen = ({ navigation }) => {
  const [numeroSerie, setNumeroSerie] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [obs, setObs] = useState('');
  const [cliente, setCliente] = useState('');
  const [contato, setContato] = useState('');
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    openDatabase(() => {
      console.log("Database is ready for operations.");
    });
  }, []);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.error) {
      console.log('ImagePicker Error: ', result.error);
    } else if (result.assets && result.assets.length > 0) {
      setImagem(result.assets[0].base64);
    }
  };

  const handleSave = () => {
    if (numeroSerie.trim() === '' || modelo.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tb_cad_maquina (numero_serie, modelo, cor, obs, cliente, contato, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [numeroSerie, modelo, cor, obs, cliente, contato, imagem],
        (tx, results) => {
          Alert.alert('Sucesso', 'Máquina cadastrada com sucesso');
          navigation.navigate('Home');
        },
        (error) => {
          console.log(error);
          Alert.alert('Erro', 'Houve um erro ao cadastrar a máquina. Por favor, tente novamente.');
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text>Cadastro de Máquina</Text>
      <TextInput
        style={styles.input}
        placeholder="Número de Série"
        value={numeroSerie}
        onChangeText={setNumeroSerie}
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        value={modelo}
        onChangeText={setModelo}
      />
      <TextInput
        style={styles.input}
        placeholder="Cor"
        value={cor}
        onChangeText={setCor}
      />
      <TextInput
        style={styles.input}
        placeholder="Observações"
        value={obs}
        onChangeText={setObs}
      />
      <TextInput
        style={styles.input}
        placeholder="Cliente"
        value={cliente}
        onChangeText={setCliente}
      />
      <TextInput
        style={styles.input}
        placeholder="Contato"
        value={contato}
        onChangeText={setContato}
      />
      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.button}>Escolher Imagem</Text>
      </TouchableOpacity>
      {imagem && <Image source={{ uri: `data:image/jpeg;base64,${imagem}` }} style={{ width: 200, height: 200 }} />}
      <Button
        title="Salvar Máquina"
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
  button: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 16,
  }
});

export default CadastroMaquinaScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const database_name = "appDB.sqlite";
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
      console.error(error);
    }
  );
};

const DetalhesMaquinaScreen = ({ route, navigation }) => {
  const { maquinaId } = route.params;
  const [maquina, setMaquina] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    openDatabase(() => {
      buscarMaquina();
    });
  }, []);

  const buscarMaquina = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tb_cad_maquina WHERE id = ?',
        [maquinaId],
        (tx, results) => {
          if (results.rows.length > 0) {
            setMaquina(results.rows.item(0));
          } else {
            Alert.alert('Erro', 'Máquina não encontrada');
            navigation.goBack();
          }
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };

  const handleSave = () => {
    if (maquina.numero_serie.trim() === '' || maquina.modelo.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tb_cad_maquina SET numero_serie = ?, modelo = ?, cor = ?, obs = ?, cliente = ?, contato = ?, imagem = ? WHERE id = ?',
        [maquina.numero_serie, maquina.modelo, maquina.cor, maquina.obs, maquina.cliente, maquina.contato, maquina.imagem, maquinaId],
        (tx, results) => {
          Alert.alert('Sucesso', 'Máquina atualizada com sucesso');
          setEditMode(false);
        },
        (error) => {
          console.log(error);
          Alert.alert('Erro', 'Houve um erro ao atualizar a máquina. Por favor, tente novamente.');
        }
      );
    });
  };

  const handleDelete = () => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM tb_cad_maquina WHERE id = ?',
        [maquinaId],
        (tx, results) => {
          Alert.alert('Sucesso', 'Máquina excluída com sucesso');
          navigation.goBack();
        },
        (error) => {
          console.log(error);
          Alert.alert('Erro', 'Houve um erro ao excluir a máquina. Por favor, tente novamente.');
        }
      );
    });
  };

  if (!maquina) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {maquina.imagem && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${maquina.imagem}` }}
          style={styles.image}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Número de Série"
        value={maquina.numero_serie}
        onChangeText={(text) => setMaquina({ ...maquina, numero_serie: text })}
        editable={editMode}
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        value={maquina.modelo}
        onChangeText={(text) => setMaquina({ ...maquina, modelo: text })}
        editable={editMode}
      />
      <TextInput
        style={styles.input}
        placeholder="Cor"
        value={maquina.cor}
        onChangeText={(text) => setMaquina({ ...maquina, cor: text })}
        editable={editMode}
      />
      <TextInput
        style={styles.input}
        placeholder="Observações"
        value={maquina.obs}
        onChangeText={(text) => setMaquina({ ...maquina, obs: text })}
        editable={editMode}
      />
      <TextInput
        style={styles.input}
        placeholder="Cliente"
        value={maquina.cliente}
        onChangeText={(text) => setMaquina({ ...maquina, cliente: text })}
        editable={editMode}
      />
      <TextInput
        style={styles.input}
        placeholder="Contato"
        value={maquina.contato}
        onChangeText={(text) => setMaquina({ ...maquina, contato: text })}
        editable={editMode}
      />
      {editMode ? (
        <Button title="Salvar" onPress={handleSave} />
      ) : (
        <Button title="Editar" onPress={() => setEditMode(true)} />
      )}
      <Button title="Excluir" onPress={handleDelete} color="red" />
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

export default DetalhesMaquinaScreen;

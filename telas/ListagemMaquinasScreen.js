import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

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

const ListagemMaquinasScreen = () => {
  const [maquinas, setMaquinas] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    openDatabase(() => {
      listarMaquinas();
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      listarMaquinas();
    }
  }, [isFocused]);

  const listarMaquinas = () => {
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
          setMaquinas(maquinas);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('DetalhesMaquina', { maquinaId: item.id })}>
      {item.imagem && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
          style={styles.image}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Número de Série: {item.numero_serie}</Text>
        <Text>Modelo: {item.modelo}</Text>
        <Text>Cor: {item.cor}</Text>
        <Text>Observações: {item.obs}</Text>
        <Text>Cliente: {item.cliente}</Text>
        <Text>Contato: {item.contato}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={maquinas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#f5f5f5',
  },
  item: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ListagemMaquinasScreen;

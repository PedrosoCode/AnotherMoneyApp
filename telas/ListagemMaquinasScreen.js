import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { listarMaquinas } from '../db/procedimentos'; 

const ListagemMaquinasScreen = () => {
  const [maquinas, setMaquinas] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      listarMaquinas((result) => {
        setMaquinas(result);
      });
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('DetalhesMaquina', { maquinaId: item.id })}>
      {item.imagem && (
        <Image
          source={{ uri: `file://${item.imagem}` }}
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
      {maquinas.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma máquina cadastrada</Text>
      ) : (
        <FlatList
          data={maquinas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
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
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  }
});

export default ListagemMaquinasScreen;

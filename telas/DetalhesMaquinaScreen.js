// DetalhesMaquinaScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import { openDatabase, db } from '../db/db';

const DetalhesMaquinaScreen = ({ route, navigation }) => {
  const { maquinaId } = route.params;
  const [maquina, setMaquina] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    openDatabase(() => {
      if (db) {
        buscarMaquina();
      }
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
          console.log("Error: ", error);
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
          console.log("Error: ", error);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <ImageViewer
          imageUrls={[{ url: `file://${maquina.imagem}` }]}
          enableSwipeDown={true}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
      {maquina.imagem && (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: `file://${maquina.imagem}` }}
            style={styles.image}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.label}>Número de Série:</Text>
      <Text style={styles.value}>{maquina.numero_serie}</Text>
      <Text style={styles.label}>Modelo:</Text>
      <Text style={styles.value}>{maquina.modelo}</Text>
      <Text style={styles.label}>Cor:</Text>
      <Text style={styles.value}>{maquina.cor}</Text>
      <Text style={styles.label}>Observações:</Text>
      <Text style={styles.value}>{maquina.obs}</Text>
      <Text style={styles.label}>Cliente:</Text>
      <Text style={styles.value}>{maquina.cliente}</Text>
      <Text style={styles.label}>Contato:</Text>
      <Text style={styles.value}>{maquina.contato}</Text>
      <Button title="Editar" onPress={() => navigation.navigate('EditarMaquina', { maquinaId })} />
      <Button title="Excluir" onPress={handleDelete} color="red" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

export default DetalhesMaquinaScreen;

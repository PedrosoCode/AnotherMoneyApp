import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import RNFS from 'react-native-fs';
import { openDatabase, db } from '../db/db';
import { buscarMaquinaPorId, atualizarMaquina } from '../db/procedimentos';

const EditarMaquinaScreen = ({ route, navigation }) => {
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
    buscarMaquinaPorId(maquinaId, (maquina) => {
      setMaquina(maquina);
    });
  };

  const handleSave = () => {
    if (maquina.numero_serie.trim() === '' || maquina.modelo.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    atualizarMaquina(maquinaId, maquina, (results) => {
      Alert.alert('Sucesso', 'Máquina atualizada com sucesso');
      navigation.navigate('ListagemMaquinas', { reload: true });
    });
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.error) {
      console.log('ImagePicker Error: ', result.error);
    } else if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName = `${new Date().getTime()}_${asset.fileName}`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Save image to local storage
      RNFS.copyFile(asset.uri, filePath)
        .then(() => {
          setMaquina({ ...maquina, imagem: filePath });
        })
        .catch(error => {
          console.log('Error saving image: ', error);
        });
    }
  };

  const removeImage = () => {
    setMaquina({ ...maquina, imagem: null });
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
        {maquina.imagem && (
          <Image
            source={{ uri: `file://${maquina.imagem}` }}
            style={styles.image}
          />
        )}
      </Modal>
      {maquina.imagem && (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: `file://${maquina.imagem}` }}
            style={styles.image}
          />
        </TouchableOpacity>
      )}
      <TextInput
        style={styles.input}
        placeholder="Número de Série"
        value={maquina.numero_serie}
        onChangeText={(text) => setMaquina({ ...maquina, numero_serie: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        value={maquina.modelo}
        onChangeText={(text) => setMaquina({ ...maquina, modelo: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Cor"
        value={maquina.cor}
        onChangeText={(text) => setMaquina({ ...maquina, cor: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Observações"
        value={maquina.obs}
        onChangeText={(text) => setMaquina({ ...maquina, obs: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Cliente"
        value={maquina.cliente}
        onChangeText={(text) => setMaquina({ ...maquina, cliente: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Contato"
        value={maquina.contato}
        onChangeText={(text) => setMaquina({ ...maquina, contato: text })}
      />
      <>
        <Button title="Adicionar Imagem" onPress={pickImage} />
        {maquina.imagem && <Button title="Remover Imagem" onPress={removeImage} color="red" />}
      </>
      <Button title="Salvar" onPress={handleSave} />
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

export default EditarMaquinaScreen;

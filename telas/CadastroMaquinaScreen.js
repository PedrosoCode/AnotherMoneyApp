import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { inserirMaquina } from '../db/procedimentos';

const CadastroMaquinaScreen = ({ navigation }) => {
  const [numeroSerie, setNumeroSerie] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [obs, setObs] = useState('');
  const [cliente, setCliente] = useState('');
  const [contato, setContato] = useState('');
  const [imagemPath, setImagemPath] = useState(null);

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
          setImagemPath(filePath);
        })
        .catch(error => {
          console.log('Error saving image: ', error);
        });
    }
  };

  const handleSave = () => {
    if (numeroSerie.trim() === '' || modelo.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const maquina = {
      numero_serie: numeroSerie,
      modelo: modelo,
      cor: cor,
      obs: obs,
      cliente: cliente,
      contato: contato,
      imagem: imagemPath
    };

    inserirMaquina(maquina, (results) => {
      Alert.alert('Sucesso', 'Máquina cadastrada com sucesso');
      navigation.navigate('Home');
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
      {imagemPath && <Image source={{ uri: `file://${imagemPath}` }} style={{ width: 200, height: 200 }} />}
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

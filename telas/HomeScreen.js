import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button
        title="Sobre"
        onPress={() => navigation.navigate('About')}
      />
       <Button
        title="pingpong"
        onPress={() => navigation.navigate('PingPong')}
      />
      <Button
        title="Usuários"
        onPress={() => navigation.navigate('Usuarios')}
      />
       <Button
        title="Cadastro de Máquina"
        onPress={() => navigation.navigate('CadastroMaquina')}
      />
      <Button
        title="ListagemMaquinas de Máquina"
        onPress={() => navigation.navigate('ListagemMaquinas')}
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
});

export default HomeScreen;

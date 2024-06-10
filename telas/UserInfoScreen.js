import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const UserInfoScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Informações do Usuário</Text>
      {/* Aqui você pode adicionar o formulário para inserir o nome do usuário */}
      <Button
        title="Salvar e ir para Home"
        onPress={() => navigation.replace('Home')}
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

export default UserInfoScreen;

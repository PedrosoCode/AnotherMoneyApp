import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme, ActivityIndicator, View } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

import HomeScreen from './telas/HomeScreen';
import AboutScreen from './telas/AboutScreen';
import CadastroUsuarioScreen from './telas/CadastroUsuarioScreen';
import UsuariosScreen from './telas/UsuariosScreen';
import PingPongScreen from './telas/PingPongScreen';
import CadastroMaquinaScreen from './telas/CadastroMaquinaScreen';
import ListagemMaquinasScreen from './telas/ListagemMaquinasScreen';
import DetalhesMaquinaScreen from './telas/DetalhesMaquinaScreen';

import createTables from './db/schema';
import { openDatabase } from './db/db';

SQLite.DEBUG(true);
SQLite.enablePromise(false);

const Stack = createStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    openDatabase(() => {
      createTables();
    });
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333' : '#FFF',
  };

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="CadastroUsuario" component={CadastroUsuarioScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Usuarios" component={UsuariosScreen} /> 
        <Stack.Screen name="PingPong" component={PingPongScreen} />
        <Stack.Screen name="CadastroMaquina" component={CadastroMaquinaScreen} />
        <Stack.Screen name="ListagemMaquinas" component={ListagemMaquinasScreen} />
        <Stack.Screen name="DetalhesMaquina" component={DetalhesMaquinaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

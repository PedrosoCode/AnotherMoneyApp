// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

import HomeScreen from './telas/HomeScreen';
import AboutScreen from './telas/AboutScreen';
import CadastroUsuarioScreen from './telas/CadastroUsuarioScreen';
import UsuariosScreen from './telas/UsuariosScreen';
import PingPongScreen from './telas/PingPongScreen';
import CadastroMaquinaScreen from './telas/CadastroMaquinaScreen';
import ListagemMaquinasScreen from './telas/ListagemMaquinasScreen';
import DetalhesMaquinaScreen from './telas/DetalhesMaquinaScreen';
import EditarMaquinaScreen from './telas/EditarMaquinaScreen';

import createTables from './db/schema';
import { openDatabase } from './db/db';

SQLite.DEBUG(true);
SQLite.enablePromise(false);

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="DetalhesMaquina" component={DetalhesMaquinaScreen} />
    <Stack.Screen name="EditarMaquina" component={EditarMaquinaScreen} />
  </Stack.Navigator>
);

const App = () => {
  useEffect(() => {
    openDatabase(() => {
      createTables();
    });
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333' : '#FFF',
  };

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeStack} />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen name="CadastroUsuario" component={CadastroUsuarioScreen} />
        <Drawer.Screen name="Usuarios" component={UsuariosScreen} />
        <Drawer.Screen name="PingPong" component={PingPongScreen} />
        <Drawer.Screen name="CadastroMaquina" component={CadastroMaquinaScreen} />
        <Drawer.Screen name="ListagemMaquinas" component={ListagemMaquinasScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;

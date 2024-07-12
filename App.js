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

SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = "appDB.sqlite";
const database_version = "1.0";
const database_displayname = "SQLite Database";
const database_size = 1024 * 1024 * 1024;

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
      console.log(error);
    }
  );
};

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Home');
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    openDatabase(() => {
      // Database is opened, you can perform any necessary operations here
      // For this example, we're setting the initial route directly to "Home"
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
      <Stack.Navigator initialRouteName={initialRoute}>
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

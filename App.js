import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme, ActivityIndicator, View } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

import HomeScreen from './telas/HomeScreen';
import AboutScreen from './telas/AboutScreen';
import CadastroUsuarioScreen from './telas/CadastroUsuarioScreen';
import UsuariosScreen from './telas/UsuariosScreen';

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

const checkFirstAccess = (callback) => {
  db.transaction(tx => {
    tx.executeSql('SELECT primeiro_acesso FROM tb_primeiro_acesso WHERE id=1', [], (tx, res) => {
      callback(res.rows.item(0).primeiro_acesso === 1);
    });
  });
};

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    openDatabase(() => {
      checkFirstAccess((isFirstAccess) => {
        if (isFirstAccess) {
          setInitialRoute('CadastroUsuario');
        } else {
          setInitialRoute('Home');
        }
      });
    });
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme, View, Text, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

import HomeScreen from './telas/HomeScreen';
import AboutScreen from './telas/AboutScreen';
import UserInfoScreen from './telas/UserInfoScreen';
import PingPongScreen from './telas/PingPongScreen';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "appDB.sqlite";
const database_version = "1.0";
const database_displayname = "SQLite Database";
const database_size = 1024 * 1024 * 1024; // 1 GB em bytes

let db;

const openDatabase = async () => {
  try {
    db = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    console.log("Database OPENED");

    await db.transaction(tx => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS tb_usuario (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL
        );
      `);

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS pingpong (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          value TEXT NOT NULL
        );
      `);

      tx.executeSql(`INSERT INTO pingpong (value) VALUES ('ping');`);
      tx.executeSql(`INSERT INTO pingpong (value) VALUES ('pong');`);
    });
    console.log("Tables created or already exist");
  } catch (error) {
    console.log(error);
  }
};

const checkUserTable = async () => {
  try {
    let result = await db.executeSql('SELECT COUNT(*) as count FROM tb_usuario');
    return result[0].rows.item(0).count === 0;
  } catch (error) {
    console.log(error);
    return true;
  }
};

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Home');
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    openDatabase().then(async () => {
      const isUserTableEmpty = await checkUserTable();
      if (isUserTableEmpty) {
        setInitialRoute('UserInfo');
      }
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
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="PingPong" component={PingPongScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

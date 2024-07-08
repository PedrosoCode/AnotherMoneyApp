import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const database_name = "appDB.sqlite";
const database_version = "1.0";
const database_displayname = "SQLite Database";
const database_size = 1024 * 1024 * 1024; // 1 GB em bytes

let db;

const PingPongScreen = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        db = await SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        );

        db.transaction(tx => {
          tx.executeSql('SELECT * FROM pingpong', [], (tx, results) => {
            let rows = results.rows;
            let records = [];

            for (let i = 0; i < rows.length; i++) {
              records.push(rows.item(i));
            }

            setRecords(records);
          });
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>PingPong Records</Text>
      {records.map(record => (
        <Text key={record.id} style={styles.record}>{record.value}</Text>
      ))}
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
  header: {
    fontSize: 20,
    marginBottom: 16,
  },
  record: {
    fontSize: 16,
    marginVertical: 8,
  },
});

export default PingPongScreen;

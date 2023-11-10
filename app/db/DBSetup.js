import SQLite from "react-native-sqlite-storage";
import { SETTINGS_KEYS } from "../config/settingsKeys";

let db;

export const initializeDB = async () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(true);
      return;
    }

    db = SQLite.openDatabase(
      { name: "timer.db", location: "default" },
      async () => {
        try {
          db.executeSql("PRAGMA foreign_keys = ON;", []);
          await initTables();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      },
      (error) => reject(error),
    );
  });
};

export const initTables = async () => {
  console.log("Initializing tables: ", db);

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Setting (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT,
        value TEXT
      );`,
      [],
      (_tx, _resultSet) => {
        return;
      },
      (error) => {
        console.error("Error creating `Setting` table.", error);
      },
    );

    tx.executeSql(
      `INSERT OR IGNORE INTO Setting
      (id, key, value)
      VALUES ( ?, ?, ? );`,
      [1, SETTINGS_KEYS.SOUND, "true"],
      (_tx, resultSet) => {
        return;
      },
      (error) => {
        console.error("Error setting defaults in `Setting` table.", error);
      },
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Routine (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numberOfLoops INTEGER,
        title TEXT,
        duration INTEGER,
        color TEXT,
        userCreated INTEGER,
        timeCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        timeMostRecentlyCompleted TIMESTAMP 
      );`,
      [],
      (_tx, _resultSet) => {
        return;
      },
      (error) => {
        console.error("Error creating `Routine` table.", error);
      },
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Exercise (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routineID INTEGER,
        title TEXT,
        exerciseOrder INTEGER, 
        tag TEXT,
        workTime INTEGER,
        numberOfRounds INTEGER,
        restBetweenRounds INTEGER,
        breakBeforeNext INTEGER,
        category TEXT,
        color TEXT,
        FOREIGN KEY (routineID) REFERENCES Routine(id) ON DELETE CASCADE
      );`,
      [],
      (_tx, _resultSet) => {
        return;
      },
      (error) => {
        console.error("Error creating `Exercise` table.", error);
      },
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS RoutineCompletion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routineID INTEGER REFERENCES Routine(id) ON DELETE CASCADE,
        completionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      (_tx, _resultSet) => {
        return;
      },
      (error) => {
        console.error("Error creating `Routine` table.", error);
      },
    );
  });
};

export const getDBInstance = () => {
  return db;
};

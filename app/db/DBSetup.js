import SQLite from "react-native-sqlite-storage";

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
          await createTables();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      },
      (error) => reject(error),
    );
  });
};

export const createTables = async () => {
  console.log("Creating tables: ", db);
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Sound (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        file TEXT,
        type TEXT
      );`,
      [],
      (_tx, _resultSet) => {
        return;
      },
      (error) => {
        console.error("Error creating `Sound` table.", error);
      },
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Routine (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numberOfLoops INTEGER,
        exerciseSoundID INTEGER REFERENCES Sound(id),
        restSoundID INTEGER REFERENCES Sound(id),
        breakSoundID INTEGER REFERENCES Sound(id),
        endSoundID INTEGER REFERENCES Sound(id),
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
        FOREIGN KEY (routineID) REFERENCES Routine(id) ON DELETE CASCADE,
        UNIQUE(routineID, exerciseOrder)
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
        routineID INTEGER REFERENCES Routine(id),
        startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

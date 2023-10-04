import SQLite from "react-native-sqlite-storage";

let db;

// To be completely safe from race-conditions,
// we should check when this is complete, and
// only then should we allow the user to
// start using the app.
//
// In practice, the set up should be fast enough
// to precede any query made in the app.
export const initializeDB = () => {
  return new Promise((resolve, reject) => {
    db = SQLite.openDatabase(
      { name: "timer.db", location: "default" },
      () => {
        db.executeSql("PRAGMA foreign_keys = ON;", []);
        createTables()
          .then(() => resolve())
          .catch((error) => reject(error));
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
        userCreated INTEGER
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
        routineID INTEGER ,
        title TEXT,
        tag TEXT,
        workTime INTEGER,
        numberOfRounds INTEGER,
        restBetweenRounds INTEGER,
        breakBeforeNext INTEGER,
        category TEXT,
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

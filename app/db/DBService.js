import { db, initDB } from "./db";

// Must be run first. Called by App.js' useEffect.
export const getDBConnection = async () => {
  initDB();
};

export const createTables = async () => {
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
      `CREATE TABLE IF NOT EXISTS Exercise (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        tag TEXT,
        workTime INTEGER,
        numberOfRounds INTEGER,
        restBetweenRounds INTEGER,
        breakBeforeNext INTEGER,
        category TEXT
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
      `CREATE TABLE IF NOT EXISTS Routine (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numberOfLoops INTEGER,
        exerciseSound INTEGER REFERENCES Sound(id),
        restSound INTEGER REFERENCES Sound(id),
        breakSound INTEGER REFERENCES Sound(id),
        endSound INTEGER REFERENCES Sound(id),
        title TEXT,
        duration INTEGER,
        colour TEXT
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

  tx.executeSql(
    `
      CREATE TABLE IF NOT EXISTS RoutineExercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routineId INTEGER REFERENCES Routine(id),
        exerciseId INTEGER REFERENCES Exercise(id),
        exerciseType TEXT CHECK(exerciseType IN ('simplified', 'generic')),
        exerciseOrder INTEGER
      );
    `,
    [],
    (_tx, _resultSet) => {
      return;
    },
    (error) => {
      console.error("Error creating `RoutineExercises` table.", error);
    },
  );
};

export const insertExercise = (exerciseData, callback) => {
  const {
    title,
    tag,
    workTime,
    numberOfRounds,
    restBetweenRounds,
    breakBeforeNext,
    category,
  } = exerciseData;

  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO Exercise (title, tag, workTime, numberOfRounds, restBetweenRounds, breakBeforeNext, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        tag,
        workTime,
        numberOfRounds,
        restBetweenRounds,
        breakBeforeNext,
        category,
      ],
      (_, results) => callback(results.insertId),
    );
  });
};

export const getAllExercises = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Exercise",
        [],
        (_, results) => {
          let exercises = [];
          for (let i = 0; i < results.rows.length; i++) {
            exercises.push(results.rows.item(i));
          }
          resolve(exercises);
        },
        (_, error) => reject(error),
      );
    });
  });
};

// Used only for testing
export const clearTable = async () => {
  const deleteQuery = `DELETE from Routine`;
  await db.executeSql(deleteQuery);
};

// Used only for testing
export const dropTable = async () => {
  const deleteQuery = `DROP TABLE Routine`;
  await db.executeSql(deleteQuery);
};

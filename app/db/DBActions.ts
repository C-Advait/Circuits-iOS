import { getDBInstance } from "./DBSetup";

import { Exercise } from "../classes/Exercise";
import { Routine } from "../classes/Routine";
import getCurrentTimestamp from "../utilities/getCurrentTimestamp";

// Settings
const retrieveSetting = (key: String) => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT value FROM Setting WHERE key = ?",
        [key],
        (_tx: any, results: any) => {
          resolve(
            results.rows.raw().length > 0 ? results.rows.raw()[0] : undefined,
          );
        },
        (error: any) => {
          console.log(`Couldn't retrieve setting with key: ${key}.`);
          console.log(`It is possible that this is an initial app-load.`);
          reject(error);
        },
      );
    });
  });
};

export const getSettings = () => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM Setting",
        [],
        (_tx: any, results: any) => {
          resolve(results.rows.raw());
        },
        (error: any) => {
          console.log(`Couldn't retrieve all userSettings.`);
          reject(error);
        },
      );
    });
  });
};

const updateSetting = (key: String, value: String) => {
  const db = getDBInstance();

  return new Promise<number>((resolve, reject) => {
    db.transaction((tx: any) => {
      const query = `UPDATE Setting 
      SET value = ?
      WHERE key = ?`;

      tx.executeSql(
        query,
        [value, key],
        (_txObj: any, resultSet: any) => {
          console.log(`Update succeeded`);
          resolve(resultSet.rowsAffected);
        },
        (error: any) => reject(error),
      );
    });
  });
};

// CREATE
const createExercise = (exercise: Exercise) => {
  const db = getDBInstance();

  return new Promise<number>((resolve, reject) => {
    db.transaction((tx: any) => {
      const query = `INSERT INTO Exercise (
         routineID, 
         title, 
         exerciseOrder,
         tag, 
         workTime, 
         numberOfRounds, 
         restBetweenRounds, 
         breakBeforeNext, 
         category,
         color
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      tx.executeSql(
        query,
        [
          exercise.routineID,
          exercise.title,
          exercise.exerciseOrder,
          exercise.tag,
          exercise.workTime,
          exercise.numberOfRounds,
          exercise.restBetweenRounds,
          exercise.breakBeforeNext,
          exercise.category,
          exercise.color,
        ],
        (_txObj: any, resultSet: any) => {
          // return the id of the newly inserted row
          resolve(resultSet.insertId);
        },
        (error: any) => reject(error),
      );
    });
  });
};

const createRoutine = async (routine: Routine) => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      const query = `INSERT INTO Routine (
         numberOfLoops, 
         title, 
         duration, 
         color, 
         userCreated,
         timeMostRecentlyCompleted
       ) VALUES (?, ?, ?, ?, ?, ?)`;

      tx.executeSql(
        query,
        [
          routine.numberOfLoops,
          routine.title,
          routine.duration,
          routine.color,
          routine.userCreated ? 1 : 0, // converting boolean to integer
        ],
        (_txObj: any, resultSet: any) => {
          resolve(resultSet.insertId);
        },
        (_txObj: any, error: any) => {
          reject(
            new Error(`Couldn't create a routine. Error: 
                        ${error.message || error}`),
          );
        },
      );
    });
  });
};

// Writes to a table of RoutineCompletion rows,
// contrast with updateMostRecentRoutineCompletion
const logRoutineCompletion = async (routineID: number) => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      const query = `INSERT INTO RoutineCompletion (
          routineID
        ) VALUES (?)`;

      tx.executeSql(
        query,
        [routineID],
        (_tx: any, results: any) => {
          if (results.rowsAffected > 0) {
            resolve(results.insertId);
          } else {
            reject(new Error("Failed to log routine completion"));
          }
        },
        (error: any) => {
          reject(error);
        },
      );
    });
  });
};

// READ
const getAllUserCreatedRoutines = async () => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM Routine WHERE userCreated = 1 ORDER BY id",
        [],
        (_tx: any, results: any) => {
          resolve(results.rows.raw().map((row: any) => new Routine(row)));
        },
      );
    }, reject);
  });
};

const getAllDefaultRoutines = async () => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM Routine WHERE userCreated = 0 ORDER BY id",
        [],
        (_tx: any, results: any) => {
          resolve(results.rows.raw().map((row: any) => new Routine(row)));
        },
      );
    }, reject);
  });
};

const getAllRoutines = async () => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM Routine",
        [],
        (_tx: any, results: any) => {
          resolve(results.rows.raw().map((row: any) => new Routine(row)));
        },
      );
    }, reject);
  });
};

const getNewRoutineID = async () => {
  const db = getDBInstance();

  return new Promise<number>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT MAX(id) as maxID FROM Routine",
        [],
        (_tx, results) => {
          const maxID = results.rows.item(0).maxID || 0;
          resolve(maxID + 1);
        },
        (error) => reject(error),
      );
    });
  });
};

// Includes 'default' routines,
// i.e., those with userCreated = false.
const getAllRoutineNames = async () => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT title FROM Routine",
        [],
        (_tx: any, results: any) => {
          resolve(results.rows.raw().map((obj: any) => obj.title));
        },
      );
    }, reject);
  });
};

const getRoutineByID = async (routineID: number) => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM Routine WHERE id = ?",
        [routineID],
        (_tx: any, results: any) => {
          resolve(new Routine(results.rows.item(0)));
        },
      );
    }, reject);
  });
};

const getExercisesForRoutine = async (routineID: number) => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM Exercise WHERE routineID = ? ORDER BY exerciseOrder ASC",
        [routineID],
        (_tx: any, results: any) => {
          resolve(results.rows.raw().map((row: any) => new Exercise(row)));
        },
      );
    }, reject);
  });
};

// UPDATE
const updateExercise = async (exercise: Exercise) => {
  const db = getDBInstance();

  return new Promise<number>((resolve, reject) => {
    db.transaction((tx: any) => {
      const query = `UPDATE Exercise SET
          routineID = ?,
          title = ?,
          exerciseOrder = ?,
          tag = ?,
          workTime = ?,
          numberOfRounds = ?,
          restBetweenRounds = ?,
          breakBeforeNext = ?,
          category = ?,
          color = ?
        WHERE id = ?`;

      tx.executeSql(
        query,
        [
          exercise.routineID,
          exercise.title,
          exercise.exerciseOrder,
          exercise.tag,
          exercise.workTime,
          exercise.numberOfRounds,
          exercise.restBetweenRounds,
          exercise.breakBeforeNext,
          exercise.category,
          exercise.color,
          exercise.id,
        ],
        (_txObj: any, resultSet: any) => {
          resolve(resultSet.rowsAffected);
        },
        (error: any) => reject(error),
      );
    });
  });
};

const updateRoutine = async (routine: Routine) => {
  const db = getDBInstance();

  return new Promise<number>((resolve, reject) => {
    db.transaction((tx: any) => {
      const query = `UPDATE Routine SET
          numberOfLoops = ?,
          title = ?,
          duration = ?,
          color = ?,
          userCreated = ?
        WHERE id = ?`;

      tx.executeSql(
        query,
        [
          routine.numberOfLoops,
          routine.title,
          routine.duration,
          routine.color,
          routine.userCreated,
          routine.id,
        ],
        (_txObj: any, resultSet: any) => {
          resolve(resultSet.rowsAffected);
        },
        (error: any) => reject(error),
      );
    });
  });
};

const updateMostRecentRoutineCompletion = async (routineID: number) => {
  const db = getDBInstance();

  return new Promise<number>((resolve, reject) => {
    db.transaction((tx: any) => {
      const query = `UPDATE Routine SET
          timeMostRecentlyCompleted = ?
        WHERE id = ?`;

      tx.executeSql(
        query,
        [getCurrentTimestamp(), routineID],
        (_txObj: any, resultSet: any) => {
          resolve(resultSet.rowsAffected);
        },
        (error: any) => reject(error),
      );
    });
  });
};

// DELETE
const deleteExercise = async (exerciseID: number) => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "DELETE FROM Exercise WHERE id = ?",
        [exerciseID],
        (_tx: any, results: any) => {
          resolve(results.rowsAffected);
        },
      );
    }, reject);
  });
};

const deleteRoutine = async (routineID: number) => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "DELETE FROM Routine WHERE id = ?",
        [routineID],
        (_tx: any, results: any) => {
          resolve(results.rowsAffected);
        },
      );
    }, reject);
  });
};

export {
  retrieveSetting,
  updateSetting,
  createExercise,
  createRoutine,
  logRoutineCompletion,
  getAllUserCreatedRoutines,
  getAllDefaultRoutines,
  getAllRoutineNames,
  getAllRoutines,
  getRoutineByID,
  getExercisesForRoutine,
  getNewRoutineID,
  updateExercise,
  updateRoutine,
  deleteExercise,
  deleteRoutine,
};

// FOR TESTING
export const clearTable = async (tableName: string) => {
  const db = getDBInstance();

  const deleteQuery = `DELETE from ${tableName}`;
  await db.executeSql(deleteQuery);
};

// FOR TESTING
export const dropTable = async (tableName: string) => {
  const db = getDBInstance();

  const deleteQuery = `DROP TABLE ${tableName}`;
  await db.executeSql(deleteQuery);
};

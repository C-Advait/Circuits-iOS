import { getDBInstance } from "./DBSetup";

import { Sound } from "../classes/Sound";
import { Exercise } from "../classes/Exercise";
import { Routine } from "../classes/Routine";
import getCurrentTimestamp from "../utilities/getCurrentTimestamp";

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
         exerciseSoundID, 
         restSoundID, 
         breakSoundID, 
         endSoundID, 
         title, 
         duration, 
         color, 
         userCreated,
         timeMostRecentlyCompleted,
         emoji
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      tx.executeSql(
        query,
        [
          routine.numberOfLoops,
          routine.exerciseSoundID,
          routine.restSoundID,
          routine.breakSoundID,
          routine.endSoundID,
          routine.title,
          routine.duration,
          routine.color,
          routine.userCreated ? 1 : 0, // converting boolean to integer
          null,
        ],
        (_txObj: any, resultSet: any) => {
          resolve(resultSet.insertId);
        },
        (_txObj: any, error: any) => {
          reject(error);
        },
      );
    });
  });
};

const createSound = (sound: Sound) => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        `INSERT INTO Sound (
          title,
          file,
          type
        ) VALUES (?, ?, ?)`,
        [sound.title, sound.file, sound.type],
        (_tx: any, resultSet: any) => {
          resolve(resultSet.insertId);
        },
        (_tx: any, error: any) => {
          reject(error);
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
        "SELECT * FROM Routines WHERE userCreated = 1",
        [],
        (_tx: any, results: any) => {
          resolve(results.rows.raw().map((row: any) => new Routine(row)));
        },
      );
    }, reject);
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
          exerciseSoundID = ?,
          restSoundID = ?,
          breakSoundID = ?,
          endSoundID = ?,
          title = ?,
          duration = ?,
          color = ?,
          userCreated = ?,
          emoji = ?
        WHERE id = ?`;

      tx.executeSql(
        query,
        [
          routine.numberOfLoops,
          routine.exerciseSoundID,
          routine.restSoundID,
          routine.breakSoundID,
          routine.endSoundID,
          routine.title,
          routine.duration,
          routine.color,
          routine.userCreated,
          routine.emoji,
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
  createExercise,
  createRoutine,
  createSound,
  logRoutineCompletion,
  getAllUserCreatedRoutines,
  getAllRoutineNames,
  getRoutineByID,
  getExercisesForRoutine,
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

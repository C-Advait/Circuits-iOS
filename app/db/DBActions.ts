import { getDBInstance } from "./DBSetup";

import { Exercise } from "../classes/Exercise";
import { Routine } from "../classes/Routine";
import getCurrentTimestamp from "../utilities/getCurrentTimestamp";
import { SUBSCRIPTION_GRACE_PERIOD_DAYS } from "../config/appConstants";

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

const doesUserSubscriptionExist = async () => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * from UserSubscription LIMIT 1",
        [],
        (_tx: any, results: any) => {
          if (results.rows.length === 1) {
            // No entry exists
            resolve(true);
          } else {
            resolve(false);
          }
        },
      );
    });
  });
};

const getUserSubscriptionTable = async () => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM UserSubscription",
        [],
        (_tx: any, results: any) => {
          let rows = [];
          for (let i = 0; i < results.rows.length; i++) {
            rows.push(results.rows.item(i));
          }
          resolve(rows); // Resolves with the array of rows
        },
        (error: any) => {
          reject(error); // Rejects with the error if there's any
        },
      );
    });
  });
};

const getUserSubscriptionStatus = async ({
  returnSubscription = false,
} = {}) => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM UserSubscription LIMIT 1", // Assuming there's only one entry per user
        [],
        (_tx: any, results: any) => {
          const subscription = results.rows.item(0);
          console.log(
            "Here's the subscription: ",
            JSON.stringify(subscription, null, 2),
          );
          console.log("returnSub; ", returnSubscription);
          if (returnSubscription) resolve(subscription);

          // Check if user has ever synced to RevenueCat
          if (subscription.expirationDate) {
            const currentDate = new Date();
            const expirationDate = new Date(subscription.expirationDate);
            const forcedDowngradeDate = new Date(expirationDate);
            // TODO: Change to __setDate__.
            forcedDowngradeDate.setMinutes(
              forcedDowngradeDate.getMinutes() + 1,
            );

            if (currentDate < expirationDate) {
              // User Subscription is fine
              resolve([true, false]);
            } else if (currentDate < forcedDowngradeDate) {
              // User is in grace period
              resolve([true, true]);
            } else {
              // User has passed grace period
              resolve([false, false]);
            }
          } else {
            // User has never synced
            resolve([false, false]);
          }
        },
        (error: any) => reject(error),
      );
    });
  });
};

const getAllRoutineCompletions = async (routineID: number) => {
  const db = getDBInstance();

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM RoutineCompletion",
        [routineID],
        (_tx: any, results: any) => {
          resolve(results.rows.raw());
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

const updateUserSubscriptionOnSync = (
  customerInfo: any,
  activeEntitlement: any,
) => {
  const db = getDBInstance();
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx: any) => {
      const query = `UPDATE UserSubscription SET
          requestDate = ?,
          entitlementId = ?,
          isActive = ?,
          productId = ?,
          periodType = ?,
          expirationDate = ?,
          purchaseDate = ?,
          originalPurchaseDate = ?,
          store = ?,
          isSandbox = ?,
          unsubscribeDetectedAt = ?,
          billingIssueDetectedAt = ?,
          revenueCatID = ? 
        WHERE id = ?`;

      tx.executeSql(
        query,
        [
          customerInfo.requestDate,
          activeEntitlement.identifier,
          activeEntitlement.isActive,
          activeEntitlement.productIdentifier,
          activeEntitlement.periodType,
          activeEntitlement.expirationDate,
          activeEntitlement.latestPurchaseDate,
          activeEntitlement.originalPurchaseDate,
          activeEntitlement.store,
          activeEntitlement.isSandbox,
          activeEntitlement.unsubscribeDetectedAt,
          activeEntitlement.billingIssueDetectedAt,
          customerInfo.originalAppUserId,
          1,
        ],
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
  getAllRoutineNames,
  getRoutineByID,
  getExercisesForRoutine,
  doesUserSubscriptionExist,
  getUserSubscriptionStatus,
  getUserSubscriptionTable,
  updateExercise,
  updateRoutine,
  updateUserSubscriptionOnSync,
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

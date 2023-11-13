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
          await createTables();
          await setDefaultValues();
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
  console.log(`Creating tables... db = ${JSON.stringify(db, null, 2)}`);

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

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS UserSubscription (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requestDate TEXT,
        entitlementId TEXT,
        isActive INTEGER,
        willRenew INTEGER,
        productId TEXT,
        periodType Text,
        expirationDate TEXT,
        purchaseDate TEXT,
        originalPurchaseDate TEXT,
        store TEXT,
        isSandbox INTEGER,
        unsubscribeDetectedAt TEXT,
        billingIssueDetectedAt TEXT,
        revenueCatID TEXT
      );`,
      [],
      (_tx, _resultSet) => {
        return;
      },
      (error) => {
        console.error("Error creating `UserSubscription` table.", error);
      },
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS UserSubscriptionAuxiliary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crossgrade INTEGER, 
        expiryNotificationCount INTEGER 
      );`,
      [],
      (_tx, _resultSet) => {
        return;
      },
      (error) => {
        console.error(
          "Error creating `UserSubscriptionAuxiliary` table.",
          error,
        );
      },
    );
  });
};

export const setDefaultValues = async () => {
  console.log(`Setting default table values`);

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT OR IGNORE INTO Setting
      (id, key, value)
      VALUES ( ?, ?, ? );`,
      [1, SETTINGS_KEYS.SOUND, "true"],
      (_tx, _resultSet) => {
        return;
      },
      (error) => {
        console.error("Error setting defaults in `Setting` table.", error);
      },
    );

    tx.executeSql(
      `INSERT OR IGNORE INTO UserSubscription
      (id, isActive)
      VALUES ( ?, ? );`,
      [1, 0],
      (_tx, _resultSet) => {
        return;
      },
      (error) => {
        console.error(
          "Error setting defaults in `UserSubscription` table.",
          error,
        );
      },
    );

    tx.executeSql(
      `INSERT OR IGNORE INTO UserSubscriptionAuxiliary
      (id, crossgrade, expiryNotificationCount)
      VALUES ( ?, ?, ? );`,
      [1, 0, 0],
      (_tx, _resultSet) => {
        return;
      },
      (error) => {
        console.error(
          "Error setting defaults in `UserSubscriptionAuxiliary` table.",
          error,
        );
      },
    );
  });
};

export const getDBInstance = () => {
  return db;
};

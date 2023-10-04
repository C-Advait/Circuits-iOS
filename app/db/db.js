import { enablePromise, openDatabase } from "react-native-sqlite-storage";

// Single global db connection.
let db;

const initDB = async () => {
  enablePromise(true);
  db = await openDatabase({
    name: "timer.db",
    location: "default",
  });
};

export { db, initDB };

import React, { createContext, useContext, useState } from "react";

const RoutineContext = createContext();

export const useRoutineContext = () => {
  return useContext(RoutineContext);
};

export const RoutineProvider = ({ children }) => {
  const [contextRoutine, setContextRoutine] = useState();
  const [contextExercises, setContextExercises] = useState([]);

  return (
    <RoutineContext.Provider
      value={{
        contextRoutine,
        setContextRoutine,
        contextExercises,
        setContextExercises,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};

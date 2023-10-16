import React, { useState, useEffect } from "react";
import eventManager from "./eventManager";

const Receiver = ({ children }) => {
  const [data, setData] = useState(0);

  useEffect(() => {
    const handleRoundChange = (data) => {
      setData(data);
    };

    // Listen for the event
    eventManager.addListener("numberOfRounds", handleRoundChange);

    // Cleanup listener on component unmount
    return () => {
      eventManager.removeListener("numberOfRounds", handleRoundChange);
    };
  }, []);

  return (
    <React.Fragment>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data });
        }
        return child;
      })}
    </React.Fragment>
  );
};

export default Receiver;

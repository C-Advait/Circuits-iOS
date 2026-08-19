import { useEffect, useRef } from "react";

const { scheduleCountdownDeadline } = require("../utilities/countdownDeadline");

const useCountdownDeadline = ({ deadline, onComplete }) => {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (deadline === null) return;

    return scheduleCountdownDeadline({
      deadline,
      onComplete: () => onCompleteRef.current(),
    });
  }, [deadline]);
};

export default useCountdownDeadline;

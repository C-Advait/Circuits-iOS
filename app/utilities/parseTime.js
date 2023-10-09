const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;

export default (total_seconds) => {
  const hours = Math.floor(total_seconds / SECONDS_IN_HOUR);
  const minutes = Math.floor(
    (total_seconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE,
  );
  const seconds = (total_seconds % 60).toString().padStart(2, "0");

  if (hours > 0) {
    return hours + ":" + minutes.toString().padStart(2, "0") + ":" + seconds;
  }
  return minutes + ":" + seconds;
};

export default function getCurrentTimestamp() {
  const now = new Date();

  const year = now.getUTCFullYear().toString();

  // Add leading zeros to month, day, hours, minutes, seconds, and milliseconds if needed
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = now.getUTCDate().toString().padStart(2, "0");
  const hours = now.getUTCHours().toString().padStart(2, "0");
  const minutes = now.getUTCMinutes().toString().padStart(2, "0");
  const seconds = now.getUTCSeconds().toString().padStart(2, "0");
  const milliseconds = now.getUTCMilliseconds().toString().padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

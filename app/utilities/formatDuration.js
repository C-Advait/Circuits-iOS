export default function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    let minutes = Math.round(seconds / 60);
    return `${minutes}m`;
  } else {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.round((seconds % 3600) / 60);
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  }
}

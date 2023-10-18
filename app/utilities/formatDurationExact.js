export default function formatDurationExact(seconds) {
    const date = new Date(seconds * 1000).toISOString().slice(11, 19);
    const hours = parseInt(date.slice(0, 2));
    const minutes = parseInt(date.slice(3, 5));
    const remainingSeconds = parseInt(date.slice(6));

    let formattedString = '';
    if (hours > 0) formattedString += `${hours}h `;
    if (minutes > 0) formattedString += `${minutes}m `;
    if (remainingSeconds > 0) formattedString += `${remainingSeconds}s`;

    return formattedString
}

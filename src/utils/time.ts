export function getLocalTimeFromTimestamp(timestamp: number) {
  // Ensure the timestamp is in milliseconds. If it's in seconds, convert it to milliseconds.
  if (timestamp.toString().length === 10) {
    timestamp *= 1000; // Convert seconds to milliseconds
  }

  // Create a new Date object using the provided timestamp
  const date = new Date(timestamp);

  // Array of month abbreviations
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract the date components
  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()]; // Get abbreviated month

  // Extract the time components
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Format date and time
  const formattedDate = `${day} ${month}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  // Return the full formatted date and time
  return { formattedDate, formattedTime };
}

export function parseTime(time: string, unit: string) {
  let _time = parseInt(time);

  if (unit === "minutes") {
    _time = _time * 60;
  }

  if (unit === "hours") {
    _time = _time * 3600;
  }

  if (unit === "days") {
    _time = _time * 86400;
  }

  if (unit === "months") {
    _time = _time * 60 * 60 * 24 * 30.44;
  }

  return _time.toString();
}

export function getCurrentTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function formatTime(timeInSeconds: number) {
  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;
  const secondsInMonth = secondsInDay * 30.44; // Approximate average month length
  const secondsInYear = secondsInDay * 365.25; // Approximate average year length

  let timeUnit;
  let timeValue;

  if (timeInSeconds < secondsInMinute) {
    timeUnit = "second";
    timeValue = timeInSeconds;
  } else if (timeInSeconds < secondsInHour) {
    timeUnit = "minute";
    timeValue = Math.floor(timeInSeconds / secondsInMinute);
  } else if (timeInSeconds < secondsInDay) {
    timeUnit = "hour";
    timeValue = Math.floor(timeInSeconds / secondsInHour);
  } else if (timeInSeconds < secondsInMonth) {
    timeUnit = "day";
    timeValue = Math.floor(timeInSeconds / secondsInDay);
  } else if (timeInSeconds < secondsInYear) {
    timeUnit = "month";
    timeValue = Math.floor(timeInSeconds / secondsInMonth);
  } else {
    timeUnit = "year";
    timeValue = Math.floor(timeInSeconds / secondsInYear);
  }

  return { value: timeValue, unit: timeValue > 1 ? timeUnit + "s" : timeUnit };
}

/**
 * Converts seconds into a formatted string showing days, hours, minutes, and seconds
 * in the standard format of DD:HH:MM:SS
 * @param {number} totalSeconds - Total number of seconds to convert
 * @returns {string} - Formatted time string (e.g., "01:05:30:45")
 */
export function countdown(totalSeconds: number) {
  // Handle invalid input
  if (typeof totalSeconds !== "number" || isNaN(totalSeconds) || totalSeconds < 0) {
    return "Invalid input";
  }

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Format each component to have two digits
  const formattedDays = days.toString().padStart(2, "0");
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  // Combine into standard format
  return `${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

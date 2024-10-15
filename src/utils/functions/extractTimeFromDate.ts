export default function extractTimeFromDate(dateString: any) {
  // Create a Date object from the ISO string
  const date = new Date(dateString);
  
  // Extract current date information
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  // Determine if the date is today
  const isToday = date.toDateString() === now.toDateString();

  // Determine if the date is yesterday
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // Get the start of the current week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  // Extract hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format hours and minutes to always be two digits
  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  // Return the formatted time for today
  if (isToday) {
    return `${formattedHours}:${formattedMinutes}`;
  }

  // Return 'Yesterday' if the date was yesterday
  if (isYesterday) {
    return 'Yesterday';
  }

  // Return the day of the week if the date is within the current week
  if (date >= startOfWeek) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  }

  // Return the date in dd/mm/yyyy format if it's from a different week
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

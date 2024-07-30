export default function extractTimeFromDate(dateString:any) {
    // Create a Date object from the ISO string
    const date = new Date(dateString);

    // Extract hours and minutes
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
  
    // Format hours and minutes to always be two digits
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
    // Return the formatted time without seconds
    return `${formattedHours}:${formattedMinutes}`;
  }
  
export default function extractTimeFromDateSubmit(dateString: Date) {
    // Create a new Date object from the input string
    const date = new Date(dateString);
  
    // Extract hours, minutes, and seconds, ensuring two digits (e.g., 09 for single digit)
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
    // Return the formatted time string
    return `${hours}:${minutes}`;
};
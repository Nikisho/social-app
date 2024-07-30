export default function formatDate(date: Date): string {
    // Extract day, month, and year from the date object
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() is zero-based, so we need to add 1
    const year = date.getFullYear();
  
    // Format day and month to always be two digits
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
  
    // Combine into the desired format
    return `${formattedDay}/${formattedMonth}/${year}`;
  }
  
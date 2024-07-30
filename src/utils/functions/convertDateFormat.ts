function convertDateFormat(date: string): string {
    // Extract day, month, and year from the date object
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error('Invalid date format. Expected yyyy-mm-dd');
      }
    
      // Split the date string into components
      const [year, month, day] = date.split('-').map(Number);
    
      // Return the formatted date as 'dd/mm/yyyy'
      return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  }

  export default convertDateFormat
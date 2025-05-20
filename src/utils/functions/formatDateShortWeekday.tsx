export default function formatDateShortWeekday(input: Date | string) {
    const date = new Date(input); // e.g. "2025-05-10"
    const formatter = new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',  // “Sat”
        day: '2-digit',// “10”
        month: 'short'   // “May”
    });
    // Intl often injects a comma: “Sat, 10 May”
    // We can just strip it out:
    return (formatter.format(date).replace(',', ''));
}
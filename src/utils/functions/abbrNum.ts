function abbrNum(number: number, decPlaces: number): string {
    // If the number is negative or zero, don't abbreviate
    if (number <= 0) return number.toString();

    // Set the decimal places factor (10^decPlaces)
    const decFactor = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    const abbrev = ["k", "m", "b", "t"];

    // Loop through the abbreviations in reverse order
    for (let i = abbrev.length - 1; i >= 0; i--) {
        const size = Math.pow(10, (i + 1) * 3);

        // If the number is larger than the current size, abbreviate
        if (number >= size) {
            number = Math.round(number * decFactor / size) / decFactor;  // Round to the appropriate decimal places
            // Special case: if rounding makes it equal to 1000, move to the next abbreviation
            if (number === 1000 && i < abbrev.length - 1) {
                number = 1;
                i++;
            }
            return number + abbrev[i];  // Return the number with abbreviation
        }
    }

    return number.toString();  // Return the number as string if no abbreviation was applied
}


export default abbrNum;
/**
 * Parses a date string without separators into a JavaScript Date object.
 *
 * @param {string} dateString - The date string in the format "yyyyMMddTHHmmss.SSSZ".
 * @returns {Date} A Date object representing the parsed date and time.
*/

export function parseDateStringToDate(dateString: string): Date {
    const year = parseInt(dateString.slice(0, 4));
    const month = parseInt(dateString.slice(4, 6)) - 1;
    const day = parseInt(dateString.slice(6, 8));
    const hours = parseInt(dateString.slice(9, 11));
    const minutes = parseInt(dateString.slice(11, 13));
    const seconds = parseInt(dateString.slice(13, 15));
    const milliseconds = parseInt(dateString.slice(16, 19));
    console.log(dateString, year, month, day, hours, minutes, seconds, milliseconds)
    const dateObject = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
    
    return dateObject;
}
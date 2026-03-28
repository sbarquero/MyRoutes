// Return a string of a date with format YYYY-MM-DDTHH:MM
// This string is used for locale date input
export function convertDateToLocaleDateString(d: Date): string {
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const hour = ('0' + d.getHours()).slice(-2);
  const minute = ('0' + d.getMinutes()).slice(-2);
  const second = ('0' + d.getSeconds()).slice(-2);
  const date = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  return date;
}

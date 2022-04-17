export default function DateDiff(date1, date2) {
    let Date1ms = new Date(date1).getTime();
    let Date2ms = new Date(date2).getTime();
    const diffInMs = Math.abs(Date2ms - Date1ms);
    return diffInMs / (1000 * 60 * 60 * 24);
}
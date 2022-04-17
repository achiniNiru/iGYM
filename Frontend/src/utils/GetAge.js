export default function getAge(dateString) {
    var ageInMilliseconds = Date.now() - new Date(dateString).getTime();
    return Math.floor(ageInMilliseconds/1000/60/60/24/365)+" Years";
}
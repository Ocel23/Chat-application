export default function dateFormater(date) {
    if (date) {
        const today = new Date(date);
        let formatedDate = `${today.getDate()}.${today.getMonth() + 1} in ${today.getHours()}:${today.getMinutes()}`;
        return formatedDate;
    }
    const today = new Date();
    let formatedDate = `${today.getDate()}.${today.getMonth() + 1} in ${today.getHours()}:${today.getMinutes()}`;
    return formatedDate;
}
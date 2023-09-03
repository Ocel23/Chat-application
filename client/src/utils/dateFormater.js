import { config } from "../config";

export default function dateFormater(date) {

    if (date) {
        const today = new Date(date);
        let formatedDate = `${config.chatPage.dateFormat}`;
        formatedDate = formatedDate.replace("%hours%", today.getHours());
        formatedDate = formatedDate.replace("%minutes%", today.getMinutes());
        formatedDate = formatedDate.replace("%month%", today.getMonth() + 1);
        formatedDate = formatedDate.replace("%day%", today.getDate());
        return formatedDate;
    }
    const today = new Date();
    let formatedDate = `${config.chatPage.dateFormat}`;
    formatedDate = formatedDate.replace("%hours%", today.getHours());
    formatedDate = formatedDate.replace("%minutes%", today.getMinutes());
    formatedDate = formatedDate.replace("%month%", today.getMonth() + 1);
    formatedDate = formatedDate.replace("%day%", today.getDate());
    return formatedDate;
}

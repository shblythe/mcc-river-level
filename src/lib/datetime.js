export const isToday = (date) => {
    const today = new Date();
    if (date.getDate() !== today.getDate()) {
        return false;
    }
    if (date.getMonth() !== today.getMonth()) {
        return false;
    }
    if (date.getYear() !== today.getYear()) {
        return false;
    }
    return true;
}

export const timeOnly = (date) => {
    return date.getHours().toString().padStart(2, '0')+":" +
        date.getMinutes().toString().padStart(2, '0');
}

export const formattedDateFromString = (dateString) => {
    const date=new Date(dateString);
    if (isToday(date)) {
        return timeOnly(date);
    }
    return dateString;
}


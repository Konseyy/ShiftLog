export const stringDateFromDate = (date, dividor="-") => {
    let year = date.getFullYear();
    let month = (date.getMonth()+1).toString();
    if(month.length===1)month='0'+month;
    let day = date.getDate().toString();
    if(day.length===1)day='0'+day;
    return year+dividor+month+dividor+day;
}
export const stringTimeFromDate = (date) => {
    new Date().getMonth();
    let hours = date.getHours().toString();
    if(hours.length===1) hours="0"+hours;
    let minutes = date.getMinutes().toString();
    if(minutes.length===1) minutes="0"+minutes;
    return hours+":"+minutes;
}
export const differenceInMinutes = (date1,date2) => {
    let diff = (date2-date1)/1000/60;
    if(diff<0) diff=-diff;
    return diff;
}
export const displayHoursAndMinutes = (minutes) => {
    if(minutes%60===0){
        return `${minutes/60}h`
    }
    else{
        return `${(minutes-minutes%60)/60}h ${minutes%60}min`
    }
}
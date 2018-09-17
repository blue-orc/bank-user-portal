export default function convertDate(milliseconds) {
    var date = new Date(milliseconds);

    var obj = {};
    obj.year = date.getFullYear();
    obj.day = date.getDay();
    obj.month = date.getMonth();
    obj.hour = date.getHours();
    obj.minute = date.getMinutes();
    
    if(obj.hour > 11){
        obj.hour -= 12
        obj.ampm = 'PM'
    }
    else{
        obj.ampm = 'AM'
    }

    return obj.month + '/' + obj.day + '/' + obj.year + ' ' + obj.hour + ':' + obj.minute + ' ' + obj.ampm
}
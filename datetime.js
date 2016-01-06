angular.module("rc-datetime", [])

// Create time string for given datetime in the format hh:mm:ss
.filter("formatTime", function() {
    // Pad a given number with the given padChar until it reaches the desiredLength
    function pad(n, desiredLength, padChar) {
        n = n.toString();
        for(var i=n.length; i<desiredLength; ++i) {
            n = padChar+n;
        }
        return n;
    }

    return function(datetime) {
        if(!datetime instanceof Date) {
            datetime = new Date(datetime);
        }
        if(datetime == "Invalid Date") {
            return "-";
        }
        var h = pad(datetime.getHours(), 2, '0');
        var m = pad(datetime.getMinutes(), 2, '0');
        var s = pad(datetime.getSeconds(), 2, '0');
        return h+":"+m+":"+s;
    };
})

// Create string for given datetime, where date is only shown if the given
// datetime was before yesterday; otherwise, we show `yesterday` if the
// given date was yesterday and we show nothing for the date if it was today.
// The datetime argument can either be a string that can serve as the first argument
    // to a Date object, or an actual Date object.
.filter("formatDatetime", ["formatTimeFilter", function(formatTimeFilter) {
    var monthMap = ["Janary", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    return function(datetime) {
        if(!(datetime instanceof Date)) {
            datetime = new Date(datetime);
        }
        if(datetime == "Invalid Date") {
            return "-";
        }
        var curDate = new Date();
        var yesterday = new Date();
        yesterday.setDate(curDate.getDate()-1);
        yesterday.setHours(0);
        yesterday.setMinutes(0);
        yesterday.setSeconds(0);
        yesterday.setMilliseconds(0);
        var sameDay = function(d1, d2) {
            return d1.getYear()  == d2.getYear()  &&
                d1.getMonth() == d2.getMonth() &&
                d1.getDate()  == d2.getDate();
        };
        if(datetime < yesterday) {
            var day = datetime.getDate();
            var month = datetime.getMonth();
            var year = datetime.getFullYear();
            if(monthMap[month]) month = monthMap[month].substr(0, 3);
            return year + " " + month + " " + day + " " + formatTimeFilter(datetime);
        }
        if(sameDay(datetime, yesterday)) {
            return "Yesterday "+formatTimeFilter(datetime);
        }
        return formatTimeFilter(datetime);
    }
}])

(function () {
    "use strict";

    window.addEventListener('load', function () {
        document.querySelectorAll('.datetime').forEach(function (elem) {
            // <p class="datetime" from="2021-04-15 06:00" duration="90">Session 1: </p>
            var indiaTime = elem.getAttribute('from');
            var durationInMins = elem.getAttribute('duration');

            var timeZoneArea = Intl.DateTimeFormat().resolvedOptions().timeZone;

            var timeZone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]

            var fromTimeIndia = moment.tz(indiaTime, "Asia/Kolkata");
            var fromTimeLocal = moment(fromTimeIndia).tz(Intl.DateTimeFormat().resolvedOptions().timeZone);

            var timehtml = "<br>" + "<b>" + elem.innerHTML + " </b>";
            if (timeZone !== "IST" && timeZone !== "GMT+5:30") {
                timehtml += "<br>" + fromTimeLocal.format("ll LT") + " to "
                    + fromTimeLocal.clone().add(durationInMins, 'minutes').format("LT") + " " + timeZone + " Or";
            }
            timehtml += "<br>" + fromTimeIndia.format("ll LT") + " to "
                + fromTimeIndia.clone().add(durationInMins, 'minutes').format("LT") + " IST ";


            console.log(timehtml);

            elem.innerHTML = timehtml;
        })

        document.querySelectorAll('.outsideIndia').forEach(function (elem) {
            var timeZone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]
            if (timeZone === "IST" || timeZone === "GMT+5:30") {
                elem.style.visibility = ""
            }

            if (timeZone !== "IST" && timeZone !== "GMT+5:30") {
                elem.style.visibility = "visible";
            } else {
                elem.style.visibility = "hidden";
            }
        })
    });



})();
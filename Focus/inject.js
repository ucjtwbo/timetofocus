// this is the code which will be injected into a given page...

(function() {

	// just place a div at top right
	var div = document.createElement('div');
	div.style.position = 'fixed';
	div.style.top = 0;
	div.style.right = 0;
	div.textContent = 'Injected!';
	//document.body.appendChild(div);

	alert('This is now the main task page.');
    
    //window.addEventListener('focus', function(){console.log('window focus')});
    window.addEventListener('focus', function() {notifyMe('endInt')});//end blur event   
    window.addEventListener('blur', function() {notifyMe('startInt')});//end blur event
    
    var sumTimes, nrTimes, startVisit = 0;
    
            function millisToMinutesAndSeconds(millis) {
          var minutes = Math.floor(millis / 60000);
          var seconds = ((millis % 60000) / 1000).toFixed(0);
            //var seconds = (millis - minutes * 60).toFixed(2);
            if(minutes == 0)
               {
                   return (seconds < 10 ? '0' : '') + seconds + " s";
               }
            
               else
                   {  return minutes + "m, " + (seconds < 10 ? '0' : '') + seconds + " s";}

            }
   
    
    	function loadBinaryFile(path,success) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", chrome.extension.getURL(path), true); 
        xhr.responseType = "arraybuffer";
        xhr.onload = function() {
            var data = new Uint8Array(xhr.response);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            success(arr.join(""));
        };
        xhr.send();
    };

    
// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});
    

function notifyMe(event) {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }
    if(event == "endInt")
        {
            console.log("window focus");
            if(typeof sumTimes == 'undefined')
                {
                    sumTimes = 0;
                    nrTimes = 0;
                    //console.log(nrTimes);
                }
            else
                {
                    var endVisit = Date.now();
                    var timeTaken = endVisit - startVisit;
                    sumTimes = sumTimes + timeTaken;
                    nrTimes = nrTimes + 1;
                    console.log("nr: " + nrTimes + " dur: " + timeTaken + "total: " + sumTimes);
                }
            return sumTimes, nrTimes;
        }
    else if(event == "startInt")
        {
            console.log("window blur");
            if(nrTimes == 1)
                {
                    return;
                }
            startVisit = Date.now();
            var avg = sumTimes/nrTimes;
            
            if( isNaN(avg) )
                {
                    var msg = "No interruption data available yet.";
                }
            else
                {
                    var msg = "On average you go away for " + millisToMinutesAndSeconds(avg.toFixed(2));
                }
                      if (Notification.permission !== "granted")
                        Notification.requestPermission();
                      else {
                        var notification = new Notification('Beware of the time', {
                          icon: 'https://cdn0.iconfinder.com/data/icons/clocks-and-watches/500/Alarm_clock_quick_speed_sport_stop_stopwatch_time-512.png',
                          body: msg,
                        });


                      }
            return startVisit;
        }
     }
    
    /*
    ///Only gets current session data.
    if(test == "startInt")
        {
            console.log('window blur');
            var startVisit = Date.now();
                            
            if(typeof sumTimes == 'undefined')
                {
                    var sumTimes = 0;
                    var msg = "No interruption data available yet.";
                }
            else
                {
                    var avg = sumTimes/allTimes.length;
                    var msg = "On average you go away for " + millisToMinutesAndSeconds(avg.toFixed(2));
                    
                    

                }
            
        if (Notification.permission !== "granted")
        Notification.requestPermission();
        else {
            var notification = new Notification('Beware of the time', {
            icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Mauritius_Road_Signs_-_Warning_Sign_-_Other_dangers.svg/1112px-Mauritius_Road_Signs_-_Warning_Sign_-_Other_dangers.svg.png',
            body: msg,
            });
                
    notification.onclick = function () {
      window.open("http://stackoverflow.com/a/13328397/1269037");      
    };
    
  }
           
            
        }
        if(test == "endInt")
        {
            console.log('window focus');
            var endVisit = Date.now();
            var timeTaken = endVisit - startVisit; 
            
            chrome.storage.local.get(function(allTimes) {
            if(typeof(allTimes["myWords"]) !== 'undefined' && allTimes["myWords"] instanceof Array) { 
                allTimes["myWords"].push(timeTaken);
                sumTimes += timeTaken;
                } 

            chrome.storage.local.set(allTimes);  }
    
        )}
    
*/
    /*// BEGIN OF SQL CODE
   var pageTitle = document.title;
    loadBinaryFile("ManicTimeReports.db", function(data){
		var db = new SQL.Database(data);
		
        		 //var result = db.exec("SELECT AVG(sum5s) FROM (SELECT ( (julianday(EndLocalTime) - julianday(StartLocalTime)) * 86400.0) AS sum5s FROM `Ar_Activity` WHERE Name='Facebook' ORDER BY `_rowid_`)");
            
                //var commonIdTable = db.exec("select CommonGroupId FROM Ar_Activity WHERE Name = '" + document.title + "' LIMIT 1");

                var commonIdTable = db.exec("SELECT CommonGroupId from (select *, COUNT(CommonGroupId) as id_count FROM Ar_Activity WHERE Name LIKE '%" + document.location.host + "%' GROUP BY CommonGroupId ORDER BY id_count DESC LIMIT 1)")
               if (!commonIdTable.length)
               {
                   var msg = "No interruption data available yet.";
                   
                }
                else
                    {
                        
                    
                var commonId = commonIdTable[0].values[0];
                console.log(commonId);
        
                        //WORKS BUT SUMS ALL VISITS 
                        var result = db.exec("select avg(intTime) from (select (case when CommonId = '" + commonId + "' then '" + commonId + "' else 'other' end) as which, sum(TotalSeconds) as intTime from (select Ar_WebSiteByDay.*, (select count(*) from Ar_WebSiteByDay t2 where t2.rowid <= Ar_WebSiteByDay.rowid and t2.CommonId = '" + commonId + "') as grp from Ar_WebSiteByDay ) Ar_WebSiteByDay group by (case when CommonId = '" + commonId + "' then '" + commonId + "' else 'other' end), grp order by grp, which) where which = 'other'");
                        
                //var result = db.exec("select avg(intTime) from (select (case when CommonId = '" + commonId + "' then '" + commonId + "' else 'other' end) as which, sum(TotalSeconds) as intTime from (select Ar_ApplicationByYear.*, (select count(*) from Ar_ApplicationByYear t2 where t2.rowid <= Ar_ApplicationByYear.rowid and t2.CommonId = '" + commonId + "') as grp from Ar_ApplicationByYear ) Ar_ApplicationByYear group by (case when CommonId = '" + commonId + "' then '" + commonId + "' else 'other' end), grp order by grp, which) where which = 'other'");
                        
                //var result = db.exec("select avg(intTime) from (select (case when CommonGroupId = '" + commonId + "' then '1' else 'other' end) as which, sum(visit_time) as IntTime from (select Ar_Activity.*, julianday(EndUtcTime)  julianday(StartUtcTime) as visit_time, (select count(*) from Ar_Activity t2 where t2.rowid <= Ar_Activity.rowid and t2.CommonGroupId = '" + commonId + "') as grp from Ar_Activity) Ar_Activity group by (case when CommonGroupId = '" + commonId + "' then '1' else 'other' end), grp order by grp, which) where which = 'other'");
        
                //WORKS BUT TAKES LONG 
                //var result = db.exec("select avg(intTime) from (select (case when CommonGroupId = '" + commonId + "' then '1' else 'other' end) as which, sum(visit_time) as IntTime from (select Ar_Activity.*, (strftime('%s',EndLocalTime) - strftime('%s',StartLocalTime)) as visit_time, (select count(*) from Ar_Activity t2 where t2.rowid <= Ar_Activity.rowid and t2.CommonGroupId = '" + commonId + "') as grp from Ar_Activity) Ar_Activity group by (case when CommonGroupId = '" + commonId + "' then '1' else 'other' end), grp order by grp, which) where which = 'other'");
                        
                //WORKS var result = db.exec("select avg(intTime) from (select (case when CommonId = 7 then '7' else 'other' end) as which, sum(TotalSeconds) as intTime from (select Ar_ApplicationByYear.*, (select count(*) from Ar_ApplicationByYear t2 where t2.rowid <= Ar_ApplicationByYear.rowid and t2.CommonId = '7') as grp from Ar_ApplicationByYear ) Ar_ApplicationByYear group by (case when CommonId = '7' then '7' else 'other' end), grp order by grp, which)");
        
                var avgtime = result[0].values[0];
                console.log(avgtime[0].toFixed(2));
                //var msg = "Interruptions take you " + avgtime[0].toFixed(2) + " sec";
                        
                var msg = "On average you go away for " + millisToMinutesAndSeconds(avgtime[0].toFixed(2));
                        }
		//var res = db.exec("SELECT `_rowid_`,* FROM `Ar_Activity` WHERE Name='Facebook' ORDER BY `_rowid_` ASC LIMIT 0, 50000;");
		//document.getElementById("res").textContent = JSON.stringify(res);
          if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Beware of the time', {
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Mauritius_Road_Signs_-_Warning_Sign_-_Other_dangers.svg/1112px-Mauritius_Road_Signs_-_Warning_Sign_-_Other_dangers.svg.png',
      body: msg,
    });

    
  }
	});// END OF SQL CODE */

}

    
)();
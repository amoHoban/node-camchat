jQuery(document).ready(function(){
    $("input").focus(function(){
        if ($(this).attr("placeholder").length > 0) $(this).attr("_placeholder",$(this).attr("placeholder")).attr("placeholder","");
    })

    $("input").blur(function(){
      if ($(this).attr("_placeholder").length > 0) $(this).attr("placeholder",$(this).attr("_placeholder"));
    })
})

var formatTime = function(unixTimestamp) {
    var dt = new Date(unixTimestamp * 1000);

    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var seconds = dt.getSeconds();

    // the above dt.get...() functions return a single digit
    // so I prepend the zero here when needed
    if (hours < 10) 
     hours = '0' + hours;

    if (minutes < 10) 
     minutes = '0' + minutes;

    if (seconds < 10) 
     seconds = '0' + seconds;

    return hours + ":" + minutes + ":" + seconds;
}       

var scrollDownText = function(el){
      el.scrollTop(el[0].scrollHeight+20);
      $("body, html").height("100%");
};



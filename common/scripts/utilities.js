if (!window.st) window.st = {};
var st = window.st;

/* Firebug fix */
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

/*
 * Get URL parameter
 * http://www.netlobo.com/url_query_string_javascript.html
 */
st.getUrlParam = function(name){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
        return "";
    else
        return results[1];
}

/* Cookie functions */
st.createCookie = function(name,value,days){
    if(days){
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}
st.readCookie = function(name){
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
st.eraseCookie = function(name) {
    st.createCookie(name,"",-1);
}

window.onerror = function(msg, url, linenumber){
    st.trackUserEvent('JS Exception', msg, url + ' ' + linenumber);
}
st.trackUserEvent = function(cat, action, label){
    console.log('tracking: ', cat, action, label);
    _gaq.push(['_trackEvent',
        cat, //event category
        action, //event action
        label //event label
    ]);
}



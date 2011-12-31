if (!window.st) window.st = {};
var st = window.st;

(function($) {
    st.twitterList = {  

        username: "",
        numberOfTweets: 1,

        init: function() {
            var $tweetWidget = $('.widget-twitter');
            this.$tweetList = $('#tweet-list');
            this.numberOfTweets = $tweetWidget.data('number-tweets');
            this.username = $tweetWidget.data('twitter-account');
            $(".tweet-list-placeholder").html('Talking to the Twitter internets&hellip;');
            this.pullTweets();
        },

        pullTweets: function() {

            var self = this,
                url = 'http://twitter.com/statuses/user_timeline/' + this.username + '.json?callback=?',
                params = {
                    count: this.numberOfTweets
                };

            this.$tweetList.append($('<ul/>'))

            $.getJSON(url, params, function (json) {
                var tmp;
                $.each(json, function (i, tweet) {
                    tmp = self.tweetify(tweet.text);
                    self.$tweetList.find('ul').append(
                        $('<li>', { 'html': '<p>' + tmp + '</p><p class="tweet-list-time">' + getTime.relative(tweet.created_at) + ' via ' + tweet.source + '</p>' })
                    );
                });
            }).error(function() { 
                self.$tweetList.html('<p>Don&rsquo;t judge us, but something broke. <a href="http://twitter.com/intent/orchardonline">Follow us here in the meantime</a>.</p>'); 
            }).complete(function() { 
                $(".tweet-list-placeholder").fadeOut().remove(); 
            });

            this.tweetify = function (str) {
                return str.replace(/(https?:\/\/\S+)/gi, '<a href="$1">$1</a>').replace(/(^|\s)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>').replace(/(^|\s)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2">#$2</a>');
            };
        }    

    }
    
    //lifted from https://github.com/remy/twitterlib/blob/master/twitterlib.js Thanks Remy
    var getTime = function () {
      var monthDict = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        time: function (date) {
          var hour = date.getHours(),
              min = date.getMinutes() + "",
              ampm = 'AM';
      
          if (hour == 0) {
            hour = 12;
          } else if (hour == 12) {
            ampm = 'PM';
          } else if (hour > 12) {
            hour -= 12;
            ampm = 'PM';
          }
      
          if (min.length == 1) {
            min = '0' + min;
          }
      
          return hour + ':' + min + ' ' + ampm;
        },
        date: function (date) {
          var mon = monthDict[date.getMonth()],
              day = date.getDate()+'',
              dayi = ~~(day),
              year = date.getFullYear(),
              thisyear = (new Date()).getFullYear(),
              th = 'th';

          // anti-'th' - but don't do the 11th, 12th or 13th
          if ((dayi % 10) == 1 && day.substr(0, 1) != '1') {
            th = 'st';
          } else if ((dayi % 10) == 2 && day.substr(0, 1) != '1') {
            th = 'nd';
          } else if ((dayi % 10) == 3 && day.substr(0, 1) != '1') {
            th = 'rd';
          }

          if (day.substr(0, 1) == '0') {
            day = day.substr(1);
          }

          return mon + ' ' + day + th + (thisyear != year ? ', ' + year : '');
        },
        shortdate: function (time_value) {
          var values = time_value.split(" "),
              parsed_date = Date.parse(values[1] + " " + values[2] + ", " + values[5] + " " + values[3]),
              date = new Date(parsed_date),
              mon = monthDict[date.getMonth()],
              day = date.getDate()+'',
              year = date.getFullYear(),
              thisyear = (new Date()).getFullYear();

          if (thisyear === year) {
            return day + ' ' + mon;
          } else {
            return day + ' ' + mon + (year+'').substr(2, 2);
          }
        },
        datetime: function (time_value) {
          var values = time_value.split(" "),
              date = new Date(Date.parse(values[1] + " " + values[2] + ", " + values[5] + " " + values[3]));

          return this.time(date) + ' ' + this.date(date);
        },
        relative: function (time_value) {
          var values = time_value.split(" "),
              parsed_date = Date.parse(values[1] + " " + values[2] + ", " + values[5] + " " + values[3]),
              date = new Date(parsed_date),
              relative_to = (arguments.length > 1) ? arguments[1] : new Date(),
              delta = ~~((relative_to.getTime() - parsed_date) / 1000),
              r = '';

          delta = delta + (relative_to.getTimezoneOffset() * 60);

          if (delta <= 1) {
            r = '1 second ago';
          } else if (delta < 60) {
            r = delta + ' seconds ago';
          } else if (delta < 120) {
            r = '1 minute ago';
          } else if (delta < (45*60)) {
            r = (~~(delta / 60)) + ' minutes ago';
          } else if (delta < (2*90*60)) { // 2* because sometimes read 1 hours ago
            r = '1 hour ago';
          } else if (delta < (24*60*60)) {
            r = (~~(delta / 3600)) + ' hours ago';
          } else {
            r = this.shortdate(time_value);
          }

          return r;
        }    
      };
    }();    

})(jQuery);

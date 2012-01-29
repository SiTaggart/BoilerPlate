if (!window.st) window.st = {};
var st = window.st;

(function($) {
    st.twitterList = {  

        account: '',
        limit: 1,
        showMeta: false,
        showActions: false,
        refreshResults: false,
        queryType: 'user',
        searchTerm: '',

        apiURLs: {
            user: 'https://api.twitter.com/1/statuses/user_timeline.json',
            search: 'https://search.twitter.com/search.json'
        },

        init: function() {
            this.$tweetWidget = $('.widget-twitter');
            this.$tweetList = this.$tweetWidget.find('#tweet-list');

            //fill defaults
            this.account = (this.$tweetWidget.data('account')) ? this.$tweetWidget.data('account') : this.account;
            this.limit = this.$tweetWidget.data('limit');
            this.showMeta = (this.$tweetWidget.data('meta')) ? this.$tweetWidget.data('meta') : this.showMeta;
            this.showActions = (this.$tweetWidget.data('actions')) ? this.$tweetWidget.data('actions') : this.showActions;
            this.refreshResults = (this.$tweetWidget.data('refresh')) ? this.$tweetWidget.data('refresh') : this.refreshResults;
            this.queryType = (this.$tweetWidget.data('querytype')) ? this.$tweetWidget.data('querytype') : this.queryType;
            this.searchTerm = (this.$tweetWidget.data('search')) ? this.$tweetWidget.data('search') : this.searchTerm;

            this.$tweetWidget.find('.tweet-list-placeholder').html('Talking to the Twitter internets&hellip;');
            this.pullTweets();
        },

        determineURL: function() {
            var baseURL;
            if(this.queryType === 'user') baseURL = this.apiURLs.user;
            else baseURL = this.apiURLs.search;
            return baseURL;
        },

        determineParams: function() {
            var params = {};

            switch(this.queryType){
                case 'user':
                    params = {
                        screen_name: this.account,
                        count: this.limit
                    }
                break;
                case 'search':
                    params = {
                        q: this.searchTerm,
                        rpp: this.limit,
                        result_type: 'recent'
                    }
                break;
                default:                     
            }
            
            if(this.lastTweetId) params.since_id = this.lastTweetId;
            params.include_entities = 'true';
            return params;
        },

        pullTweets: function() {
            var self = this,
                url = this.determineURL(),
                params = this.determineParams();

            $.ajax({
                url: url,
                data: params,
                dataType: 'jsonp',
                type: 'GET',
                success: function(data, textStatus, jqXHR){
                    self.responseData = data;
                },
                error: function(){
                    self.handleResponse('error');
                },
                complete: function(){
                    self.handleResponse('success');
                    if(self.refreshResults) {
                        setTimeout(function(){
                            self.pullTweets();
                        }, 10000);
                    }
                }
            });

        },

        tweetify: function (str) {
            return str.replace(/(https?:\/\/\S+)/gi, '<a href="$1">$1</a>').replace(/(^|\s)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>').replace(/(^|\s)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2">#$2</a>');
        },
        
        handleResponse: function(type) {
            switch(type){
                case 'success':
                    if(!this.lastTweetId) this.$tweetList.append($('<ul/>'));

                    var tweetsData = [],
                        tmplData = {};

                    if(this.queryType === 'user') { 
                        for (var i = this.responseData.length - 1; i >= 0; i--) {
                            tmplData = {
                                text: this.responseData[i].text,
                                user: this.account,
                                id: this.responseData[i].id_str,
                                date: this.responseData[i].created_at,
                                source: this.responseData[i].source
                            };
                            tweetsData.push(tmplData);
                        };
                    }
                    else { 
                        for (var i = this.responseData.results.length - 1; i >= 0; i--) {
                            tmplData = {
                                text: this.responseData.results[i].text,
                                user: this.responseData.results[i].from_user,
                                id: this.responseData.results[i].id_str,
                                date: this.responseData.results[i].created_at,
                                source: this.responseData.results[i].source
                            };
                            tweetsData.push(tmplData);
                        };
                    }
                    this.renderTweets(tweetsData);

                    this.$tweetWidget.find('.tweet-list-placeholder').fadeOut().remove(); 
                break;
                case 'error':
                    this.$tweetList.html('<p>Don&rsquo;t judge us, but something broke.</p>'); 
                break;
                default:                    
            }            
        },

        renderTweets: function(d) {
            var self = this,
                tmp, tweet, meta, action;

            $.each(d, function (i, tweet) {
                tmp = self.tweetify(tweet.text);
                tweetText = getTweetText(tmp);
                meta = getMetaText(tweet);
                action = getActions(tweet);
                self.$tweetList.find('ul').prepend(
                    $('<li>', { 'html': tweetText + meta + action })
                );
                //set last tweet id
                self.lastTweetId = tweet.id;
            });

            function getTweetText(t){
                return '<p>' + t + '</p>';
            }
            function getMetaText(tweet){
                return (self.showMeta) ? '<span class="tweet-list-time"><a href="https://twitter.com/#!/'+ tweet.user +'/status/'+ tweet.id +'">' + getTime.relative(tweet.date) + '</a> via ' + tweet.source + '</span>' : '';
            }
            function getActions(tweet){
                return (self.showActions) ? '<span class="tweet-list-action"><a href="https://twitter.com/intent/retweet?tweet_id='+ tweet.id +'">retweet</a></span>' : '';
            }
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

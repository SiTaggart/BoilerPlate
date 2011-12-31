if (!window.st) window.st = {};
var st = window.st;

(function($) {
    st.flickrList = {
        init: function() {
            var $flickrWidget = $('.widget-flickr'),
                $flickrList = $('<ul />', { 'class': 'flickr-list'}),
                accountID = $flickrWidget.data('flickr-account'),
                pictureLimit = $flickrWidget.data('picture-limit');
            
            $flickrWidget.append($flickrList).find('p').remove();        

            $flickrList.jflickrfeed({
                limit: pictureLimit,
                qstrings: {
                    id: accountID
                },
                itemTemplate: '<li><a href="{{link}}" target="_blank"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
            }, function(data) {
                $flickrList.addClass('flickr-list-loaded');
                if($('html').hasClass('ie6') || $('html').hasClass('ie7') || $('html').hasClass('ie8')) { 
                    $flickrList.find('li:nth-child(3n)').addClass('end-of-row');
                }
            });
        }
    }
})(jQuery);
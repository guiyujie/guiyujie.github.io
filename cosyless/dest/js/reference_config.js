// prettify
prettyPrint();

$(function(){
    var $toc = $('.toc'),
        $close = $('.doc-close'),
        $body = $(document.body);

    // toc
    $toc.toc({
        'selectors':'h1,h2,h3,h4',
        'container':'body'
    });

    // close effects
    $close.click(function(){
        $body.toggleClass('off-sidebar');
    });

    // totop
    $(document).UItoTop({
        /*
         var defaults = {
         containerID: 'toTop', // fading element id
         containerHoverID: 'toTopHover', // fading element hover id
         scrollSpeed: 1200,
         easingType: 'linear'
         };
         */

        easingType: 'easeOutQuart'
    });

    // sticky
    $("#sticker").sticky({topSpacing:0});
});
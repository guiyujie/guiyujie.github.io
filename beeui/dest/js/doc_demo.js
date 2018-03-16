$(function(){
    $('.doc-toc').toc({
        'selectors': 'h2',
        'container': 'body'
    });

    $('.doc-sticker').sticky({
       topSpacing: 20
    });

    $('pre').addClass('line-numbers');
});
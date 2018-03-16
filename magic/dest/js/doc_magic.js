$(function(){
    var $example = $('.magic-example');

    $('.magic-main .magic-btn').click(function(){

        if($(this).data('moving')) return false;
        $(this).data('moving', 1);
        var self = this;

        var magic = function(className) {
            $example.removeClass('infinote rubber-band').addClass(className);

            setTimeout(function() {
                $example.removeClass(className);
                $(self).data('moving', 0)
            }, 1000)
        };


        switch (this.id) {

            // 弹性动画
            case 'bounce':
                magic('bounce');
                break;

            case 'bounceIn':
                magic('bounce-in');
                break;
            case 'bounceInDown':
                magic('bounce-in-down');
                break;
            case 'bounceInUp':
                magic('bounce-in-up');
                break;
            case 'bounceInLeft':
                magic('bounce-in-left');
                break;
            case 'bounceInRight':
                magic('bounce-in-right');
                break;

            case 'bounceOut':
                magic('bounce-out');
                break;
            case 'bounceOutDown':
                magic('bounce-out-down');
                break;
            case 'bounceOutUp':
                magic('bounce-out-up');
                break;
            case 'bounceOutLeft':
                magic('bounce-out-left');
                break;
            case 'bounceOutRight':
                magic('bounce-out-right');
                break;

            // 淡入淡出动画
            case 'fade':
                magic('fade');
                break;

            case 'fadeIn':
                magic('fade-in');
                break;
            case 'fadeInDown':
                magic('fade-in-down');
                break;
            case 'fadeInUp':
                magic('fade-in-up');
                break;
            case 'fadeInLeft':
                magic('fade-in-left');
                break;
            case 'fadeInRight':
                magic('fade-in-right');
                break;
            case 'fadeInDownBig':
                magic('fade-in-down-big');
                break;
            case 'fadeInUpBig':
                magic('fade-in-up-big');
                break;
            case 'fadeInLeftBig':
                magic('fade-in-left-big');
                break;
            case 'fadeInRightBig':
                magic('fade-in-right-big');
                break;

            case 'fadeOut':
                magic('fade-out');
                break;
            case 'fadeOutDown':
                magic('fade-out-down');
                break;
            case 'fadeOutUp':
                magic('fade-out-up');
                break;
            case 'fadeOutLeft':
                magic('fade-out-left');
                break;
            case 'fadeOutRight':
                magic('fade-out-right');
                break;
            case 'fadeOutDownBig':
                magic('fade-out-down-big');
                break;
            case 'fadeOutUpBig':
                magic('fade-out-up-big');
                break;
            case 'fadeOutLeftBig':
                magic('fade-out-left-big');
                break;
            case 'fadeOutRightBig':
                magic('fade-out-right-big');
                break;

            // 旋转动画
            case 'rotate':
                magic('rotate');
                break;
            case 'rotateIn':
                magic('rotate-in');
                break;
            case 'rotateInDownLeft':
                magic('rotate-in-down-left');
                break;
            case 'rotateInDownRight':
                magic('rotate-in-down-right');
                break;
            case 'rotateInUpLeft':
                magic('rotate-in-up-left');
                break;
            case 'rotateInUpRight':
                magic('rotate-in-up-right');
                break;

            case 'rotateOut':
                magic('rotate-out');
                break;
            case 'rotateOutDownLeft':
                magic('rotate-out-down-left');
                break;
            case 'rotateOutDownRight':
                magic('rotate-out-down-right');
                break;
            case 'rotateOutUpLeft':
                magic('rotate-out-up-left');
                break;
            case 'rotateOutUpRight':
                magic('rotate-out-up-right');
                break;

            // 滑动动画
            case 'slide':
                magic('slide');
                break;

            case 'slideInDown':
                magic('slide-in-down');
                break;
            case 'slideInUp':
                magic('slide-in-up');
                break;
            case 'slideInLeft':
                magic('slide-in-left');
                break;
            case 'slideInRight':
                magic('slide-in-right');
                break;

            case 'slideOutDown':
                magic('slide-out-down');
                break;
            case 'slideOutUp':
                magic('slide-out-up');
                break;
            case 'slideOutLeft':
                magic('slide-out-left');
                break;
            case 'slideOutRight':
                magic('slide-out-right');
                break;

            // 翻转动画
            case 'flip':
                magic('flip');
                break;

            case 'flipInX':
                magic('flip-in-x');
                break;
            case 'flipInY':
                magic('flip-in-y');
                break;

            case 'flipOutX':
                magic('flip-out-x');
                break;
            case 'flipOutY':
                magic('flip-out-y');
                break;

            // 缩放动画
            case 'scale':
                magic('scale');
                break;
            case 'scaleIn':
                magic('scale-in');
                break;
            case 'scaleInBig':
                magic('scale-in-big');
                break;

            case 'scaleOut':
                magic('scale-out');
                break;
            case 'scaleOutBig':
                magic('scale-out-big');
                break;

            // 缩放动画
            case 'speed':
                magic('speed');
                break;

            case 'speedIn':
                magic('speed-in');
                break;
            case 'speedInLight':
                magic('speed-in-light');
                break;

            case 'speedOut':
                magic('speed-out');
                break;
            case 'speedOutLight':
                magic('speed-out-light');
                break;

            // 卷动动画
            case 'roll':
                magic('roll');
                break;

            case 'rollIn':
                magic('roll-in');
                break;
            case 'rollOut':
                magic('roll-out');
                break;

            // 杂项
            case 'flash':
                magic('flash');
                break;
            case 'hinge':
                magic('hinge');
                break;
            case 'pulse':
                magic('pulse');
                break;
            case 'rubberBand':
                magic('rubber-band');
                break;
            case 'shake':
                magic('shake');
                break;
            case 'swing':
                magic('swing');
                break;
            case 'wobble':
                magic('wobble');
                break;
            case 'tada':
                magic('tada');
                break;
        }
        return false;
    });
});
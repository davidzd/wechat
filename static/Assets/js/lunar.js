var now = new Date();
// var startDate = new Date('2015/9/31 23:59');
var endDate = new Date('2015/9/30 23:59:59');
//total seconds//
var spantime = (endDate - now.getTime())/1000;

 $(document).ready(function () {
        $(this).everyTime('1s', function(i) {
             spantime --;

             var d = Math.floor(spantime / (24 * 3600));
             var h = Math.floor((spantime % (24*3600))/3600);
             var m = Math.floor((spantime % 3600)/(60));
             var s = Math.floor(spantime % 60);
 
             if(spantime > 0){
                $("#day").text(d);
                $("#hour").text(h);
                $("#min").text(m);
                $("#sec").text(s);
             }else{ // 避免倒數變成負的
                $("day").text(0);
                $("#hour").text(0);
                $("#min").text(0);
                $("#sec").text(0);
             }
         });
   });

$(document).ready(function () {
    var init=function(){
        $('.nav li a').click(function() {
            $('.nav').addClass('fix');
            var target = $(this).attr('href');
            var scrt = $(target).offset().top;
            if (target !== '#cam-1') {
                scrt -= $('ul.nav').height();
            }
            $("html,body").animate({
                scrollTop: scrt}, 'fast'
            ); 
            return false;
        });

        var critical = $('.nav').offset().top;
        // if (window.screen.availWidth > 768) {
            $(window).scroll(function() {
                if ($(window).scrollTop()>critical) {
                    $('.nav').addClass('fix');
                }else{
                    $('.nav').removeClass('fix');
                }
            });
        // };
    }
    init();
});

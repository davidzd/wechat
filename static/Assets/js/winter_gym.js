


// $(document).ready(function () {
//     var init=function(){
//         $('.nav li a').click(function() {
//             $('.nav').addClass('fix');
//             var target = $(this).attr('href');
//             var scrt = $(target).offset().top;
//             if (target !== '#cam-1') {
//                 scrt -= $('ul.nav').height();
//             }
//             $("html,body").animate({
//                 scrollTop: scrt}, 'fast'
//             ); 
//             return false;
//         });

//         var critical = $('.nav').offset().top;
//         // if (window.screen.availWidth > 768) {
//             $(window).scroll(function() {
//                 if ($(window).scrollTop()>critical) {
//                     $('.nav').addClass('fix');
//                 }else{
//                     $('.nav').removeClass('fix');
//                 }
//             });
//         // };
//     }
//     init();
// });


$(document).ready( function () {
    var init = function () {

        var contentPosition = $('.cam-intro').offset().top;
        $('.scroller-icon').click( function () {
            $('html, body').animate({
                scrollTop: contentPosition}, '1500', 'swing'
            );
        });

        var firmsPosition = $('.firms').offset().top;
        var linkToFirms = $('.cam-intro .cam .cam-content p a');
        linkToFirms.click( function () {
            $('html, body').animate({
                scrollTop: firmsPosition}, '2000', 'swing'
            );
        });

        $('.tabs').hide();
        $('#tab1').show();
        var tabPosition = $('.toggleTitle').offset().top;
        var toggleLink = $('li a');
        toggleLink.click( function (e) {
            toggleLink.removeClass('active');
            $(this).addClass('active');
            $('html, body').animate({
                scrollTop: tabPosition}, '1000', 'swing'
            );
            var target = $(this).data("toggle");
            // console.log(target);
            $('.tabs').hide();
            $('#'+target).fadeIn();
            e.preventDefault();
        });        
    }
    init();
});
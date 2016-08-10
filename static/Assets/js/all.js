//home
$("#scrollToHomePage3").click(function(e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#homePage3").offset().top
    }, 1000);
});
//feeback
/*$("input[name='impression_reason']").click(function(){
    if(typeof($("input[name='impression']:checked").val()) == 'undefined') {
        $("input[name='impression'][value='1']").prop("checked",true);
    }
});
$("input[name='late_min']").click(function(){
    $("input[name='late'][value='1']").prop("checked",true);
});
$("input[name='extra_min']").click(function(){
    $("input[name='extra_time'][value='1']").prop("checked",true);
});
$("input[name='recommend_other']").click(function(){
    $("input[name='recommend'][value='other']").prop("checked",true);
});
$("input[name='longtern']").change(function(){
    if($(this).val() == '0') {
        $("input[name='longtern_cleaner']").prop("checked",false);
        $('#longTernCleanerArea').hide();
    } else {
        $("input[name='longtern_cleaner'][value='1']").prop("checked",true);
        $('#longTernCleanerArea').show();
    }
});*/
//contact us
$(document).ready(function() {
    if(location.search == '?bc=1') {
        $('#choiceBookFaq').hide();
        $('#faqArea').hide();
        $('#choiceBeCleaner').show();
        $('#contactEmail').hide();
    } else {
        $('#choiceBookFaq').show();
        $('#choiceBeCleaner').hide();
        $('.faqAnswer').hide();
        $('#firstChoiceBook').addClass('active');
        $('#book1').show();
        $('#contactEmail').hide();
    }

    $('#howBuyBtn').live('click',function(){
        $('#choiceBookFaq').show();
        $('#faqArea').show();
        $('.faqAnswer').hide();
        $('#firstChoiceBook').addClass('active');
        $('#book1').show();
        $('#choiceBeCleaner').hide();
        $('#contactEmail').hide();
    });
    $('#beCleanerBtn').click(function(){
        $('#choiceBookFaq').hide();
        $('#faqArea').hide();
        $('#choiceBeCleaner').show();
        $('#contactEmail').hide();
    });
    $('#otherBtn').click(function(){
        $('#choiceBookFaq').hide();
        $('#faqArea').hide();
        $('#choiceBeCleaner').hide();
        $('#contactEmail').show();
    });
    $('.choiceBook').live('click',function(){
        $('.choiceBook').removeClass('active');
        $('.faqAnswer').hide();
        $('#book'+$(this).attr('value')).show();
        $(this).addClass('active');
    });
});
//blog
$('.blogContent img').hide();
$(".imgLiquidFill").imgLiquid({fill:true});
$(window).load(function(){
    $('.blogContent img').each(function(){
        $(this).hide();
        if($(this).width() > $('.blogContentArea').width()) {
            $(this).attr('style','width:'+$('.blogContentArea').width()+'px;');
        }
        $(this).show();
    });
});
//footer
 $( ".footerIcon li" ).hover(
        function() {
            var src=$(this).find('img').attr('src');
            var regex=/.png$/;  
            var hoversrc = src.replace(regex,"_hover.png"); 
            $(this).find('img').attr('src',hoversrc);
            
        }, function() {
            var src=$(this).find('img').attr('src');
            var regex=/_hover.png$/;  
            var unhoversrc = src.replace(regex,".png"); 
            $(this).find('img').attr('src',unhoversrc);
            
        }
);
function setMyprogress(i) {
    $('.myprogress .circle').removeClass().addClass('circle');
    $('.myprogress .bar').removeClass().addClass('bar');
    $('.myprogress .circle:nth-of-type(' + i + ')').addClass('active');
    for(var k = 1; k <=i; k++) {
        $('.myprogress .circle:nth-of-type(' + (k-1) + ')').removeClass('active').addClass('done'); 
        $('.myprogress .bar:nth-of-type(' + (k-1) + ')').addClass('active');
        $('.myprogress .bar:nth-of-type(' + (k-2) + ')').removeClass('active').addClass('done');
    }
    
}

$('.callLoginModal').live('click',function(){
  $('#loginModal').modal();
});
$('#noticeClose').live('click',function(){
  $( "#navbarNotice" ).slideUp( "slow", function() {});
});
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}



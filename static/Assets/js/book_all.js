$(document).ready(function() {
    //檢查是否有使用分享優惠
    $.post(GLOBALVAR.SITE_URL+'activity/invite/checkInvite',{},function(result){
        if(result.shareDiscount == 'true') {
            var toastOption;
            toastOption = {
                delay: 40000,
                align: "center",
            };
            $.simplyToast("好友邀請體驗優惠折抵1小時！", 'success',toastOption);
            $("input[name='cuponCode']").val(result.shareCode);
            checkCupon();
        }
        calculateHrFee();
    },'json'); 
    calculateHrFee();
    setMyprogress(1);
    //不清潔內容popout
    $("#notCleanPopout").click(function(e){
        e.preventDefault();
        $("#notCleanModal").modal();
    });
    //取消的服務費用
    $("#cancelPopout").click(function(e){
        e.preventDefault();
        $("#cancelModal").modal();
    });
    //提供的清潔用具popout
    $("#provideCleanerPopout").click(function(e){
        e.preventDefault();
        $("#provideCleanerModal").modal();
    });

    //選擇是否要清潔用品
    $( ".serviceContent").change(function() {
        var totalFee = $('#hour').val() * GLOBALVAR.HOUR_FEE;
        //是否提供清潔劑
        if($("#cleanersYes").prop('checked')) {
            $('#cleanersFeeArea').show();
            totalFee = totalFee+100;
        } else {
            $('#cleanersFeeArea').hide();
        }
        $('#total').text(totalFee);
        $('#fee').val(totalFee);//總價
        if($('#cupon').val() != '') {
            checkCupon();
        }
        if($('#discounted').val() == '') {
            $('.carComfirmFee').html($('#fee').val());
        } else {
            $('.carComfirmFee').html($('#discounted').val());
        }
    });
    //發票
    var showArea;
    showArea = $('.invoice:checked').val()+'Invoice';
    $('#'+showArea).show();
    $('.invoice').live('click',function(){ 
        $('.invoiceContentArea').hide();
        showArea = $(this).val()+'Invoice';
        $('#'+showArea).show();
    });

    
    $('#sameAddressCheck').live('click',function(){ 
        if($(this).attr("checked")){
            var county = $('select[name="county"]').val();
            var district = $('select[name="district"]').val();
            var address = $('input[name="address"]').val();
            $('input[name="receiptAdress"]').val(county+district+address);
        }else{
            $('input[name="receiptAdress"]').val('');
        }
    });
    //使用Cupon卷
    $('#checkCupon').live('click',function(){   
        checkCupon();
    });

    //取消cupon卷
    $('#cancelCupon').live('click',function(){
        $('#cuponMsg').hide();
        $('#subMinusFee').text('0');
        $("input[name='cuponCode']").val('');
        $('#total').text($('#fee').val());
        $('#discounted').val('');
        $('#cupon').val('');
        $("input[name='cuponCode']").prop('disabled', false);
        $('#minusPoint').val('');
        $('#cancelCupon').hide();
        $('#checkCupon').show();
        if($('#discounted').val() == '') {
            $('.carComfirmFee').html($('#fee').val());
        } else {
            $('.carComfirmFee').html($('#discounted').val());
        }
    });

        
    $("a[href='#']").live('click',function(e){
        e.preventDefault();
    });
        
    $('.lastMonth, .nextMonth').live('click',function(){
        $('#calendarYear').val($(this).attr('year'));
        $('#calendarMonth').val($(this).attr('month'));
        loadCalendar();
    });

    $(".plusButton").on('click',function(){
        var newVal = Number($(this).parent().find('input').val()) + 1;
        $(this).parent().find('input').val(newVal);
        $(this).parent().find('input').trigger("change");
        calculateHrFee();
    });
    $(".minusButton").on('click',function(){
        var newVal = Number($(this).parent().find('input').val()) - 1;
        if(newVal < 0) {
            newVal = 0;
        }
        $(this).parent().find('input').val(newVal);
        $(this).parent().find('input').trigger("change");
        calculateHrFee();
    });

    //手機版自選時間按鈕//////////////////////////////
    $(".plusButtonHour").live('touchend',function(){
        var newVal = Number($(this).parent().find('.selectedHour').val()) + 0.5;
        $('.selectedHour').val(newVal);
        $('.selectedHour').attr('value',newVal);
        var showVal;
        if(newVal>=8) {
            showVal = '2人'+Number(newVal/2);
            $('.selectedHourShow').removeClass('stepper').addClass('stepperLong');
        } else {
            showVal = Number(newVal);
            $('.selectedHourShow').removeClass('stepperLong').addClass('stepper');
        }
        $('.selectedHourShow').val(showVal);
        $('.selectedHourShow').attr('value',showVal);
        $(".selectedHour").trigger("change");
    });
    $(".minusButtonHour").live('touchend',function(){
        var newVal = Number($(this).parent().find('.selectedHour').val()) - 0.5;
        if(newVal < 3) {
            newVal = 3;
        }
        $('.selectedHour').val(newVal);
        $('.selectedHour').attr('value',newVal);
        var showVal;
        if(newVal>=8) {
            showVal = '2人'+Number(newVal/2);
            $('.selectedHourShow').removeClass('stepper').addClass('stepperLong');
        } else {
            showVal = Number(newVal);
            $('.selectedHourShow').removeClass('stepperLong').addClass('stepper');
        }
        $('.selectedHourShow').val(showVal);
        $('.selectedHourShow').attr('value',showVal);
        $(".selectedHour").trigger("change");
    });
    //手機版自選時間按鈕////////////////////////////////////

    $("input[name='appointCleaner']").live('change',function(){
        loadCalendar();
    });
    $("input[name='sex']").live('change',function(){
        loadCalendar();
    }); 

    $("select[name='district']").live('change',function(){
        checkRegion();
        repeatAddress();
    });
    $("input[name='address']").live('keyup',function() {
        repeatAddress();
    });


    $('#bookForm').submit(function(){
        if(!$('#readed').prop('checked')) {
           $('#errReaded').show();
           return false; 
        }
        $(window).unbind('beforeunload');
    });

    $("input[name$='receipt']").live('click',function(){
        if( $(this).is(':checked') ) {
            //receipt_adress hide
            $('.receiptAdress').hide();
        } else {
            //show receipt_adress
            $('.receiptAdress').show();
        }
    });

    //選完日期後選時間的作用
    $('.timeSelect').live('click',function(){
        $('.timeSelect').removeClass('btnSelectedTime');
        $('.timeSelect').addClass('btnTime');
        $(this).removeClass('btnTime');
        $(this).addClass('btnSelectedTime');
        $('#selectTime').val($(this).text());
        $('#candidate').val($(this).attr('cleaner'));
    });
});
function checkCupon() {
    $('#cuponMsg').hide();
    $.post(GLOBALVAR.SITE_URL+'cupon/checkCode', {cuponCode:$("input[name='cuponCode']").val(),hour:$('#hour').val(),fee:$('#fee').val(),selectDate:$("input[name='selectDate']").val()}, function(data) {
       var result = JSON.parse(data);
       if(result.status == 'ok') {
           $('#checkCupon').hide();
           $('#cuponMsg').html(result.msg);
           $('#cuponMsg').show();
           $('#subMinusFee').text(result.minus);
           $('#total').text(result.discounted);
           $('#discounted').val(result.discounted);
           $('#cupon').val(result.cupon);
           $("input[name='cuponCode']").prop('disabled', true);
           $('#minusPoint').val(result.minusPoint);
           $('#cancelCupon').show();
           if($('#discounted').val() == '') {
                $('.carComfirmFee').html($('#fee').val());
            } else {
                $('.carComfirmFee').html($('#discounted').val());
            }
       } else {
           $('#cuponMsg').html(result.msg);
           $('#cuponMsg').show();
       }
    });
}

// $("#checkpoints").live('click',function() {
//     $('#pointsMsg').hide();
//     $.post(GLOBALVAR.SITE_URL+'points/exchange', {pointsNum:$("input[name='pointsNum']").val(),fee:$('#fee').val()}, function(data) {
//        var result = JSON.parse(data);
//        if(result.status == 'ok') {
//            $('#checkpoints').hide();
//            $('#subMinusFee').text(result.minus);
//            $('#total').text(result.discounted);
//            $('#discounted').val(result.discounted);
//            $("input[name='pointsNum']").prop('disabled', true);
//            $('#minusPoint').val(result.minus);
//            $('#cancelpoints').show();
//        } else {
//            $('#pointsMsg').html(result.msg);
//            $('#pointsMsg').show();
//        }
//     });
// });


//指定清潔人員 以手機檢查
function getChoiceCleanerArea() {
    $.post(GLOBALVAR.SITE_URL+'book/checkReturnUser',{phone:$("input[name$='phone']").val()},function(data){
        var result = JSON.parse(data);
        if(result.status == 'OK' && result.cleaner != '0' && $('input:radio[name="num"]:checked').val() == 1) {
            var appointAreaStr = "";
            for(var key in result.cleaner){ 
                appointAreaStr += "<div class='choiceCleaner'>"+
                    "<label  class='' for='cleanerChoice"+key+"'><input type='radio' name='appointCleaner' value='"+key+"' class='css-checkbox' id='cleanerChoice"+key+"'>"+
                    "<div class='cleaner'><div class='choiceCleanerImg' style='background-image: url("+GLOBALVAR.BASE_URL+"uploads/photo/"+result.cleaner[key].photo+");'></div><p>"+result.cleaner[key].name+"</p></div></label>"+
                "</div>";
            }
            appointAreaStr += "<div class='choiceCleaner'>"+
                    "<label  class='' for='cleanerChoice0'><input type='radio' name='appointCleaner' value='"+result.filter+"' class='css-checkbox' id='cleanerChoice0'>"+
                    "<div class='cleaner'><div class='choiceCleanerImg' style='background-image: url(http://i.imgur.com/ueXBeqR.png);'></div><p>其他</p></div></label>"+
                "</div><input type='radio' name='appointCleaner' value='0' class='hide' checked>";
            $("#appointArea").html(appointAreaStr);
            $('#appointArea').show();
        } else {
            $("#appointArea").html(
                "<div class='choiceCleaner'>"+
                    "<input type='radio' name='appointCleaner' value='0' class='css-checkbox' checked>"+
                    "<label  class=''>不指定</label>"+
                "</div>");
            $('#appointArea').hide();
        }
    });
}


function loadCalendar() {
    $('.bookNextMonth').popover('hide');
    $.blockUI({css: { 
        border: 'none', 
        padding: '5px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff' 
    } });
    var pets = $('input:checkbox:checked.pets').map(function () {
        return this.value;
    }).get();
    $.post(GLOBALVAR.SITE_URL+'book/calendar',{year:$('#calendarYear').val(),month:$('#calendarMonth').val(),hour:$('#hour').val(),num:$('input:radio[name="num"]:checked').val(),region:$("input[name$='zipcode']").val(), cleaner: $("input[name='appointCleaner']:checked").val(),pets:pets,tool:$("input[name='cleaners']:checked").val(),sex:$("input[name='sex']:checked").val()},function(data){
        $('#bookCalendar').html(data);
        $('#selectDate').val('');
        $('#selectTime').val('');
        $('#avalibaleDay').html('');
        setTimeout($.unblockUI, 100);
        $('.bookNextMonth').popover('show');
    });
}


function checkRegion() {
    if($("input[name='zipcode']").val() != '') {
        $.blockUI({ css: { 
            border: 'none', 
            padding: '5px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        } });
        $.get(GLOBALVAR.SITE_URL+'book/checkRegion'+'/'+$("input[name='zipcode']").val(), function(data) {
            var dataObj = JSON.parse(data);
            if(dataObj.result == 'false') {
                $("input[name='regionAvailable']").val('false');
            } else {
                $("input[name='regionAvailable']").val('true');
            }
            setTimeout($.unblockUI, 200);
        });
    } 
}

function repeatAddress() {
    if($('#sameAddressCheck').attr("checked")){
        var county = $('select[name="county"]').val();
        var district = $('select[name="district"]').val();
        var address = $('input[name="address"]').val();
        $('input[name="receiptAdress"]').val(county+district+address);
    }
}

$(window).bind('beforeunload', function(){
  $.post(GLOBALVAR.SITE_URL+'track/bookLose', {step: $('#nowStep').val(),type:'regular'}, function(data) {
      
  });
});
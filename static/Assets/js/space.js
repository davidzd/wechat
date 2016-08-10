$(document).ready(function() { 
    $('#size').live('change',function(){
        var size = parseInt($('#size').val());
        var windowNum = parseInt(size/5);
        $('#window').val(windowNum);
    });

    $(".selectedHour").live('change',function(){
        $('.hourlyFee').text('$'+GLOBALVAR.HOUR_FEE);
        $(".selectedHour").val($(this).val());
        var selected = Number($(this).val());
        //是否提供清潔劑
        var nowFee = selected*GLOBALVAR.HOUR_FEE;
        if($("#cleanersYes").prop('checked')) {
            var totalFee = nowFee+100;
        }else{
            var totalFee =nowFee;
        }
        if(Number($('#recommandHour').text()) > selected) {
            $('#warningHour').show();
        } else {
            $('#warningHour').hide();
        }
        if(selected >= 8) {
            $('#realHour').text(selected/2);
            $('#realCleanerNum').text('2人X');
            $('input:radio[name="num"][value="2"]').prop('checked', true);
        } else {
            $('#realHour').text(selected);
            $('#realCleanerNum').text('');
            $('input:radio[name="num"][value="1"]').prop('checked', true);
        } 
        $('#total').text(totalFee);
        $('#subtotal').text(nowFee);
        //要post的data
        $('#hour').val(selected);
        $('#fee').val(totalFee);//總價
        if($('#cupon').val() != '') {
            checkCupon();
        }

        if($('#nowStep').val() == 3) {
            loadCalendar();
            // getChoiceCleanerArea();
        }
    });

    //第二步上一頁
    $('#preSndStepBtn').live('click',function(){
        $('#firstStep').show();
        $('#sndStep').hide();
        $(".bookTitle h1").text('你需要清理的內容');
        $('#nowStep').val(1);
        setMyprogress(1);
    });

    //第三步上一頁
    $('#preThirdStepBtn').live('click',function(){
        $('#sndStep').show();
        $('#thirdStep').hide();
        $(".bookTitle h1").text('你的聯絡資料');
        $('#nowStep').val(2);
        setMyprogress(2);
    });


    //第四步上一頁
    $('#preFourStepBtn').live('click',function(){
        $('#thirdStep').show();
        $('#fourStep').hide();
        $("#radio1").prop('checked',true);
        $(".bookTitle h1").text('預約清潔的時間'); 
        $('#nowStep').val(3);
        setMyprogress(3);
    });

    //第一步送出
    $('#firstStepBtn').live('click',function(){
        // if($('#isLogin').attr('value') == 'false') {
        //     $('#loginModal').modal();
        //     return;
        // }
        $('#firstStep').hide();
        $('#sndStep').show();
        $(".bookTitle h1").text('你的聯絡資料');
        $('#nowStep').val(2);
        setMyprogress(2);
        $('html, body').animate({scrollTop : 0},300);
        $('#twzipcode').twzipcode({
            readonly:true
        });
        checkRegion();
    });
    //第二步送出
    $('#sndStepBtn').live('click',function(){
        //檢查資料正確
         var email = $("#email").val();
         /* email 正規語法 */
        var filter = /^[^@^\s]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
        var phoneRe = /^09\d{8}$/;
        $('.errorMsg').hide();
        $('.errorBorder').removeClass('errorBorder');
        var validateOk = true;
        if($("input[name$='zipcode']").val()=="") {
            $("input[name$='zipcode']").addClass('errorBorder');
            $(".errorMsg[data-target='zipcode']").show();
            validateOk = false;
        }
        if ($("input[name$='address']").val()==""){
            $("input[name$='address']").addClass('errorBorder');
            $(".errorMsg[data-target='address']").show();
            validateOk = false;
        }    
        if($("input[name$='name']").val()==""){
            $("input[name$='name']").addClass('errorBorder');
            $(".errorMsg[data-target='name']").show();
            validateOk = false;
        }
        if($("input[name$='phone']").val()==""){
            $("input[name$='phone']").addClass('errorBorder');
            $(".errorMsg[data-target='phone']").show();
            validateOk = false;
        } else if(!$("input[name$='phone']").val().match(phoneRe)){
            $("input[name$='phone']").addClass('errorBorder');
            $(".errorMsg[data-target='phoneFormat']").show();
            validateOk = false;
        }
        if($("input[name$='email']").val()=="" || !filter.test(email) ){
            $("input[name$='email']").addClass('errorBorder');
            $(".errorMsg[data-target='email']").show();
            validateOk = false;
        }

        //檢查發票資訊
        if($("input[name='invoice']:checked").val() == 'barcode') {
            if($("input[name='carrierType']:checked").val() == 'phone') {
                if($("input[name='phoneBarcode']").val() == '') {
                    $("input[name$='phoneBarcode']").addClass('errorBorder');
                    $(".errorMsg[data-target='phoneBarcode']").show();
                    validateOk = false;
                } else if(!checkPhoneBar()) {
                    $("input[name$='phoneBarcode']").addClass('errorBorder');
                    $(".errorMsg[data-target='phoneBarcodeError']").show();
                    validateOk = false;
                } else if($("input[name='phoneBarcode']").val() != $("input[name='phoneBarcodeAgain']").val()) {
                    $("input[name$='phoneBarcodeAgain']").addClass('errorBorder');
                    $(".errorMsg[data-target='phoneBarcodeNotEqual']").show();
                    validateOk = false;
                }
            } else if($("input[name='carrierType']:checked").val() == 'IDcard') {
                if($("input[name='IDcardBarcode']").val() == '') {
                    $("input[name$='IDcardBarcode']").addClass('errorBorder');
                    $(".errorMsg[data-target='IDcardBarcode']").show();
                    validateOk = false;
                } else if(!checkIDcardBar()) {
                    $("input[name$='IDcardBarcode']").addClass('errorBorder');
                    $(".errorMsg[data-target='IDcardBarcodeError']").show();
                    validateOk = false;
                } else if($("input[name='IDcardBarcode']").val() != $("input[name='IDcardBarcodeAgain']").val()) {
                    $("input[name$='IDcardBarcodeAgain']").addClass('errorBorder');
                    $(".errorMsg[data-target='IDcardBarcodeNotEqual']").show();
                    validateOk = false;
                }
            }    
        }
        if($("input[name='invoice']:checked").val() == 'paper') {
            var reg = /^\d+$/;
            if($("input[name='uniCode']").val() == '' || !reg.test($("input[name='uniCode']").val())) {
                $("input[name$='uniCode']").addClass('errorBorder');
                $(".errorMsg[data-target='uniCode']").show();
                validateOk = false;
            }

            if($("input[name='receiptTitle']").val() == '') {
                $("input[name$='receiptTitle']").addClass('errorBorder');
                $(".errorMsg[data-target='receiptTitle']").show();
                validateOk = false;
            }

            if($("input[name='receiptAdress']").val() == '') {
                $("input[name$='receiptAdress']").addClass('errorBorder');
                $(".errorMsg[data-target='receiptAdress']").show();
                validateOk = false;
            }
            
        }

        if(validateOk == false) {
            return false;
        }
        //把使用者資料存起來
        $.post(GLOBALVAR.SITE_URL+'auth/updateUserInfo',{email:$("input[name$='email']").val(),name:$("input[name$='name']").val(),zipcode:$("input[name$='zipcode']").val(),address:$("input[name$='address']").val(),phone:$("input[name$='phone']").val()},function(data){
            
        });

        $.post(GLOBALVAR.SITE_URL+'home/detectBlackList',{email:$("input[name$='email']").val(),name:$("input[name$='name']").val(),zipcode:$("input[name$='zipcode']").val(),address:$("input[name$='address']").val(),phone:$("input[name$='phone']").val()},function(data){
            if(data.black == 'true') {
                $("input[name$='black']").val('true');
            } else {
                $("input[name$='black']").val('false');
            }

            if($("input[name$='regionAvailable']").val()=="false" || $("input[name$='black']").val()=="true") {
                BootstrapDialog.alert({
                    title: '很抱歉您所在的地址目前沒有時段可以預約！',
                    message: '很抱歉您所在的地址經查詢，目前已經沒有時段可以預約！',
                    buttonLabel: '確認!', // <-- Default value is 'OK',
                });
                return false;
            }

            $('#sndStep').hide();
            //日曆即時間選擇的初始化
            $('#selectDate').val('');
            $('#selectTime').val('');
            $('#avalibaleDay').html('');
            $('#errChoiceTime').hide();
            
            
            $('.bookNextMonth').popover('hide');
            loadCalendar();
            $('.choiceDay').live('click',function(){
                $('.choiceDay').removeClass('selectedDate');
                $(this).addClass('selectedDate');
                $('#selectTime').val('');
                $('#selectDate').val($(this).attr('date'));
                newYearSelectDate($(this).attr('date'));
                if($('#selectDate').val() === 'undefined' || $('#selectDate').val() == '') {
                    $('#avalibaleDay').html('請選擇一個預約的日期');
                } else {
                    $.blockUI({ css: { 
                        border: 'none', 
                        padding: '5px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '10px', 
                        '-moz-border-radius': '10px', 
                        opacity: .5, 
                        color: '#fff' 
                    } });
                    $.post(GLOBALVAR.SITE_URL+'home/getAvalibaleTime', {date:$('#selectDate').val(), hour:$('#hour').val(), region:$("input[name$='zipcode']").val(), cleaner: 0, num: $('input:radio[name="num"]:checked').val(),address:$("select[name='county']").val()+$("select[name='district']").val()+$("input[name='address']").val(),tool:$("input[name='cleaners']:checked").val(),sex:$("input[name='sex']:checked").val()}, function(data) {
                        var dataObj = JSON.parse(data);
                        var str = '';

                        for (var oneTime in dataObj) { 
                            str += "<a class='btn btn-default timeSelect' href='#' cleaner='"+dataObj[oneTime].join()+"'>"+oneTime+"</a> ";
                        }
                        if(str == '') {
                            str = '抱歉今日的時段都已預約完畢！';
                        }
                        $('#avalibaleDay').html(str);
                        setTimeout($.unblockUI, 600);
                    });
                }
                
            });
            ///////
            $('#thirdStep').show();
            $(".bookTitle h1").text('預約清潔的時間');
            $('#nowStep').val(3);
            setMyprogress(3);
            $('html, body').animate({scrollTop : 0},300);
        },'json');
    });

    //第三步送出
    $('#thirdStepBtn').live('click',function(){
        $('html, body').animate({scrollTop : 0},300);
        //看有無選時間
        if($('#selectDate').val() == '') {
            BootstrapDialog.alert({
                title: '請選擇欲清潔的日期',
                message: '請點選日曆上的日期選擇適合清潔的時間',
                buttonLabel: '確認!', // <-- Default value is 'OK',
            });
            return false;
        }
        if($('#selectTime').val() == '') {
            BootstrapDialog.alert({
                title: '請選擇欲清潔的時間',
                message: '請點選日曆下方時間選擇您適合的清潔時間',
                buttonLabel: '確認!', // <-- Default value is 'OK',
            });
            return false;
        }
        var date = new Date($('#selectDate').val());
        var dateArray = $('#selectDate').val().split("-");
        console.log(dateArray);
        var tomorrow = new Date(GLOBALVAR.TOMORROW);
        if(date.valueOf() < tomorrow.valueOf()) {
            $('.delayPay').hide();
        } else {
            $('.delayPay').show();
        }
        //抓確認資訊  
        $('#confirmCounty').html($("select[name$='county']").val());
        $('#confirmDistrict').html($("select[name$='district']").val());
        $('#confirmAddress').html($('#address').val());
        $('#confirmName').html($('#name').val());
        $('#confirmPhone').html($('#phone').val());
        $('#confirmEmail').html($('#email').val());
        $('#confirmSelectDate').html(dateArray[0] +' 年 ' + dateArray[1]+' 月 '+ dateArray[2]+' 日');
        $('#confirmSelectTime').html($('#selectTime').val());
        $('#confirmHour').html($('#hour').val());
        if($('#discounted').val() == '') {
            $('#confirmFee').html($('#fee').val());
        } else {
            $('#confirmFee').html($('#discounted').val());
        }
        
        //
        $('#thirdStep').hide();
        $('#fourStep').show();
        $(".bookTitle h1").text('確認訂單');
        $('#nowStep').val(4);
        setMyprogress(4);
    });
    
});

function calculateHrFee() {
    var baseHr = 3;
    var size = parseInt($('#size').val());
    var totalHr = size/2;
    var defaultWindow = parseInt(size/5);
    var nowWindow = parseInt($('#window').val());
    totalHr = totalHr - (defaultWindow - nowWindow) *0.5;
    if(totalHr < baseHr) {
        totalHr = baseHr;
    }
    $('#totalHour').text(totalHr);
    if(totalHr >= 8) {
        $('input:radio[name="num"][value="2"]').prop('checked', true);
    } else {
        $('input:radio[name="num"][value="1"]').prop('checked', true);
    }
    var nowFee = totalHr*GLOBALVAR.HOUR_FEE ;
    var totalFee = totalHr*GLOBALVAR.HOUR_FEE ;
    
    //是否提供清潔劑
    if($("#cleanersYes").prop('checked')) {
        $('#cleanersFeeArea').show();
        totalFee = totalFee+100;
    } else {
        $('#cleanersFeeArea').hide();
    }
    var option = '';
    for(var i=3;i<=totalHr+4;i=i+0.5){
        if( i == totalHr ) {
           option += "<option value='"+i+"' selected>"+i+"小時</option>"; 
        } else {
           option += "<option value='"+i+"'>"+i+"小時</option>";
        }
    }
    var choiceSelect = "<select name='choiceHour' class='form-control selectedHour'>"+option+"</select>";
    $('#warningHour').hide();
    if(totalHr >= 8) {
        $('#realHour').text(totalHr/2);
        $('#realCleanerNum').text('2人X');
       
    } else {
        $('#realHour').text(totalHr);
        $('#realCleanerNum').text('');
    } 
    $('#recommandHour').text(totalHr); 
    $('.choiceHour').html(choiceSelect);
    $('#subtotal').text(nowFee);
    $('#total').text(totalFee);
    
    //要post的data
    $('#hour').val(totalHr);
    $('#fee').val(totalFee);//總價
    if($('#cupon').val() != '') {
        checkCupon();
    }
    
    $('#confirmWindows').html($('#window').attr('value'));
    $('#confirmSize').html($('#size').attr('value'));
}
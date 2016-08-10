$.blockUI({css: { 
        border: 'none', 
        padding: '5px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff' 
    } });
    $.post(GLOBALVAR.SITE_URL+'user/checkOrderChanged',{orderid: $("input[name='hashid']").val()},function(data){
        if(data.status == 'false') {
            window.location.href = GLOBALVAR.SITE_URL+'user/order';
        }
    },'json');
    $("input[name='appointCleaner']").live('change',function(){
        loadCalendar();
    });
    loadCalendar();
    function loadCalendar() {
        $.post(GLOBALVAR.SITE_URL+'book/calendar',{hour:$('#hour').val(),num:$('#num').val(),region:$("#zipcode").val(), cleaner: $("input[name='appointCleaner']:checked").val(),pets: $('#pets').val(),tool:$('#tool').val()},function(data){
            $('#bookCalendar').html(data);
            $('#selectDate').val('');
            $('#selectTime').val('');
            $('#avalibaleDay').html('');
            setTimeout($.unblockUI, 100);
            $('.bookNextMonth').popover('show');
        });
    }
    
    
    $('.choiceDay').live('click',function(){
        $('.choiceDay').removeClass('selectedDate');
        $(this).addClass('selectedDate');
        $('#selectTime').val('');
        $('#selectDate').val($(this).attr('date'));
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
            $.post(GLOBALVAR.SITE_URL+'home/getAvalibaleTime', {date:$('#selectDate').val(), hour:$('#hour').val(), region:$("#zipcode").val(), cleaner: $("input[name='appointCleaner']:checked").val(),num: $('#num').val(),pets:$('#pets').val(),tool:$('#tool').val()}, function(data) {
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
    $('.timeSelect').live('click',function(){
        $('.timeSelect').removeClass('btn-info');
        $('.timeSelect').addClass('btn-default');
        $(this).removeClass('btn-default');
        $(this).addClass('btn-info');
        $('#selectTime').val($(this).text());
        $('#candidate').val($(this).attr('cleaner'));
    });
    $('.lastMonth, .nextMonth').live('click',function(){
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
        $.post(GLOBALVAR.SITE_URL+'book/calendar',{year:$(this).attr('year'),month:$(this).attr('month'),hour:$('#hour').val(),num:$('#num').val(),region:$("#zipcode").val(), cleaner: 0,pets:$('#pets').val(),tool:$('#tool').val()},function(data){
            $('#bookCalendar').html(data);
            $('#selectDate').val('');
            $('#selectTime').val('');
            $('#avalibaleDay').html('');
            setTimeout($.unblockUI, 100);
            $('.bookNextMonth').popover('show');
        });
    });
    $('#confirmChange').live('click',function(){
        //看有無選時間
        if($('#selectDate').val() == '') {
            $.simplyToast("請選擇欲清潔的日期", 'danger');
            return false;
        }
        if($('#selectTime').val() == '') {
            $.simplyToast("請選擇欲清潔的時間", 'danger');
            return false;
        }
        $('#changeForm').submit();
    });
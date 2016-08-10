$('#registerShow').click(function(){
    if($('#registerArea').hasClass('active')){
        $('#registerArea').hide();
        $('#registerArea').removeClass('active'); 
    }else{
        $('#registerArea').show();
        $('#registerArea').addClass('active'); 
    }
});

$(document).ready(function() {
     
var optionRegister = {
    beforeSerialize: function() {
        $('#errRegister').hide();
    },
    complete: function(data) {
        var result = JSON.parse(data.responseText);
        if (result.status == "ERR") {
            $('#errRegister').html(result.error)
            $('#errRegister').show();
        } else if(result.status == "OK") {
            $('#loginModal').modal('hide');
            afterLogin(result);
        }
    },
};        
$("#emailRegister").ajaxForm(optionRegister);
    var optionUpdate = {
        beforeSerialize: function() {
            $('#errLogin').hide();
        },
        complete: function(data) {
            var result = JSON.parse(data.responseText);
            if (result.status != "OK") {
                $.simplyToast(result.error, 'danger');
            } else {
                BootstrapDialog.alert({
                    title: '密碼更新成功',
                    message: '密碼更新成功，請重新用新密碼登入',
                    buttonLabel: '確認!', // <-- Default value is 'OK',
                    callback: function() {
                        window.location.href = GLOBALVAR.SITE_URL+'auth/logout';
                    }
                });
            }
        },
    };        
    $("#updatePassword").ajaxForm(optionUpdate);

    var optionUserInfo = {
        beforeSerialize: function() {
            $('#errLogin').hide();
        },
        complete: function(data) {
            var result = JSON.parse(data.responseText);
            if (result.status != "OK") {
                $.simplyToast("資料更新失敗請重新再試", 'danger');
            } else {
                BootstrapDialog.alert({
                    title: '資料更新成功',
                    message: '您的基本資料已經成功更新囉！',
                    buttonLabel: '確認!', // <-- Default value is 'OK',
                });
            }
        },
    };        
    $("#updateUser").ajaxForm(optionUserInfo);
});

//成功登入後要做的事
function afterLogin(data) {
    if($('#ref').attr('value') != '') {
        window.location.href = $('#ref').attr('value');
    } else {
        window.location.href = GLOBALVAR.SITE_URL;
    } 
}
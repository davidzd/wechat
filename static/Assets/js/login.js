//成功登入後要做的事
function afterLogin(data) {
    $('#isLogin').attr('value','true');
    if($("#zipcode").attr('data-value') == '') {
        $("#zipcode").attr('data-value',data.zipcode);
    }
    if($("#address").attr('value') == '') {
        $("#address").attr('value',data.address);
    }
    if($("#name").attr('value') == '') {
        $("#name").attr('value',data.name);
    }
    if($("#phone").attr('value') == '') {
        $("#phone").attr('value',data.phone);
    }
    if($("#email").attr('value') == '') {
        $("#email").attr('value',data.email);
    }
    if(data.type != 'local') {
        $('#navbarChangePassword').hide();
    } else {
        $('#navbarChangePassword').show();
    }
    $('.navbarLogin').hide();
    $('.navbarUser').show();
    window.location.href = GLOBALVAR.SITE_URL;
    
}
$(document).ready(function() {
    
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
    
    
    
    $('#loginModal').on('shown.bs.modal', function (e) {

        //google plus signin
        (function() {
           var po = document.createElement('script');
           po.type = 'text/javascript'; po.async = true;
           po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
           var s = document.getElementsByTagName('script')[0];
           s.parentNode.insertBefore(po, s);
         })();
        var optionLogin = {
            beforeSerialize: function() {
                $('#errLogin').hide();
            },
            complete: function(data) {
                var result = JSON.parse(data.responseText);
                if (result.status == "ERR") {
                    $('#errLogin').html(result.error)
                    $('#errLogin').show();
                } else if(result.status == "OK") {
                    $('#loginModal').modal('hide');
                    afterLogin(result);
                }
            },
        };        
        $("#emailLogin").ajaxForm(optionLogin);
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
    });
    $('#registerShow').click(function(){
        if($('#registerArea').hasClass('active')){
            $('#registerArea').hide();
            $('#registerArea').removeClass('active'); 
        }else{
            $('#registerArea').show();
            $('#registerArea').addClass('active'); 
        }
    });
    
});
$('.navbarLogin').live('click',function(){
    $('#loginModal').modal();
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
			  window.location.href = GLOBALVAR.SITE_URL + 'verification/fillin_phone_checkcode';
          }
      },
  };        
  $("#phoneRegister").ajaxForm(optionRegister);
  
  var optionWebRegister = {
	  beforeSerialize: function() {
                $('#errRegister').hide();
            },
            complete: function(data) {
                var result = JSON.parse(data.responseText);
                if (result.status == "ERR") {
                    $('#errRegister').html(result.error)
                    $('#errRegister').show();
                } else if(result.status == "OK") {
                    window.location.href = GLOBALVAR.SITE_URL + 'verification/fillin_phone_checkcode';
                }
            },
        };        
        $("#phoneWebRegister").ajaxForm(optionWebRegister);
	
  
    
});

function newYearSelectDate(date) {
	var newYearStart = new Date(NEW_YEAR_START);
	var newYearEnd = new Date(NEW_YEAR_END);
	var selectedDate = new Date(date);
	if(newYearStart.valueOf() <= selectedDate.valueOf() && selectedDate.valueOf() <= newYearEnd.valueOf()) {
		changeNewYearFee(NEW_YEAR_FEE);
		$('.newYearFeeInfo').show();
	} else {
		changeNewYearFee(GLOBALVAR.HOUR_FEE);
		$('.newYearFeeInfo').hide();
	}
}

function changeNewYearFee(fee) {
	$('.hourlyFee').text('$'+fee);
	var hour = $('#hour').val();
	var newTotalFee = hour * fee;
	var newSubFee = hour * fee;
	//是否提供清潔劑
    if($("#cleanersYes").prop('checked')) {
        newTotalFee = newTotalFee+100;
    } 
	$('#total').text(newTotalFee);
	$('#subtotal').text(newSubFee);
	//手機版的價格
	$('.carComfirmFee').text(newTotalFee);
	//要post的data
    $('#fee').val(newTotalFee);//總價
    if($('#cupon').val() != '') {
        checkCupon();
    }
}
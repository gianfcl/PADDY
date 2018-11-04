$(document).ready(function(){
	$(function () {
		$('#datetimepicker3').datetimepicker({
			format:'DD-MM-YYYY hh:mm a',
			useCurrent: false,
			sideBySide: true,
			locale: moment.locale("es")
		});
	});
	
	$(function () {
		$('#datetimepicker4').datetimepicker({
			format:'DD-MM-YYYY hh:mm a',
			useCurrent: false,
			sideBySide: true,
			locale: moment.locale("es")
		});
	});
	
	$("#datetimepicker3").on("dp.change", function (e) {
		$('#datetimepicker4').data("DateTimePicker").maxDate(e.date.add(1,'day'));
		//$('#datetimepicker4').data("DateTimePicker").date(e.date);
		$('#datetimepicker4').data("DateTimePicker").minDate(e.date.subtract(1,'day'));
	});
	
	$("#datetimepicker4").on("dp.change", function (e) {
		$('#datetimepicker3').data("DateTimePicker").maxDate(e.date);
		$('#datetimepicker3').data("DateTimePicker").minDate(e.date.subtract(1,'day'));
		//$('#datetimepicker3').data("DateTimePicker").date(e.date);
	});
	
});

$(document).on('click','.buscar_t2',function(){
	var fecha_i = $('#t_3').val();
	var fecha_f = $('#t_4').val();
	var param = "";
	if(fecha_i.trim())
	{
		 param = param + "&fecha_i="+fecha_i;
	}
	
	if(fecha_i.trim())
	{
		 param = param + "&fecha_i="+fecha_i;
	}
	
	if(fecha_f.trim())
	{
		 param = param + "&fecha_f="+fecha_f;
	}
	
	$.ajax({
		url: $('base').attr('href')+'reportexhora/filtro_t2',
    type:'POST',
    data:param,
    dataType:'json',
    success: function(response){
      if(response.code == 1)
      {
        $('#table_2').html(response.data);
      }
			else
			{
				$('#table_2').html('<h1 style="opacity: 0.5;"><center>No Hay Datos</center></h1>');
			}
    }
	});
});

$(document).on('click','.limpiarfiltro2',function(){
	$('#t_3').val('');
	$('#t_4').val('');
	$('#datetimepicker4').data("DateTimePicker").minDate(false);
	$('#datetimepicker4').data("DateTimePicker").maxDate(false);
	$('#datetimepicker3').data("DateTimePicker").minDate(false);
	$('#datetimepicker3').data("DateTimePicker").maxDate(false);
	
	$.ajax({
		url: $('base').attr('href')+'reportexhora/filtro_t2',
    type:'POST',
    dataType:'json',
    success: function(response){
      if(response.code == 1)
      {
        $('#table_2').html(response.data);
      }
			else
			{
				$('#table_2').html('<h1 style="opacity: 0.5;"><center>No Hay Datos</center></h1>');
			}
    }
	});
});

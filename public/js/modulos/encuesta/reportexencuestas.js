$(document).ready(function(){
	
	$(function () {
		$('#datetimepicker1').datetimepicker({
			locale: moment.locale('es'),
			useCurrent: false,
			format: 'DD-MM-YYYY hh a',
			sideBySide: true
		});
	});
	
	$(function () {
		$('#datetimepicker2').datetimepicker({
			locale: moment.locale('es'),
			useCurrent: false,
			format: 'DD-MM-YYYY hh a',
			sideBySide: true
		});
	});
	
	$("#datetimepicker1").on("dp.change", function (e) {
		$('#datetimepicker2').data("DateTimePicker").minDate(e.date);
	});
	
	$("#datetimepicker2").on("dp.change", function (e) {
		$('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
	});
	
});

$(document).on('click','.buscar_t1',function(){
	var fecha_i = $('#t_1').val();
	var fecha_f = $('#t_2').val();
	var param = "";
	if(fecha_i.trim())
	{
		 param = param + "&fecha_i="+fecha_i;
	}
	
	if(fecha_f.trim())
	{
		 param = param + "&fecha_f="+fecha_f;
	}
	
	$.ajax({
		url: $('base').attr('href')+'reportexencuestas/filtro_t1',
    type:'POST',
    data:param,
    dataType:'json',
    success: function(response){
      if(response.code == 1)
      {
        $('#table_1').html(response.data.rta);
				$('#script_1').html(response.data.rta2);
				$('#script_2').html(response.data.rta3);
      }
			else
			{
				$('#table_1').html('<h1 style="opacity: 0.5;"><center>No Hay Datos</center></h1>');
				$('#script_1').html('');
				$('#script_2').html('');
				$('#graf_1').html('');
				$('#graf_2').html('');
			}
    }
	});
});

$(document).on('click','.limpiarfiltro1',function(){
	$('#t_1').val('');
	$('#t_2').val('');
	
	$.ajax({
		url: $('base').attr('href')+'reportexencuestas/filtro_t1',
    type:'POST',
    dataType:'json',
    success: function(response){
      if(response.code == 1)
      {
        $('#table_1').html(response.data.rta);
				$('#script_1').html(response.data.rta2);
				$('#script_2').html(response.data.rta3);
      }
			else
			{
				$('#table_1').html('<h1 style="opacity: 0.5;"><center>No Hay Datos</center></h1>');
				$('#script_1').html('');
				$('#script_2').html('');
				$('#graf_1').html('');
				$('#graf_2').html('');
			}
    }
	});
});


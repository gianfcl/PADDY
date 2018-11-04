$( document ).ready(function() {

	$('#filtro').modal('show');

  	$('#datetimepicker1').datetimepicker({
    	format: 'MM-YYYY',
    	locale: moment.locale("es")
  	});

  	$('#datetimepicker2').datetimepicker({
    	format: 'MM-YYYY',
    	locale: moment.locale("es"),
    	useCurrent: false
  	});
});

$("#datetimepicker1").on("dp.change", function (e) {
	$('#datetimepicker2').data("DateTimePicker").minDate(e.date);
});

$("#datetimepicker2").on("dp.change", function (e) {
    $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
});

$(function () {
  $("#personal").autocomplete({

    type:'POST',
    serviceUrl: $('base').attr('href')+"personal/get_personalxnomcompleto",
    dataType : 'JSON',
    onSelect: function (suggestion)
    {
      $('#id_personal').val(suggestion.id_personal);
    }
  });
});

$(document).on('click','.btn_limpiar',function () {
	$('#filtro').modal('hide');
}); 

$(document).on('click','.buscar',function(){
	var id_personal = $('#id_personal').val();
	var fecha_ini = $('#fecha_inicio').val();
	var fecha_fin = $('#fecha_fin').val();

	if(id_personal)
	{
		var param = 'id_personal='+id_personal;
		if(fecha_ini.trim().length)
		{
			param += '&fecha_ini='+'01-'+fecha_ini;
		}
		if(fecha_fin.trim().length)
		{
			if(fecha_ini==fecha_fin)
			{
				param += '&fecha_fin='+'31-'+fecha_fin;
			}
			else
			{
				param += '&fecha_fin='+'01-'+fecha_fin;
			}
		}

		$.ajax({
            url: $('base').attr('href') + 'sueldovsadelanto/buscar_reporte',
            type: 'POST',
            data: param,
            dataType: "json",
            beforeSend: function() {

            },
            success: function(response) {
                if (response.code==1) {
                	$('#content_').html(response.data);
                	$('#filtro').modal('hide');
                	var nombre = $('#personal').val();
                	$('#lt').text(" - "+nombre);
 				}
            },
            complete: function() {

            }
        });
	}
	else
	{
		swal('Debe seleccionar','un personal!.','error');
	}
}); 
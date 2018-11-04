$( document ).ready(function() {
	$('#filtro').modal('show');
});


$(document).on('click','.sem',function(){
	$('div.sem_cont a').removeClass('label-danger');
	$('div.sem_cont a').addClass('label-success');
	$(this).removeClass('label-success').addClass('label-danger');
});

$(document).on('click','.buscar',function (){
	var num_sem = ($('.sem_cont a.label-danger').length) ? $('.sem_cont a.label-danger').attr('id_semana') : null;
	if(num_sem)
	{
		var id_sucursal = $('#id_sucursal').val();
		if(id_sucursal)
		{
			var id_areaposicion = $('#id_areaposicion').val();
			if(id_areaposicion)
			{
				$('#filtro').modal('hide');
				var param = "semana="+num_sem+"&id_sucursal="+id_sucursal+"&id_areaposicion="+id_areaposicion;
				var tabs_selectd = $('#myTab li.active').attr('tabs');
				var target_url = (tabs_selectd=="tab-xposi") ? "get_costohorashombrereales" : "get_costohorashombrerealesxdia";
				var target_content = (tabs_selectd=="tab-xposi") ? "content_" : "content_2";
				$('#'+target_content).attr({
					"nsemana" : num_sem,
					"sucu" : id_sucursal,
					"areapos" : id_areaposicion
				});
				var txt_sede = $('#id_sucursal option:selected').text();
				var areapos = $('#id_areaposicion option:selected').text();
				var txt = txt_sede + "  -  " + areapos;
				$('#lt').html(txt);
				$.ajax({
	                url: $('base').attr('href') + 'costohorashombrereales/'+target_url,
	                type: 'POST',
	                data: param,
	                dataType: "json",
	                beforeSend: function() {
	                    $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
	                },
	                success: function(response) {
	                    if (response.code==1) {
	                      	$('#'+target_content).html(response.data);
	                    }
	                },
	                complete: function() {
	                  	$.LoadingOverlay("hide");
	                }
	            });
			}
			else
			{
				alerta('¡Error!','¡Debe seleccionar al menos un Area Posición!','error');
			}
		}
		else
		{
			alerta('¡Error!','¡Debe seleccionar al menos una sucursal!','error');
		}
	}
	else
	{
		alerta('¡Error!','¡Debe seleccionar al menos una semana!','error');
	}
});

$(document).on('change','#id_sucursal',function(){
	var id_sucu = $(this).val();
	$('#id_areaposicion').html('');
	if(id_sucu)
	{
		$.ajax({
            url: $('base').attr('href') + 'areaposicion/cbx_areaposicion',
            type: 'POST',
            async: false,
            data: 'id_sucursal='+id_sucu,
            dataType: "json",
            beforeSend: function() {
                $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
                if (response.code==1) {
                  	$('#id_areaposicion').html(response.data);
                }
            },
            complete: function() {
              	$.LoadingOverlay("hide");
            }
        });
	}
});

$(document).on('click','.btn_limpiar',function(){
	$('#filtro').modal('hide');
});

$(document).on('click','.open_filtro',function(){
	var tabs_selectd = $('#myTab li.active').attr('tabs');
	var target_content = (tabs_selectd=="tab-xposi") ? "content_" : "content_2";

	var sucu = $('#'+target_content).attr('sucu');
	var nsemana = $('#'+target_content).attr('nsemana');
	var areapos = $('#'+target_content).attr('areapos');

	if(sucu && nsemana && areapos)
	{
		$('#id_sucursal').val(sucu);
		$('#id_sucursal').trigger('change');
		$('#id_areaposicion').val(areapos);
		$('a[id_semana='+nsemana+']').trigger('click');
	}
});
var current_week = $('.sem_cont').attr('current_week');
$( document ).ready(function() {
	$('#filtro').modal('show');
});


$(document).on('click','.sem',function(){
	$('#ver_planeacion').prop('checked',false);
	$('div.sem_cont a').removeClass('label-danger');
	$('div.sem_cont a').addClass('label-success');
	$(this).removeClass('label-success').addClass('label-danger');
	var id_semana = $(this).attr('id_semana');
	if(id_semana==current_week)	{
		$('.container_check').removeClass('hidden');
	}
	else{
		$('.container_check').addClass('hidden');
	}

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
				var id_posicion = $('#id_posicion').val();
				var ver_plan = ($('#ver_planeacion').is(':checked')) ? (1) : (0);
				var param = "semana="+num_sem+"&id_sucursal="+id_sucursal+"&id_areaposicion="+id_areaposicion+'&id_posicion='+id_posicion+'&get_planed='+ver_plan;
				
				$('#content_').attr({
					"nsemana" : num_sem,
					"sucu" : id_sucursal,
					"areapos" : id_areaposicion,
					"idpos" : id_posicion,
					"get_planed" : ver_plan
				});
				var txt_sede = $('#id_sucursal option:selected').text();
				var areapos = $('#id_areaposicion option:selected').text();
				var txt = txt_sede + "  -  " + areapos;
				$('#lt').html(txt);
				$.ajax({
	                url: $('base').attr('href') + 'evocostohorashombrereales/get_evocostohorashombrereales',
	                type: 'POST',
	                data: param,
	                dataType: "json",
	                beforeSend: function() {
	                    $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
	                },
	                success: function(response) {
	                    if (response.code>=1) {
	                      	$('#content_').html(response.data.table);
	                      	$('#content_graph').html('');
	                      	if(response.code==2)
	                      	{
	                      		var $data_graph = response.data.graph;
	                      		var data_graph = [];

	                      		$.each(response.data.graph, function(i, item) {
								    data_graph.push(item);
								})
	                      		
		                      	var $semana = response.data.semana;
		                      	var labels_ = [];
		                      	for (var i = 1; i <= $semana; i++) {
		                      		labels_.push("Semana "+i);

		                      	}
		                      	console.log(data_graph);
		                      	var txt = "Horas Hombre: "+areapos;
		                      	var config = {
									type: 'line',
									data: {
										labels: labels_,
										datasets : [{
			                      			label: txt,
			                      			backgroundColor: "#0000FF",
											borderColor: "#0000FF",
			                      			data: data_graph,
			                      			fill: false,
			                      		}]
									},
									options: {
										responsive: true,
										title: {
											display: true,
											text: 'Evolucion de Horas Reales'
										},
										tooltips: {
											mode: 'index',
											intersect: false,
										},
										hover: {
											mode: 'nearest',
											intersect: true
										},
										scales: {
											xAxes: [{
												display: true,
												scaleLabel: {
													display: true,
													labelString: 'Semanas'
												}
											}],
											yAxes: [{
												display: true,
												scaleLabel: {
													display: true,
													labelString: 'Promedio de Horas'
												}
											}]
										}
									}
								};
		                      	

		                      	console.log(config);
		                      	var ctx = document.getElementById('content_graph').getContext('2d');
								console.log(ctx);
								window.myLine = new Chart(ctx, config);
								console.log(config.data);

	                      	}
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

	var sucu = $('#content_').attr('sucu');
	var nsemana = $('#content_').attr('nsemana');
	var areapos = $('#content_').attr('areapos');
	var idpos = $('#content_').attr('idpos');
	var get_planed = $('#content_').attr('get_planed');
	console.log(sucu);
	console.log(areapos);
	console.log(idpos);
	if(sucu && nsemana && idpos)
	{
		$('#id_sucursal').val(sucu);
		$('#id_sucursal').trigger('change');
		$('#id_areaposicion').val(areapos);
		$('#id_areaposicion').trigger('change');
		$('#id_posicion').val(idpos);
		var chkd = (get_planed==1) ? true : false;
		console.log(chkd);
		$('a[id_semana='+nsemana+']').trigger('click');
		$('#ver_planeacion').prop('checked',chkd);
	}
});

$(document).on('change','#id_areaposicion',function(){
	var id_areaposicion = $(this).val();
	$('#id_posicion').html('');
	if(id_areaposicion)
	{
		$.ajax({
            url: $('base').attr('href') + 'posicion/combox_posicion',
            type: 'POST',
            async: false,
            data: 'id_areaposicion='+id_areaposicion,
            dataType: "json",
            beforeSend: function() {
                $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
                if (response.code==1) {
                  	$('#id_posicion').html(response.data);
                }
            },
            complete: function() {
              	$.LoadingOverlay("hide");
            }
        });
	}
});
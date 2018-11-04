$( document ).ready(function() {
  $('#bandeja_articulos').modal('show');
  buscar_articulos(0);
});

$(document).on('click','.buscar_articulos',function(){
	buscar_articulos(0);
});

function buscar_articulos(page)
{	
	var param = "page="+page;
	var grupo_busc = $('#grupo_busc').val();
	var familia_busc = $('#familia_busc').val();
	var subfamilia_busc = $('#subfamilia_busc').val();
	var codigo_busc = $('#cod_busc').val();
	var descripcion_busc = $('#des_busc').val();
	if(parseInt(grupo_busc)>0)
	{
		param = param + "&grupo_busc="+grupo_busc;
	}
	if(parseInt(familia_busc)>0)
	{
		param = param + "&familia_busc="+familia_busc;
	}
	if(parseInt(subfamilia_busc)>0)
	{
		param = param + "&subfamilia_busc="+subfamilia_busc;
	}
	if(codigo_busc.trim().length>0)
	{
		param = param + "&codigo_busc="+codigo_busc;
	}
	console.log(descripcion_busc.trim().length);
	if(descripcion_busc.trim().length>0)
	{	
		param = param + "&descripcion_busc="+descripcion_busc;
	}

	$.ajax({
		url: $('base').attr('href') + 'recetas/buscar_articulos',
      	type: 'POST',
      	data: param,
      	dataType: "json",
      	beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      	}	,
      	success: function(response) {
          	if (response.code==1) {
            
            	$("#arti_body").html(response.data.table);
            	$("#paginacion_data").html(response.data.paginacion);
          	}
      	},
      	complete: function() {
          	$.LoadingOverlay("hide");
      	}
	});
}

$(document).on('change','#grupo_busc',function(){
  var id = $(this).val();
  $("#familia_busc").html('');
  $("#subfamilia_busc").html('');
  if(id>0)
  {
    
    $.ajax({
      url: $('base').attr('href') + 'familia/cbx_familia',
      type: 'POST',
      data: 'id_grupo='+id,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            
            $("#familia_busc").html(response.data);
          }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});

$(document).on('change','#familia_busc',function(){
  var id = $(this).val();
  $("#subfamilia_busc").html('');
  if(id>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_familia='+id,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $("#subfamilia_busc").html(response.data);
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});

$(document).on('click','.limpiarfiltro_art',function(){
	$('#filtro_art input[type="text"]').val('');
	$('#grupo_busc').val('');
	$('#familia_busc').html('');
	$('#subfamilia_busc').html('');
	buscar_articulos(0);
});

$(document).on('click', '#bandeja_articulos #datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_articulos(page);
});

$(document).on('click', '#bandeja_articulos #datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_articulos(page);
});

$(document).on('click','.gen_reporte',function(){
	var id_art_sucu= $(this).parents('tr').attr('idartsucursal');

	$.ajax({
      url: $('base').attr('href') + 'recetas/generar_reporte',
      type: 'POST',
      data: 'id_art_sucu='+id_art_sucu,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('.x_content').html(response.data.form);
          $('#arti_desc').html(response.data.desc);
          $('#bandeja_articulos').modal('hide');
        }
        else
        {
        	alerta('Error!', 'Hubo un error interno!!', 'error');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
});
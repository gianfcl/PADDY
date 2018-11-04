$( document ).ready(function() {

  $('#datetimepicker1').datetimepicker({
		locale: moment.locale('es'),
		useCurrent: false,
		format: 'DD-MM-YYYY hh:mm a',
		sideBySide: true
	});

	$('#datetimepicker2').datetimepicker({
    locale: moment.locale('es'),
    useCurrent: false,
    format: 'DD-MM-YYYY hh:mm a',
    sideBySide: true
  });

  $('#filtro_modal').modal('show');
});

$('#filtrop').on('show.bs.modal', function (e) {
	limpiar_modal();
  $('#filtro_modal').modal('hide');
  fix_paddingr_modal('filtrop');
})

$('#filtrop').on('hidden.bs.modal', function (e) {
  $('#filtro_modal').modal('show');
  fix_paddingr_modal('filtrop');
})
$("#datetimepicker1").on("dp.change", function (e) {
  $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
});
$("#datetimepicker2").on("dp.change", function (e) {
  $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
});

$(document).on('click','.buscar',function(){
	var f_ini = $('#t_1').val();
	var f_fin = $('#t_2').val();
  var id_arti = $('#art_id').val();

	var param = 'page=0&fecha_inicio='+f_ini+'&fecha_fin='+f_fin+'&id_arti='+id_arti;
  if(id_arti.trim()>0)
  {
  	$.ajax({
      url: $('base').attr('href')+'evolucionxprecio/buscar_evolucionxprecio',
      type:'POST',
      data:param,
      dataType:'json',
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        $('#filtrop').modal('hide');
      },
      success: function(response)
      {
        if(response.code == 1)
        {
          $('#bodyindex').html(response.data.rta);
          $('#paginacion_data').html(response.data.paginacion);
          $('#contaiter-shart').append(response.data.chart);
          $('#small1').text(" - "+response.data.articulo);
          $('#cod').val(id_arti);
          $('#fecha_ini').val(f_ini);
          $('#fecha_fin').val(f_fin);
        }
        else
        {
          alerta(':-(','No se encontrados datos','info');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide"); 
        setTimeout(function(){
          $('#filtro_modal').modal('hide');
        }, 100);
        fix_paddingr_modal('filtro_modal');
      }
    });
  }
  else
  {
    alerta('Debe Seleccionar','un artículo en el filtro','info');
  } 
});

$(document).on('click','.4m',function(){
  $('#datetimepicker1').data("DateTimePicker").date(moment().subtract(4,'month'));
  $('#datetimepicker2').data("DateTimePicker").date(moment());
  $('.buscar').trigger('click');
});

$(document).on('click','.6m',function(){
  $('#datetimepicker1').data("DateTimePicker").date(moment().subtract(6,'month'));
  $('#datetimepicker2').data("DateTimePicker").date(moment());
  $('.buscar').trigger('click');
});

function limpiar_modal()
{
	$('#filtrop #t_1').val('');
	$('#filtrop #t_2').val('');
	$('#datetimepicker2').data("DateTimePicker").minDate(false);
	$('#datetimepicker1').data("DateTimePicker").maxDate(false);
}

$(document).on('click','.limpiarfiltro',function(){
  $('#filtrop').modal('hide');
});

$(document).on('click', '#paginacion1 #datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_evolucionxprecio(page);
});

$(document).on('click', '#paginacion1 #datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_evolucionxprecio(page);
});

function buscar_evolucionxprecio(page)
{
	var f_ini = $('#fecha_ini').val();
	var f_fin = $('#fecha_fin').val();
  var id_arti = $('#cod').val();
  var param = 'page='+page+'&fecha_inicio='+f_ini+'&fecha_fin='+f_fin+'&id_arti='+id_arti;
  if(id_arti.trim()>0)
  {
    $.ajax({
      url: $('base').attr('href')+'evolucionxprecio/buscar_evolucionxprecio',
      type:'POST',
      data:param,
      dataType:'json',
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        $('#filtrop').modal('hide');
      },
      success: function(response)
      {
        $('canvas').html('');
        if(response.code == 1)
        {
          $('#bodyindex').html(response.data.rta);
          $('#paginacion_data').html(response.data.paginacion);
          $('#contaiter-shart').append(response.data.chart);
          $('#small1').text(response.data.articulo);
        }
        else
        {
          alerta(':-(','No se encontrados datos','info');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide"); 
        $('#filtro_modal').modal('hide');
        fix_paddingr_modal('filtro_modal');
      }
    });
  }
	else
  {
    alerta('Debe Seleccionar','un artículo en el filtro','info');
  }
}


function fix_paddingr_modal(id_modal)
{
  $('#'+id_modal).on('hidden.bs.modal', function (e) {
  $('body.nav-md').css('padding-right','0px');
  })

  $('#'+id_modal).on('shown.bs.modal', function (e) {
    $('body.nav-md').css('padding-right','0px');
  })
}

$(document).on('click','.open_modal',function(){
  
});

$(document).on('click','.modal_arti',function(){
  get_articulos(0);
});

function get_articulos(page)
{
  var codigo_busc = $('#cod_busc').val();
  var descripcion_busc = $('#des_busc').val();
  var grupo_busc = $('#grupo_busc').val();
  var familia_busc = $('#familia_busc').val();
  var subfamilia_busc = $('#subfamilia_busc').val();

  var param = "page="+page+"&para_compras=true";

  if(codigo_busc.trim().length)
  {
    param=param+'&codigo_busc='+codigo_busc; console.log(codigo_busc);
  }
  if(descripcion_busc.trim().length)
  {
    param=param+'&descripcion_busc='+descripcion_busc; console.log(descripcion_busc);
  }
  if(parseInt(grupo_busc)>0)
  {
    param=param+'&grupo_busc='+grupo_busc;
  }
  if(parseInt(familia_busc)>0)
  {
    param=param+'&familia_busc='+familia_busc;
  }
  if(parseInt(subfamilia_busc)>0)
  {
    param=param+'&subfamilia_busc='+subfamilia_busc;
  }
  
  $.ajax({
    url: $('base').attr('href')+'comprasxarticulo/buscar_articulos',
    type:'POST',
    data:param,
    dataType:'json',
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      $('#filtrop').modal('hide');
    },
    success: function(response)
    {
      if(response.code == 1)
      {
        $('#modal_arti #arti_body').html(response.data.table);
        $('#modal_arti #paginacion_data').html(response.data.paginacion);
      }
      else
      {
        alerta(':-(','No se encontrados datos','info');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide"); 
    }
  });
}

$(document).on('click','.buscar_art',function(){
  get_articulos(0);
});

$(document).on('click','.limpiarfiltro_art',function(){
  $('#grupo_busc').val('');
  $('#familia_busc').html('');
  $('#subfamilia_busc').html('');
  $('#filtro_art input[type="text"]').val('');
  get_articulos(0);
});

$(document).on('click', '#modal_arti #datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  get_articulos(page);
});

$(document).on('click', '#modal_arti #datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  get_articulos(page);
});

function limpiar_modal_art()
{
  $('#filtro_art input[type="text"]').val('');
  $('#modal_arti #paginacion_data').html('');
  $('#modal_arti #arti_body').html('');
}

$(document).on('click','.add_arti',function(){
  var cod = $(this).parents('tr').attr('idartsucursal');
  limpiar_modal_art();
  $('#modal_arti').modal('hide');
  fix_paddingr_modal('modal_arti');
  $('#art_id').val(cod.padStart(6,'0'));
});

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
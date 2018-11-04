$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

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
})

$('#filtrop').on('hidden.bs.modal', function (e) {
  $('#filtro_modal').modal('show');
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

	var param = 'page=0&fecha_inicio='+f_ini+'&fecha_fin='+f_fin;
	$.ajax({
    url: $('base').attr('href')+'resumenxcompra/buscar_resumenxcompra',
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
      }
      else
      {
        alerta(':-(','No se encontrados datos','info');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide"); 
      $('#filtro_modal').modal('hide');
      fix_paddingr_modal('filtrop');
      fix_paddingr_modal('filtro_modal');
    }
  });
});

$(document).on('click','.1d',function(){
  $('#datetimepicker1').data("DateTimePicker").date(moment().subtract(1,'day'));
  $('#datetimepicker2').data("DateTimePicker").date(moment());
  $('.buscar').trigger('click');
});

$(document).on('click','.2d',function(){
  $('#datetimepicker1').data("DateTimePicker").date(moment().subtract(2,'day'));
  $('#datetimepicker2').data("DateTimePicker").date(moment());
  $('.buscar').trigger('click');
});

$(document).on('click','.3d',function(){
  $('#datetimepicker1').data("DateTimePicker").date(moment().subtract(3,'day'));
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

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_resumenxcompra(page);
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_resumenxcompra(page);
});

function buscar_resumenxcompra(page)
{
	var f_ini = $('#t_1').val();
	var f_fin = $('#t_2').val();

	var param = 'page='+page+'&fecha_inicio='+f_ini+'&fecha_fin='+f_fin;
	$.ajax({
    url: $('base').attr('href')+'resumenxcompra/buscar_resumenxcompra',
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
      fix_paddingr_modal('filtrop');
    }
  });
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
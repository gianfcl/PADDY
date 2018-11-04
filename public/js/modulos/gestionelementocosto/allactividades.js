$( document ).ready(function() {

  $('#fecha_inicio').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#fecha_fin').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });
  
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = "filtro";
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('select').val('');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_actividades(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_actividades(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_actividades(page);
});

function buscar_actividades(page)
{
  var fecha_inicio = $('#fecha_inicio').val();
  var fecha_fin = $('#fecha_fin').val();
  var idoperario = $('#id_operario').val();
  var orden_prod = $('#orden_prod').val();
  var idactividad = $('#id_actividad').val();
  var idactividadestados = $('#id_actividadestados').val();
  var paraproducir = $('#para_producir').val();

  var temp = "page="+page;
  if(fecha_inicio.trim().length)
  {
    temp=temp+'&fecha_inicio='+fecha_inicio;
  }

  if(fecha_fin.trim().length)
  {
    temp=temp+'&fecha_fin='+fecha_fin;
  }

  if(idoperario.trim().length)
  {
    temp=temp+'&id_personal='+idoperario;
  }

  if(idactividad.trim().length)
  {
    temp=temp+'&id_actividad='+idactividad;
  }

  if(orden_prod.trim().length)
  {
    temp=temp+'&orden_prod='+orden_prod;
  }

  if(idactividadestados.trim().length)
  {
    temp=temp+'&id_actividadestados='+idactividadestados;
  }

  if(paraproducir.trim().length)
  {
    temp=temp+'&para_producir='+paraproducir;
  }

  $.ajax({
    url: $('base').attr('href') + 'misactividades/buscar_misactividades',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
        if (response.code==1) {
          $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
          $('#paginacion_data').html(response.data.paginacion);
        }
    },
    complete: function() {
        //hideLoader();
    }
  });
}
$( document ).ready(function() {
  $('#fecha_nac_aniv').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });
});

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscarcliente(page);

});
$(document).on('click', '#paginacion_data a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscarcliente(page);
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscarcliente(0);
});

$(document).on('click', '#datatable-buttons .buscarcliente', function (e) {
  var page = 0;  
  buscarcliente(page);
});

function buscarcliente(page)
{
  var nombres_com = $('#nombres_com').val(); 
  var razon_soc = $('#razon_soc').val();
  var ruc_dni = $('#ruc_dni').val();
  var fecha_nac_aniv = $('#fecha_nac_aniv').val();
  var temp = "page="+page;
  if(nombres_com.trim().length)
  {
    temp=temp+'&nombres_com='+nombres_com;
  }

  if(razon_soc.trim().length)
  {
    temp=temp+'&razon_soc='+razon_soc;
  }

  if(ruc_dni.trim().length)
  {
    temp=temp+'&ruc_dni='+ruc_dni;
  }

  if(fecha_nac_aniv.trim().length)
  {
    temp=temp+'&fecha_nac_aniv='+fecha_nac_aniv;
  }
  $.ajax({
      url: $('base').attr('href') + 'clientes/buscar_cliente',
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
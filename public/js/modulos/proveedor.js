$(document).on('click', '.deltete_client', function (e)
{
  e.preventDefault();
  var nomb = "Proveedor";
  var idproveedor = $(this).parents('tr').attr('idproveedor');
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este "+nomb+'!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'proveedor/deltete_proveedor',
        type: 'POST',
        data: 'id_proveedor='+idproveedor+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              window.location.href = $('base').attr('href') +'proveedor';
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
        }
      });
    }
  });

});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');  
  buscarcliente(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
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
  
  $.ajax({
      url: $('base').attr('href') + 'proveedor/buscar_proveedor',
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
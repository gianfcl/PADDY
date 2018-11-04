$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_servicios', function (e)
{
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  $('#editservicios').modal('hide');
  limpiarform();
});


$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_servicioss(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_servicioss(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_servicioss(page);
});

function buscar_servicioss(page)
{
  var elmcosto = $('#elmcosto').val();
  var elemgrupo = $('#elemgrupo').val();
  var elemfamilia = $('#elemfamilia').val();
  var elmcodigo = $('#elmcodigo').val(); 
  var temp = "page="+page;
  
  if(elmcodigo.trim().length)
  {
    temp=temp+'&elmcodigo='+elmcodigo;
  }

  if(elmcosto.trim().length)
  {
    temp=temp+'&elmcosto='+elmcosto;
  }

  if(elemgrupo.trim().length)
  {
    temp=temp+'&elemgrupo='+elemgrupo;
  }

  if(elemfamilia.trim().length)
  {
    temp=temp+'&elemfamilia='+elemfamilia;
  }  
  
  $.ajax({
    url: $('base').attr('href') + 'serviciosxsucursal/buscar_servicios',
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

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idservicios = parseInt($(this).parents('tr').attr('idservicios'));
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "servicio";
  if(idservicios>0)
  {
    swal({
      title: 'Estas Seguro?',
      text: "De Eliminar este "+nomb,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
      if (isConfirm) {     
        $.ajax({
          url: $('base').attr('href') + 'serviciosxsucursal/edit_column',
          type: 'POST',
          data: 'id_serv_sucursal='+idservicios+'&estado=0',
          dataType: "json",
          beforeSend: function() {

          },
          success: function(response) {
            if (response.code==1) {              
              buscar_servicioss(page);
              var text = "Elimino!";
              alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
            }
          },
          complete: function() {
            
          }
        });
      }
    });
  }
       
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_servicioss(0);
});

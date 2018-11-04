$(document).on('click', '.addformulario', function (e) {
  var padre = $(this);
  var estado = '&estado=1';
  var id_motivo_empresa = padre.parents('tr').attr('id_motivo_empresa');  
  var temp = 'id_motivo_empresa='+id_motivo_empresa+estado;
  addsucu(temp,'Activado!');
});


$(document).on('click', '.delete', function (e) {  
  e.preventDefault();
  var padre = $(this);
  var estado = '&estado=0';
  var id_motivo_empresa = padre.parents('tr').attr('id_motivo_empresa');  
  swal({
    title: 'Estas Seguro?',
    text: "De Desactivar este Motivo!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí­, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {      
      var temp = 'id_motivo_empresa='+id_motivo_empresa+estado;
      addsucu(temp,'Desactivado!');
    }
  });
});

function addsucu(temp, text)
{
  $.ajax({
    url: $('base').attr('href') + 'Motivotraslado/activarMotivo',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        var page = 0;
        if($('#paginacion_data ul.pagination li.active a').length>0)
        {
          page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
        }
        buscar_motivo(page);
        alerta(text, 'Este Motivo a sido '+text+'.', 'success');
      }
    },
    complete: function() {
        //hideLoader();
    }
  });
}


function buscar_motivo(page)
{
     var temp = "page="+page;
    $.ajax({
      url: $('base').attr('href') + 'Motivotraslado/buscar_motivo',
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
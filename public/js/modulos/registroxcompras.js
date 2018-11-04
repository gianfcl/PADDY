$( document ).ready(function() {

  $(function () {
    $('#datetimepicker1').datetimepicker({
      format: 'MM-YYYY',
      locale: moment.locale('es')
    });
  });

});
$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_tipodocumentos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tipodocumentos(page);
});

$(document).on('click', '.buscar', function () {
  var page = 0;
  buscar_registroxcompras(page);
});

function buscar_registroxcompras(page)
{
  var data = 'page='+page;
  var periodo =$('#txt_periodo').val();
  if(periodo)
  {
    data = data + '&periodo='+periodo;
  }

  $.ajax({
        url: $('base').attr('href') + 'registroxcompras/buscar_registros',
        type: 'POST',
        data: data,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});  
        },
        success: function(response) {
          if (response.code==1) 
          {                      
            $('#bodyindex').html(response.data);          
          }
          else
          {
            alerta('Error','Hubo un error al intentar obtener los datos','error');
          }
        },
        complete: function() {
          
          $.LoadingOverlay("hide");
        }
      });
}
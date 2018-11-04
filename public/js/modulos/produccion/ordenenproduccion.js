$( document ).ready(function() {
  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return true;
  }, "Ingrese est Formato dd-mm-yyyy");
  
  $('#form_save_produccion').validate({
    rules: 
    {
      id_documento: { required:true},
      id_operario: {required:true},
      fecha_ingreso:{formespn:true} 
    },
    messages: 
    {
      id_documento: { required:"" },
      id_operario: { required:"Operador" }
    },
    highlight: function(element) {
        $(element).closest('.form-group').addClass('has-error');       
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      if(element.parent('.col-md-6').length) { error.insertAfter(element.parent()); }
      else {}
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'ordenenproduccion/save_docu',
        type: 'POST',
        data: $('#form_save_produccion').serialize(),
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {
            var page = 0;
            if($('#paginacion_data ul.pagination li.active a').length>0)
            {
              page = parseInt($('#paginacion_data ul.pagination li.active a').attr('tabindex'));
            }
            
            $('#editproduccion').modal('hide');

            buscar_documentos(page);
          }
          else
          {
            limp_todo('form_save_produccion');
          }
        },
        complete: function() {
        }
      });      
    }
  });
  $('#fechadocu').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#fecha').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#fechaingr').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_produccion');
  $('#editproduccion').modal('hide');
});

$(document).on('hidden.bs.modal', '#editproduccion', function (e)
{
  limp_todo('form_save_produccion');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var padre = $(this).find('a');
  var page = padre.attr('tabindex');
  buscar_documentos(page,padre);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var padre = $(this);
  var page = padre.attr('tabindex');
  buscar_documentos(page,padre);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_documentos(page);
});

function buscar_documentos(page,tis="")
{
  var codigo_busc = $('#codigo_busc').val();
  var fechadocu_busc = $('#fechadocu_busc').val();
  var fecha_busc = $('#fecha_busc').val();
  var descripcion_busc = $('#descripcion_busc').val();

  var temp = "page="+page+'&id_tipomovimiento='+$('#id_tipomovimiento').val();

  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }

  if(fechadocu_busc.trim().length)
  {
    temp=temp+'&fecha_busc='+fechadocu_busc;
  }

  if(fecha_busc.trim().length)
  {
    temp=temp+'&fecha_busc='+fecha_busc;
  }

  if(descripcion_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descripcion_busc;
  }
  if(tis.length)
  {
    var btn = tis.button('loading');
  }
  $.ajax({
    url: $('base').attr('href') + 'ordenenproduccion/buscar_documentos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
               
      }
    },
    complete: function() {
      if(tis.length)
      {
        btn.button('reset');
      }     
    }
  });
}

$(document).on('click', '.edit', function (e) {
  var id = parseInt($(this).parents('tr').attr('iddocumento'));
  if(id>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'ordenenproduccion/edit_docu',
        type: 'POST',
        data: 'id_documento='+id,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              $('#id_documento').val(response.data.id_documento);
              $('#fecha_ingreso').val(response.data.fecha_ingreso);
              $('#id_operario').val(response.data.id_operario);
              $('#codi').html(response.data.codigo);
            }
        },
        complete: function() {
            //hideLoader();
        }
    });
  }
});
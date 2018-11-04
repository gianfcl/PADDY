$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_tipohorario').validate({
        rules:
        {
          tipohorario:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'tipohorario/validar_cc',
              type: "post",
              data: {
                tipohorario: function() { return $( "#tipohorario" ).val(); },
                id_tipohorario: function() { return $('#id_tipohorario').val(); }
              }
            }
          },
          id_tipo:{required:true}      
        },
        messages: 
        {
          tipohorario:
          {
            required:"Tipo de Horario",
            minlength: "Más de 2 Letras",
            remote: 'Ya Existe'
          },
          id_tipo:{required:"Seleccionar"}
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
            if(element.parent('.col-md-6').length) 
            {
              error.insertAfter(element.parent()); 
            }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'tipohorario/save_tipohorario',
                type: 'POST',
                data: $('#form_save_tipohorario').serialize(),
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

                      $('#edittipohorario').modal('hide');

                      buscar_tipohorarios(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_tipohorario = parseInt($('#id_tipohorario').val());
                  id_tipohorario = (id_tipohorario>0) ? (id_tipohorario) : ("0");
                  var text = (id_tipohorario=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Tipo Horario se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_tipohorario', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#edittipohorario').modal('hide');
});

function limpiarform()
{
  $('#id_tipohorario').val('0');
  $('#tipohorario').val('');
  $('#id_tipo').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#tipohorario').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#tipohorario').parents('.form-group').removeClass('has-error');
  }

  if($('#id_tipo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_tipo').parents('.form-group').removeClass('has-error');
  }

  if($('#tipohorario-error').length>0)
  {
    $('#tipohorario-error').html('');
  }

  if($('#id_tipo-error').length>0)
  {
    $('#id_tipo-error').html('');
  }

  $('#es_expiracion').prop('checked', false);
  var validatore = $( "#form_save_tipohorario" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_tipohorarios(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tipohorarios(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_tipohorarios(page);
});

function buscar_tipohorarios(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'tipohorario/buscar_tipohorarios',
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

$(document).on('click', '.edit', function (e) {
  var idtipohorario = $(this).parents('tr').attr('idtipohorario');
  $.ajax({
      url: $('base').attr('href') + 'tipohorario/edit',
      type: 'POST',
      data: 'id_tipohorario='+idtipohorario,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_tipohorario').val(response.data.id_tipohorario);
            $('#tipohorario').val(response.data.tipohorario);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#tipohorario').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#tipohorario').parents('.col-md-8').removeClass('has-error');
            }

            if($('#tipohorario-error').length>0)
            {
              $('#tipohorario-error').html('');
            }

            var es = parseInt(response.data.es_expiracion);
            var es_va = (es==2) ? (true) : (false);
            $('#es_expiracion').prop('checked', es_va);

            var id_tipo = parseInt(response.data.id_tipo);
            $('#id_tipo').val(id_tipo);
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idtipohorario = $(this).parents('tr').attr('idtipohorario');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "tipohorario";
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
        url: $('base').attr('href') + 'tipohorario/save_tipohorario',
        type: 'POST',
        data: 'id_tipohorario='+idtipohorario+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_tipohorarios(temp);
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpiarform();
        }
      });
    }
  });   
});
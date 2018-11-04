$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_tiposistemapensionario').validate({
        rules:
        {
          tiposistemapensionario:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'tiposistemapensionario/validar_cc',
              type: "post",
              data: {
                tiposistemapensionario: function() { return $( "#tiposistemapensionario" ).val(); },
                id_tiposistemapensionario: function() { return $('#id_tiposistemapensionario').val(); }
              }
            }
          }       
        },
        messages: 
        {
          tiposistemapensionario:
          {
            required:"Sistema Pensionario",
            minlength: "Más de 2 Letras",
            remote: 'Ya Existe'
          }
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
                url: $('base').attr('href') + 'tiposistemapensionario/save_tiposistemapensionario',
                type: 'POST',
                data: $('#form_save_tiposistemapensionario').serialize(),
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

                      $('#edittiposistemapensionario').modal('hide');

                      buscar_tiposistemapensionarios(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_tiposistemapensionario = parseInt($('#id_tiposistemapensionario').val());
                  id_tiposistemapensionario = (id_tiposistemapensionario>0) ? (id_tiposistemapensionario) : ("0");
                  var text = (id_tiposistemapensionario=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Refrigerio se '+text+'.', 'success');
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

$(document).on('click', '.add_tiposistemapensionario', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#edittiposistemapensionario').modal('hide');
});

function limpiarform()
{
  $('#id_tiposistemapensionario').val('0');
  $('#tiposistemapensionario').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#tiposistemapensionario').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#tiposistemapensionario').parents('.form-group').removeClass('has-error');
  }

  if($('#tiposistemapensionario-error').length>0)
  {
    $('#tiposistemapensionario-error').html('');
  }
  var validatore = $( "#form_save_tiposistemapensionario" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_tiposistemapensionarios(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tiposistemapensionarios(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_tiposistemapensionarios(page);
});

function buscar_tiposistemapensionarios(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'tiposistemapensionario/buscar_tiposistemapensionarios',
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
  var idtiposistemapensionario = $(this).parents('tr').attr('idtiposistemapensionario');
  $.ajax({
      url: $('base').attr('href') + 'tiposistemapensionario/edit',
      type: 'POST',
      data: 'id_tiposistemapensionario='+idtiposistemapensionario,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_tiposistemapensionario').val(response.data.id_tiposistemapensionario);
            $('#tiposistemapensionario').val(response.data.tiposistemapensionario);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#tiposistemapensionario').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#tiposistemapensionario').parents('.col-md-8').removeClass('has-error');
            }

            if($('#tiposistemapensionario-error').length>0)
            {
              $('#tiposistemapensionario-error').html('');
            }
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idtiposistemapensionario = $(this).parents('tr').attr('idtiposistemapensionario');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "tiposistemapensionario";
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
        url: $('base').attr('href') + 'tiposistemapensionario/save_tiposistemapensionario',
        type: 'POST',
        data: 'id_tiposistemapensionario='+idtiposistemapensionario+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_tiposistemapensionarios(temp);
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
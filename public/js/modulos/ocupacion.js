$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_ocupacion').validate({
        rules:
        {
          ocupacion:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'ocupacion/validar',
              type: "post",
              data: {
                ocupacion: function() { return $( "#ocupacion" ).val(); },
                id_ocupacion: function() { return $('#id_ocupacion').val(); }
              }
            }
          }       
        },
        messages: 
        {
          ocupacion:
          {
            required:"Ingresar Ocupación",
            minlength: "Más de 2 Letras",
            remote: "Ya Existe"
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
                url: $('base').attr('href') + 'ocupacion/save_ocupacion',
                type: 'POST',
                data: $('#form_save_ocupacion').serialize(),
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

                      $('#editocupacion').modal('hide');

                      buscar_ocupacions(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_ocupacion = parseInt($('#id_ocupacion').val());
                  id_ocupacion = (id_ocupacion>0) ? (id_ocupacion) : ("0");
                  var text = (id_ocupacion=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Ocupación se '+text+'.', 'success');
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

$(document).on('click', '.add_ocupacion', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editocupacion').modal('hide');
});

function limpiarform()
{
  $('#id_ocupacion').val('0');
  $('#ocupacion').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#ocupacion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#ocupacion').parents('.form-group').removeClass('has-error');
  }

  if($('#ocupacion-error').length>0)
  {
    $('#ocupacion-error').html('');
  }
  var validatore = $( "#form_save_ocupacion" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_ocupacions(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_ocupacions(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_ocupacions(page);
});

function buscar_ocupacions(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'ocupacion/buscar_ocupacions',
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
  var idocupacion = $(this).parents('tr').attr('idocupacion');
  $.ajax({
      url: $('base').attr('href') + 'ocupacion/edit',
      type: 'POST',
      data: 'id_ocupacion='+idocupacion,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_ocupacion').val(response.data.id_ocupacion);
            $('#ocupacion').val(response.data.ocupacion);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#ocupacion').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#ocupacion').parents('.col-md-8').removeClass('has-error');
            }

            if($('#ocupacion-error').length>0)
            {
              $('#ocupacion-error').html('');
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
  var idocupacion = $(this).parents('tr').attr('idocupacion');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "ocupacion";
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
        url: $('base').attr('href') + 'ocupacion/save_ocupacion',
        type: 'POST',
        data: 'id_ocupacion='+idocupacion+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_ocupacions(temp);
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
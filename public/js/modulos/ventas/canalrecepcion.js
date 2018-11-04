$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_canalrecepcion').validate({
        rules:
        {
          canalrecepcion:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'canalrecepcion/validar',
              type: "post",
              data: {
                canalrecepcion: function() { return $( "#canalrecepcion" ).val(); },
                id_canalrecepcion: function() { return $('#id_canalrecepcion').val(); }
              }
            }
          }       
        },
        messages: 
        {
          canalrecepcion:
          {
            required:"Ingresar nombre del piso",
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
                url: $('base').attr('href') + 'canalrecepcion/save_canalrecepcion',
                type: 'POST',
                data: $('#form_save_canalrecepcion').serialize(),
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

                      $('#editcanalrecepcion').modal('hide');

                      buscar_canalrecepcions(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_canalrecepcion = parseInt($('#id_canalrecepcion').val());
                  id_canalrecepcion = (id_canalrecepcion>0) ? (id_canalrecepcion) : ("0");
                  var text = (id_canalrecepcion=="0") ? ("Guardo!.") : (" Edito!.");
                  alerta(text, 'Se '+text, 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_canalrecepcions(0);
});

$(document).on('click', '.add_canalrecepcion', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editcanalrecepcion').modal('hide');
});

function limpiarform()
{
  $('#id_canalrecepcion').val('0');
  $('#canalrecepcion').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#canalrecepcion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#canalrecepcion').parents('.form-group').removeClass('has-error');
  }

  if($('#canalrecepcion-error').length>0)
  {
    $('#canalrecepcion-error').html('');
  }
  var validatore = $( "#form_save_canalrecepcion" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_canalrecepcions(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_canalrecepcions(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_canalrecepcions(page);
});

function buscar_canalrecepcions(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'canalrecepcion/buscar_canalrecepcions',
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
  var idcanalrecepcion = $(this).parents('tr').attr('idcanalrecepcion');
  $.ajax({
      url: $('base').attr('href') + 'canalrecepcion/edit',
      type: 'POST',
      data: 'id_canalrecepcion='+idcanalrecepcion,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_canalrecepcion').val(response.data.id_canalrecepcion);
            $('#canalrecepcion').val(response.data.canalrecepcion);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#canalrecepcion').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#canalrecepcion').parents('.col-md-8').removeClass('has-error');
            }

            if($('#canalrecepcion-error').length>0)
            {
              $('#canalrecepcion-error').html('');
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
  var idcanalrecepcion = $(this).parents('tr').attr('idcanalrecepcion');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "canalrecepcion";
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
        url: $('base').attr('href') + 'canalrecepcion/save_canalrecepcion',
        type: 'POST',
        data: 'id_canalrecepcion='+idcanalrecepcion+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_canalrecepcions(temp);
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
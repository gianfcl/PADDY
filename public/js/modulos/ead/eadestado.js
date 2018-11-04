$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_eadestado').validate({
        rules:
        {
          eadestado:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'eadestado/validar',
              type: "post",
              data: {
                eadestado: function() { return $( "#eadestado" ).val(); },
                id_eadestado: function() { return $('#id_eadestado').val(); }
              }
            }
          },
          n_orden:
          {
            required:true,
            remote: {
              url: $('base').attr('href') + 'eadestado/validar',
              type: "post",
              data: {
                n_orden: function() { return $( "#n_orden" ).val(); },
                id_eadestado: function() { return $('#id_eadestado').val(); }
              }
            }
          } 

        },
        messages: 
        {
          eadestado:
          {
            required:"Ingresar estado",
            minlength: "Más de 2 Letras",
            remote: "Ya Existe"
          },
          n_orden:
          {
            required:"Ingresar orden",
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
                url: $('base').attr('href') + 'eadestado/save_eadestado',
                type: 'POST',
                data: $('#form_save_eadestado').serialize(),
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

                      $('#editeadestado').modal('hide');

                      buscar_eadestados(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_eadestado = parseInt($('#id_eadestado').val());
                  id_eadestado = (id_eadestado>0) ? (id_eadestado) : ("0");
                  var text = (id_eadestado=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este estado EAD se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_eadestados(0);
});

$(document).on('click', '.add_eadestado', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editeadestado').modal('hide');
});

function limpiarform()
{
  $('#id_eadestado').val('0');
  $('#n_orden').val('');
  $('#eadestado').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#eadestado').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#eadestado').parents('.form-group').removeClass('has-error');
  }

  if($('#eadestado-error').length>0)
  {
    $('#eadestado-error').html('');
  }
  var validatore = $( "#form_save_eadestado" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_eadestados(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_eadestados(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_eadestados(page);
});

function buscar_eadestados(page)
{
  var eadestado_busc = $('#eadestado_busc').val();
  var temp = "page="+page;
  if(eadestado_busc.trim().length)
  {
    temp=temp+'&eadestado_busc='+eadestado_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'eadestado/buscar_eadestados',
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
  var ideadestado = $(this).parents('tr').attr('ideadestado');
  $.ajax({
      url: $('base').attr('href') + 'eadestado/edit',
      type: 'POST',
      data: 'id_eadestado='+ideadestado,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_eadestado').val(response.data.id_eadestado);
            $('#eadestado').val(response.data.eadestado);
            $('#n_orden').val(response.data.n_orden);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#eadestado').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#eadestado').parents('.col-md-8').removeClass('has-error');
            }

            if($('#eadestado-error').length>0)
            {
              $('#eadestado-error').html('');
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
  var ideadestado = $(this).parents('tr').attr('ideadestado');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var eadestado_busc = $('#eadestado_busc').val();
  var temp = "page="+page;
  if(eadestado_busc.trim().length)
  {
    temp=temp+'&eadestado_busc='+eadestado_busc;
  }
  var nomb = "estado EAD";
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
        url: $('base').attr('href') + 'eadestado/save_eadestado',
        type: 'POST',
        data: 'id_eadestado='+ideadestado+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_eadestados(temp);
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
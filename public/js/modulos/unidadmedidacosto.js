$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_unidadmedidacosto').validate({
        rules:
        {
          unidad_medida:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'unidadmedidacosto/validar_umc',
              type: "post",
              data: {
                unidad_medida: function() { return $( "#unidad_medida" ).val(); },
                id_unidadmedidacosto: function() { return $( "#id_unidadmedidacosto" ).val(); }
              }
            }
          }       
        },
        messages: 
        {
          unidad_medida:
          {
            required:"Ingresar Unidad de Medida",
            minlength: "Más de 2 Letras",
            remote:"Ya Existe"
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
                url: $('base').attr('href') + 'unidadmedidacosto/save_unidadmedidacosto',
                type: 'POST',
                data: $('#form_save_unidadmedidacosto').serialize(),
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

                      $('#editunidadmedidacosto').modal('hide');
                      buscar_unidadmedidacostos(page);
                    }
                    else
                    {
                      if($('#unidad_medida').parents('.form-group').attr('class')=="form-group")
                      {
                        $('#unidad_medida').parents('.form-group').addClass('has-error');
                      }
                      
                      if($('#unidad_medida-error').length>0)
                      {
                        $('#unidad_medida-error').html(response.message);
                      }
                      else
                      {
                        $('#unidad_medida').parents('.col-md-6').append("<span id='unidad_medida-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                  var id_unidadmedidacosto = parseInt($('#id_unidadmedidacosto').val());
                  id_unidadmedidacosto = (id_unidadmedidacosto>0) ? (id_unidadmedidacosto) : ("0");
                  var text = (id_unidadmedidacosto=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Ubicación se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_unidadmedidacostos(0);
});

$(document).on('click', '.add_unidadmedidacosto', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editunidadmedidacosto').modal('hide');
});

function limpiarform()
{
  $('#id_unidadmedidacosto').val('0');
  $('#unidad_medida').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#unidad_medida').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#unidad_medida').parents('.form-group').removeClass('has-error');
  }

  if($('#unidad_medida-error').length>0)
  {
    $('#unidad_medida-error').html('');
  }

  var validatore = $( "#form_save_unidadmedidacosto" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_unidadmedidacostos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_unidadmedidacostos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_unidadmedidacostos(page);
});

function buscar_unidadmedidacostos(page)
{
  var temp = "page="+page;
  var um_busc = $('#um_busc').val();
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }

  $.ajax({
      url: $('base').attr('href') + 'unidadmedidacosto/buscar_unidadmedidacostos',
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
  var idunidadmedidacosto = $(this).parents('tr').attr('idunidadmedidacosto');
  $.ajax({
      url: $('base').attr('href') + 'unidadmedidacosto/edit',
      type: 'POST',
      data: 'id_unidadmedidacosto='+idunidadmedidacosto,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_unidadmedidacosto').val(response.data.id_unidadmedidacosto);
            $('#unidad_medida').val(response.data.unidad_medida);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#unidad_medida').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
            {
              $('#unidad_medida').parents('.col-md-6').removeClass('has-error');
            }

            if($('#unidad_medida-error').length>0)
            {
              $('#unidad_medida-error').html('');
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
  var idunidadmedidacosto = $(this).parents('tr').attr('idunidadmedidacosto');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Unidad de Medida";

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
        url: $('base').attr('href') + 'unidadmedidacosto/save_unidadmedidacosto',
        type: 'POST',
        data: 'id_unidadmedidacosto='+idunidadmedidacosto+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_unidadmedidacostos(page);

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
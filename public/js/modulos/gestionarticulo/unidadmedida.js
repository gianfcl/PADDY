$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_unidadmedida').validate({
        rules:
        {
          unidad_medida:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'unidadmedida/validar',
              type: "post",
              data: {
                unidad_medida: function() { return $( "#unidad_medida" ).val(); },
                id_unidadmedida: function() { return $('#id_unidadmedida').val(); }
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
                url: $('base').attr('href') + 'unidadmedida/save_unidadmedida',
                type: 'POST',
                data: $('#form_save_unidadmedida').serialize(),
                dataType: "json",
                beforeSend: function() {
                  $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    if (response.code==1) {
                      var page = 0;
                      if($('#paginacion_data ul.pagination li.active a').length>0)
                      {
                        page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                      }                   

                      $('#editunidadmedida').modal('hide');
                      buscar_unidadmedidas(page);
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
                  $.LoadingOverlay("hide");
                  var id_unidadmedida = parseInt($('#id_unidadmedida').val());
                  id_unidadmedida = (id_unidadmedida>0) ? (id_unidadmedida) : ("0");
                  var text = (id_unidadmedida=="0") ? ("Guardo!") : ("Edito!");
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
  buscar_unidadmedidas(0);
});

$(document).on('click', '.add_unidadmedida', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editunidadmedida').modal('hide');
});

function limpiarform()
{
  $('#abreviatura').val('');
  $('#id_unidadmedida').val('0');
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

  var validatore = $( "#form_save_unidadmedida" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_unidadmedidas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_unidadmedidas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_unidadmedidas(page);
});

function buscar_unidadmedidas(page)
{
  var temp = "page="+page;
  var um_busc = $('#um_busc').val();
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }

  $.ajax({
      url: $('base').attr('href') + 'unidadmedida/buscar_unidadmedidas',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
            $('#paginacion_data').html(response.data.paginacion);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });
}

$(document).on('click', '.edit', function (e) {
  var idunidadmedida = $(this).parents('tr').attr('idunidadmedida');
  $.ajax({
      url: $('base').attr('href') + 'unidadmedida/edit',
      type: 'POST',
      data: 'id_unidadmedida='+idunidadmedida,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_unidadmedida').val(response.data.id_unidadmedida);
            $('#unidad_medida').val(response.data.unidad_medida);
            $('#abreviatura').val(response.data.abreviatura);
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
        $.LoadingOverlay("hide");
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idunidadmedida = $(this).parents('tr').attr('idunidadmedida');
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
        url: $('base').attr('href') + 'unidadmedida/save_unidadmedida',
        type: 'POST',
        data: 'id_unidadmedida='+idunidadmedida+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {
              buscar_unidadmedidas(page);

            }
        },
        complete: function() {
          $.LoadingOverlay("hide");
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpiarform();
        }
      });
    }
  });   
});
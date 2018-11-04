$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_unidadmedidaaf').validate({
        rules:
        {
          unidadmedidaaf:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'unidadmedidaaf/validar',
              type: "post",
              data: {
                unidadmedidaaf: function() { return $( "#unidadmedidaaf" ).val(); },
                id_unidadmedidaaf: function() { return $('#id_unidadmedidaaf').val(); }
              }
            }
          }       
        },
        messages: 
        {
          unidadmedidaaf:
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
                url: $('base').attr('href') + 'unidadmedidaaf/save_unidadmedidaaf',
                type: 'POST',
                data: $('#form_save_unidadmedidaaf').serialize(),
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

                      $('#editunidadmedidaaf').modal('hide');
                      buscar_unidadmedidaafs(page);
                    }
                    else
                    {
                      if($('#unidadmedidaaf').parents('.form-group').attr('class')=="form-group")
                      {
                        $('#unidadmedidaaf').parents('.form-group').addClass('has-error');
                      }
                      
                      if($('#unidadmedidaaf-error').length>0)
                      {
                        $('#unidadmedidaaf-error').html(response.message);
                      }
                      else
                      {
                        $('#unidadmedidaaf').parents('.col-md-6').append("<span id='unidadmedidaaf-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                  var id_unidadmedidaaf = parseInt($('#id_unidadmedidaaf').val());
                  id_unidadmedidaaf = (id_unidadmedidaaf>0) ? (id_unidadmedidaaf) : ("0");
                  var text = (id_unidadmedidaaf=="0") ? ("Guardo!") : ("Edito!");
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
  buscar_unidadmedidaafs(0);
});

$(document).on('click', '.add_unidadmedidaaf', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editunidadmedidaaf').modal('hide');
});

function limpiarform()
{
  $('#id_unidadmedidaaf').val('0');
  $('#unidadmedidaaf').val('');
  $('#abreviatura').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#unidadmedidaaf').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#unidadmedidaaf').parents('.form-group').removeClass('has-error');
  }

  if($('#unidadmedidaaf-error').length>0)
  {
    $('#unidadmedidaaf-error').html('');
  }

  var validatore = $( "#form_save_unidadmedidaaf" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_unidadmedidaafs(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_unidadmedidaafs(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_unidadmedidaafs(page);
});

function buscar_unidadmedidaafs(page)
{
  var temp = "page="+page;
  var um_busc = $('#um_busc').val();
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var um2_busc = $('#um2_busc').val();
  if(um2_busc.trim().length)
  {
    temp=temp+'&um2_busc='+um2_busc;
  }

  $.ajax({
      url: $('base').attr('href') + 'unidadmedidaaf/buscar_unidadmedidaafs',
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
  var idunidadmedidaaf = $(this).parents('tr').attr('idunidadmedidaaf');
  $.ajax({
      url: $('base').attr('href') + 'unidadmedidaaf/edit',
      type: 'POST',
      data: 'id_unidadmedidaaf='+idunidadmedidaaf,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_unidadmedidaaf').val(response.data.id_unidadmedidaaf);
            $('#unidadmedidaaf').val(response.data.unidadmedidaaf);
            $('#abreviatura').val(response.data.abreviatura);
            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#unidadmedidaaf').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
            {
              $('#unidadmedidaaf').parents('.col-md-6').removeClass('has-error');
            }

            if($('#unidadmedidaaf-error').length>0)
            {
              $('#unidadmedidaaf-error').html('');
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
  var idunidadmedidaaf = $(this).parents('tr').attr('idunidadmedidaaf');
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
        url: $('base').attr('href') + 'unidadmedidaaf/save_unidadmedidaaf',
        type: 'POST',
        data: 'id_unidadmedidaaf='+idunidadmedidaaf+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_unidadmedidaafs(page);

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
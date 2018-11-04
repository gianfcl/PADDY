$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_serviciosol').validate({
        rules:
        {
          serviciosol:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'serviciosol/validar',
              type: "post",
              data: {
                serviciosol: function() { return $( "#serviciosol" ).val(); },
                id_serviciosol: function() { return $('#id_serviciosol').val(); }
              }
            }
          }       
        },
        messages: 
        {
          serviciosol:
          {
            required:"Ingresar serviciosol",
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
                url: $('base').attr('href') + 'serviciosol/save_serviciosol',
                type: 'POST',
                data: $('#form_save_serviciosol').serialize(),
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

                      $('#editserviciosol').modal('hide');

                      buscar_serviciosols(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_serviciosol = parseInt($('#id_serviciosol').val());
                  id_serviciosol = (id_serviciosol>0) ? (id_serviciosol) : ("0");
                  var text = (id_serviciosol=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este serviciosol se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_serviciosols(0);
});

$(document).on('click', '.add_serviciosol', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editserviciosol').modal('hide');
});

function limpiarform()
{
  $('#id_serviciosol').val('0');
  $('#serviciosol').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $("input[name=es_general]").prop('checked', false);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#serviciosol').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#serviciosol').parents('.form-group').removeClass('has-error');
  }

  if($('#serviciosol-error').length>0)
  {
    $('#serviciosol-error').html('');
  }
  var validatore = $( "#form_save_serviciosol" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_serviciosols(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_serviciosols(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_serviciosols(page);
});

function buscar_serviciosols(page)
{
  var um_busc = $('#um_busc').val();
  //alert(um_busc);
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'serviciosol/buscar_serviciosols',
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
  limpiarform();
  var idserviciosol = $(this).parents('tr').attr('idserviciosol');
  $.ajax({
      url: $('base').attr('href') + 'serviciosol/edit',
      type: 'POST',
      data: 'id_serviciosol='+idserviciosol,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_serviciosol').val(response.data.id_serviciosol);
            $('#serviciosol').val(response.data.serviciosol);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#serviciosol').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#serviciosol').parents('.col-md-8').removeClass('has-error');
            }

            if($('#serviciosol-error').length>0)
            {
              $('#serviciosol-error').html('');
            }
            if (response.data.es_general==2) {
              $('input[name=es_general]').prop('checked', true);
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
  var idserviciosol = $(this).parents('tr').attr('idserviciosol');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "servicio?";
  swal({
    title: '¿Estás seguro',
    text: "de eliminar este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'serviciosol/save_serviciosol',
        type: 'POST',
        data: 'id_serviciosol='+idserviciosol+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_serviciosols(temp);
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

$(document).on('click', '.open_condiciones', function (e) {
  //limpiarform_c();
  var idserviciosol = $(this).parents('tr').attr('idserviciosol');
  $('#id_serviciosol_c').val(idserviciosol);
  $.ajax({
      url: $('base').attr('href') + 'serviciosol/get_condicion',
      type: 'POST',
      data: 'id_serviciosol='+idserviciosol,
      dataType: "json",
      beforeSend: function() {
          
      },
      success: function(response) {
          if (response.code==1) {
            $('#condicion').val(response.data.data.condicion);
          }
      },
      complete: function() {
          
      }
  });
});

$(document).on('click', '.save_condicion', function (e) {
  
  var idserviciosol = $('#id_serviciosol_c').val();
  $('#id_serviciosol_c').val(idserviciosol);
  var condicion = $('textarea[name=condicion]').val();
  if(condicion.length>0){
    $.ajax({
        url: $('base').attr('href') + 'serviciosol/save_condicion',
        type: 'POST',
        data: 'id_serviciosol='+idserviciosol+'&condicion='+condicion,
        dataType: "json",
        beforeSend: function() {
        },
        success: function(response) {
          if (response.code==1) {
          }
        },
        complete: function() {
          swal('Condición guardada!! :).','', 'success');
          limpiarform_c();
          $('#agregar_condiciones').modal('hide');
        }
    });
  }
  else{
    swal(
      'Oops...:(',
      'No has escrito nada.',
      'error'
    )
  }    
});

function limpiarform_c()
{
  $('#id_serviciosol_c').val('');
  $('#condicion').val('');
}

$(document).on('click', '.cancelar_save', function (e) {
  limpiarform_c();
  $('#agregar_condiciones').modal('hide');
});
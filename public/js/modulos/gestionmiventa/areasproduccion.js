$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_areasproduccion').validate({
        rules:
        {
          areasproduccion:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'areasproduccion/validar',
              type: "post",
              data: {
                areasproduccion: function() { return $( "#areasproduccion" ).val(); },
                id_areasproduccion: function() { return $('#id_areasproduccion').val(); }
              }
            }
          }       
        },
        messages: 
        {
          areasproduccion:
          {
            required:"Ingresar Área Producción",
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
                url: $('base').attr('href') + 'areasproduccion/save_areasproduccion',
                type: 'POST',
                data: $('#form_save_areasproduccion').serialize(),
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

                      $('#editareasproduccion').modal('hide');

                      buscar_areasproduccions(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_areasproduccion = parseInt($('#id_areasproduccion').val());
                  id_areasproduccion = (id_areasproduccion>0) ? (id_areasproduccion) : ("0");
                  var text = (id_areasproduccion=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Área Producción se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_areasproduccions(0);
});

$(document).on('click', '.add_areasproduccion', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editareasproduccion').modal('hide');
});

function limpiarform()
{
  $('#id_areasproduccion').val('0');
  $('#areasproduccion').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#areasproduccion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#areasproduccion').parents('.form-group').removeClass('has-error');
  }

  if($('#areasproduccion-error').length>0)
  {
    $('#areasproduccion-error').html('');
  }
  var validatore = $( "#form_save_areasproduccion" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_areasproduccions(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_areasproduccions(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_areasproduccions(page);
});

function buscar_areasproduccions(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'areasproduccion/buscar_areasproduccions',
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
  var idareasproduccion = $(this).parents('tr').attr('idareasproduccion');
  $.ajax({
      url: $('base').attr('href') + 'areasproduccion/edit',
      type: 'POST',
      data: 'id_areasproduccion='+idareasproduccion,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_areasproduccion').val(response.data.id_areasproduccion);
            $('#areasproduccion').val(response.data.areasproduccion);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#areasproduccion').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#areasproduccion').parents('.col-md-8').removeClass('has-error');
            }

            if($('#areasproduccion-error').length>0)
            {
              $('#areasproduccion-error').html('');
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
  var idareasproduccion = $(this).parents('tr').attr('idareasproduccion');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "Área de Producción";
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
        url: $('base').attr('href') + 'areasproduccion/save_areasproduccion',
        type: 'POST',
        data: 'id_areasproduccion='+idareasproduccion+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_areasproduccions(temp);
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
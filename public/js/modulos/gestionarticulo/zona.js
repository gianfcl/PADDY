$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_zona').validate({
        rules:
        {
          zona:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'zona/validar',
              type: "post",
              data: {
                zona: function() { return $( "#zona" ).val(); },
                id_zona: function() { return $('#id_zona').val(); }
              }
            }
          }       
        },
        messages: 
        {
          zona:
          {
            required:"Ingresar Zona",
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
                url: $('base').attr('href') + 'zona/save_zona',
                type: 'POST',
                data: $('#form_save_zona').serialize(),
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

                      $('#editzona').modal('hide');

                      buscar_zonas(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_zona = parseInt($('#id_zona').val());
                  id_zona = (id_zona>0) ? (id_zona) : ("0");
                  var text = (id_zona=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Zona se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_zonas(0);
});

$(document).on('click', '.add_zona', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editzona').modal('hide');
});

function limpiarform()
{
  $('#id_zona').val('0');
  $('#zona').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#zona').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#zona').parents('.form-group').removeClass('has-error');
  }

  if($('#zona-error').length>0)
  {
    $('#zona-error').html('');
  }
  var validatore = $( "#form_save_zona" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_zonas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_zonas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_zonas(page);
});

function buscar_zonas(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'zona/buscar_zonas',
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
  var idzona = $(this).parents('tr').attr('idzona');
  $.ajax({
      url: $('base').attr('href') + 'zona/edit',
      type: 'POST',
      data: 'id_zona='+idzona,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_zona').val(response.data.id_zona);
            $('#zona').val(response.data.zona);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#zona').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#zona').parents('.col-md-8').removeClass('has-error');
            }

            if($('#zona-error').length>0)
            {
              $('#zona-error').html('');
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
  var idzona = $(this).parents('tr').attr('idzona');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "zona";
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
        url: $('base').attr('href') + 'zona/save_zona',
        type: 'POST',
        data: 'id_zona='+idzona+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_zonas(temp);
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
$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_areaposicion').validate({
        rules:
        {
          areaposicion:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'areaposicion/validar',
              type: "post",
              data: {
                areaposicion: function() { return $( "#areaposicion" ).val(); },
                id_areaposicion: function() { return $('#id_areaposicion').val(); }
              }
            }
          }       
        },
        messages: 
        {
          areaposicion:
          {
            required:"Ingresar Área Posición",
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
                url: $('base').attr('href') + 'areaposicion/save_areaposicion',
                type: 'POST',
                data: $('#form_save_areaposicion').serialize(),
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

                      $('#editareaposicion').modal('hide');

                      buscar_areaposicions(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_areaposicion = parseInt($('#id_areaposicion').val());
                  id_areaposicion = (id_areaposicion>0) ? (id_areaposicion) : ("0");
                  var text = (id_areaposicion=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Área se '+text+'.', 'success');
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

$(document).on('click', '.add_areaposicion', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editareaposicion').modal('hide');
});

function limpiarform()
{
  $('#id_areaposicion').val('0');
  $('#areaposicion').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#areaposicion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#areaposicion').parents('.form-group').removeClass('has-error');
  }

  if($('#areaposicion-error').length>0)
  {
    $('#areaposicion-error').html('');
  }
  var validatore = $( "#form_save_areaposicion" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_areaposicions(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_areaposicions(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_areaposicions(page);
});

function buscar_areaposicions(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'areaposicion/buscar_areaposicions',
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
  var idareaposicion = $(this).parents('tr').attr('idareaposicion');
  $.ajax({
      url: $('base').attr('href') + 'areaposicion/edit',
      type: 'POST',
      data: 'id_areaposicion='+idareaposicion,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_areaposicion').val(response.data.id_areaposicion);
            $('#areaposicion').val(response.data.areaposicion);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#areaposicion').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#areaposicion').parents('.col-md-8').removeClass('has-error');
            }

            if($('#areaposicion-error').length>0)
            {
              $('#areaposicion-error').html('');
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
  var idareaposicion = $(this).parents('tr').attr('idareaposicion');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "Posición";
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
        url: $('base').attr('href') + 'areaposicion/save_areaposicion',
        type: 'POST',
        data: 'id_areaposicion='+idareaposicion+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_areaposicions(temp);
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
$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_tiporefrigerio').validate({
        rules:
        {
          tiporefrigerio:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'tiporefrigerio/validar_cc',
              type: "post",
              data: {
                tiporefrigerio: function() { return $( "#tiporefrigerio" ).val(); },
                id_tiporefrigerio: function() { return $('#id_tiporefrigerio').val(); }
              }
            }
          }       
        },
        messages: 
        {
          tiporefrigerio:
          {
            required:"Requisito",
            minlength: "Más de 2 Letras",
            remote: 'Ya Existe'
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
                url: $('base').attr('href') + 'tiporefrigerio/save_tiporefrigerio',
                type: 'POST',
                data: $('#form_save_tiporefrigerio').serialize(),
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

                      $('#edittiporefrigerio').modal('hide');

                      buscar_tiporefrigerios(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_tiporefrigerio = parseInt($('#id_tiporefrigerio').val());
                  id_tiporefrigerio = (id_tiporefrigerio>0) ? (id_tiporefrigerio) : ("0");
                  var text = (id_tiporefrigerio=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Refrigerio se '+text+'.', 'success');
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

$(document).on('click', '.add_tiporefrigerio', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#edittiporefrigerio').modal('hide');
});

function limpiarform()
{
  $('#id_tiporefrigerio').val('0');
  $('#tiporefrigerio').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#tiporefrigerio').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#tiporefrigerio').parents('.form-group').removeClass('has-error');
  }

  if($('#tiporefrigerio-error').length>0)
  {
    $('#tiporefrigerio-error').html('');
  }
  var validatore = $( "#form_save_tiporefrigerio" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_tiporefrigerios(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tiporefrigerios(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_tiporefrigerios(page);
});

function buscar_tiporefrigerios(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'tiporefrigerio/buscar_tiporefrigerios',
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
  var idtiporefrigerio = $(this).parents('tr').attr('idtiporefrigerio');
  $.ajax({
      url: $('base').attr('href') + 'tiporefrigerio/edit',
      type: 'POST',
      data: 'id_tiporefrigerio='+idtiporefrigerio,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_tiporefrigerio').val(response.data.id_tiporefrigerio);
            $('#tiporefrigerio').val(response.data.tiporefrigerio);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#tiporefrigerio').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#tiporefrigerio').parents('.col-md-8').removeClass('has-error');
            }

            if($('#tiporefrigerio-error').length>0)
            {
              $('#tiporefrigerio-error').html('');
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
  var idtiporefrigerio = $(this).parents('tr').attr('idtiporefrigerio');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "tiporefrigerio";
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
        url: $('base').attr('href') + 'tiporefrigerio/save_tiporefrigerio',
        type: 'POST',
        data: 'id_tiporefrigerio='+idtiporefrigerio+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_tiporefrigerios(temp);
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
$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_gruposervicios').validate({
        rules:
        {
          gruposervicios:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'gruposervicios/validar_cc',
              type: "post",
              data: {
                gruposervicios: function() { return $( "#gruposervicios" ).val(); },
                id_gruposervicios: function() { return $('#id_gruposervicios').val(); }
              }
            }
          }       
        },
        messages: 
        {
          gruposervicios:
          {
            required:"Grupo E. C.",
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
                url: $('base').attr('href') + 'gruposervicios/save_gruposervicios',
                type: 'POST',
                data: $('#form_save_gruposervicios').serialize(),
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

                      $('#editgruposervicios').modal('hide');

                      buscar_gruposervicioss(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_gruposervicios = parseInt($('#id_gruposervicios').val());
                  id_gruposervicios = (id_gruposervicios>0) ? (id_gruposervicios) : ("0");
                  var text = (id_gruposervicios=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Marca se '+text+'.', 'success');
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

$(document).on('click', '.add_gruposervicios', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editgruposervicios').modal('hide');
});

function limpiarform()
{
  $('#id_gruposervicios').val('0');
  $('#gruposervicios').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#gruposervicios').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#gruposervicios').parents('.form-group').removeClass('has-error');
  }

  if($('#gruposervicios-error').length>0)
  {
    $('#gruposervicios-error').html('');
  }
  var validatore = $( "#form_save_gruposervicios" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_gruposervicioss(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_gruposervicioss(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_gruposervicioss(page);
});

function buscar_gruposervicioss(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'gruposervicios/buscar_gruposervicioss',
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
  var idgruposervicios = $(this).parents('tr').attr('idgruposervicios');
  $.ajax({
      url: $('base').attr('href') + 'gruposervicios/edit',
      type: 'POST',
      data: 'id_gruposervicios='+idgruposervicios,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_gruposervicios').val(response.data.id_gruposervicios);
            $('#gruposervicios').val(response.data.gruposervicios);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#gruposervicios').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#gruposervicios').parents('.col-md-8').removeClass('has-error');
            }

            if($('#gruposervicios-error').length>0)
            {
              $('#gruposervicios-error').html('');
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
  var idgruposervicios = $(this).parents('tr').attr('idgruposervicios');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "gruposervicios";
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
        url: $('base').attr('href') + 'gruposervicios/save_gruposervicios',
        type: 'POST',
        data: 'id_gruposervicios='+idgruposervicios+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_gruposervicioss(temp);
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
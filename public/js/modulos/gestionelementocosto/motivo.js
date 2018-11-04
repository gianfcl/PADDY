$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_motivo').validate({
        rules:
        {
          motivo:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'motivo/validar',
              type: "post",
              data: {
                motivo: function() { return $( "#motivo" ).val(); },
                id_motivo: function() { return $('#id_motivo').val(); }
              }
            }
          }       
        },
        messages: 
        {
          motivo:
          {
            required:"Ingresar motivo",
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
                url: $('base').attr('href') + 'motivo/save_motivo',
                type: 'POST',
                data: $('#form_save_motivo').serialize(),
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

                      $('#editmotivo').modal('hide');

                      buscar_motivos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_motivo = parseInt($('#id_motivo').val());
                  id_motivo = (id_motivo>0) ? (id_motivo) : ("0");
                  var text = (id_motivo=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este motivo se '+text+'.', 'success');
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

$(document).on('click', '.add_motivo', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editmotivo').modal('hide');
});

function limpiarform()
{
  $('#id_motivo').val('0');
  $('#motivo').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#motivo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#motivo').parents('.form-group').removeClass('has-error');
  }

  if($('#motivo-error').length>0)
  {
    $('#motivo-error').html('');
  }
  var validatore = $( "#form_save_motivo" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_motivos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_motivos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_motivos(page);
});

function buscar_motivos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'motivo/buscar_motivos',
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
  var idmotivo = $(this).parents('tr').attr('idmotivo');
  $.ajax({
      url: $('base').attr('href') + 'motivo/edit',
      type: 'POST',
      data: 'id_motivo='+idmotivo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_motivo').val(response.data.id_motivo);
            $('#motivo').val(response.data.motivo);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#motivo').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#motivo').parents('.col-md-8').removeClass('has-error');
            }

            if($('#motivo-error').length>0)
            {
              $('#motivo-error').html('');
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
  var idmotivo = $(this).parents('tr').attr('idmotivo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "motivo";
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
        url: $('base').attr('href') + 'motivo/save_motivo',
        type: 'POST',
        data: 'id_motivo='+idmotivo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_motivos(temp);
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
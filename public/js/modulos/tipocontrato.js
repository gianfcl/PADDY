$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_tipocontrato').validate({
        rules:
        {
          tipocontrato:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'tipocontrato/validar_cc',
              type: "post",
              data: {
                tipocontrato: function() { return $( "#tipocontrato" ).val(); },
                id_tipocontrato: function() { return $('#id_tipocontrato').val(); }
              }
            }
          }       
        },
        messages: 
        {
          tipocontrato:
          {
            required:"Tipo de Contrato",
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
                url: $('base').attr('href') + 'tipocontrato/save_tipocontrato',
                type: 'POST',
                data: $('#form_save_tipocontrato').serialize(),
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

                      $('#edittipocontrato').modal('hide');

                      buscar_tipocontratos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_tipocontrato = parseInt($('#id_tipocontrato').val());
                  id_tipocontrato = (id_tipocontrato>0) ? (id_tipocontrato) : ("0");
                  var text = (id_tipocontrato=="0") ? ("Guardo!") : ("Edito!");
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

$(document).on('click', '.add_tipocontrato', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#edittipocontrato').modal('hide');
});

function limpiarform()
{
  $('#id_tipocontrato').val('0');
  $('#tipocontrato').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#tipocontrato').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#tipocontrato').parents('.form-group').removeClass('has-error');
  }

  if($('#tipocontrato-error').length>0)
  {
    $('#tipocontrato-error').html('');
  }
  var validatore = $( "#form_save_tipocontrato" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_tipocontratos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tipocontratos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_tipocontratos(page);
});

function buscar_tipocontratos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'tipocontrato/buscar_tipocontratos',
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
  var idtipocontrato = $(this).parents('tr').attr('idtipocontrato');
  $.ajax({
      url: $('base').attr('href') + 'tipocontrato/edit',
      type: 'POST',
      data: 'id_tipocontrato='+idtipocontrato,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_tipocontrato').val(response.data.id_tipocontrato);
            $('#tipocontrato').val(response.data.tipocontrato);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#tipocontrato').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#tipocontrato').parents('.col-md-8').removeClass('has-error');
            }

            if($('#tipocontrato-error').length>0)
            {
              $('#tipocontrato-error').html('');
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
  var idtipocontrato = $(this).parents('tr').attr('idtipocontrato');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "tipocontrato";
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
        url: $('base').attr('href') + 'tipocontrato/save_tipocontrato',
        type: 'POST',
        data: 'id_tipocontrato='+idtipocontrato+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_tipocontratos(temp);
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
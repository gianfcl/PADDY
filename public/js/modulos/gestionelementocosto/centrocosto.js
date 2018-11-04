$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_centrocosto').validate({
        rules:
        {
          centrocosto:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'centrocosto/validar_cc',
              type: "post",
              data: {
                centrocosto: function() { return $( "#centrocosto" ).val(); },
                id_centrocosto: function() { return $('#id_centrocosto').val(); }
              }
            }
          }       
        },
        messages: 
        {
          centrocosto:
          {
            required:"Ingresar Centro de Costo",
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
                url: $('base').attr('href') + 'centrocosto/save_centrocosto',
                type: 'POST',
                data: $('#form_save_centrocosto').serialize(),
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

                      $('#editcentrocosto').modal('hide');

                      buscar_centrocostos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_centrocosto = parseInt($('#id_centrocosto').val());
                  id_centrocosto = (id_centrocosto>0) ? (id_centrocosto) : ("0");
                  var text = (id_centrocosto=="0") ? ("Guardo!") : ("Edito!");
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

$(document).on('click', '.add_centrocosto', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editcentrocosto').modal('hide');
});

function limpiarform()
{
  $('#id_centrocosto').val('0');
  $('#centrocosto').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#centrocosto').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#centrocosto').parents('.form-group').removeClass('has-error');
  }

  if($('#centrocosto-error').length>0)
  {
    $('#centrocosto-error').html('');
  }
  var validatore = $( "#form_save_centrocosto" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_centrocostos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_centrocostos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_centrocostos(page);
});

function buscar_centrocostos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'centrocosto/buscar_centrocostos',
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
  var idcentrocosto = $(this).parents('tr').attr('idcentrocosto');
  $.ajax({
      url: $('base').attr('href') + 'centrocosto/edit',
      type: 'POST',
      data: 'id_centrocosto='+idcentrocosto,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_centrocosto').val(response.data.id_centrocosto);
            $('#centrocosto').val(response.data.centrocosto);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#centrocosto').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#centrocosto').parents('.col-md-8').removeClass('has-error');
            }

            if($('#centrocosto-error').length>0)
            {
              $('#centrocosto-error').html('');
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
  var idcentrocosto = $(this).parents('tr').attr('idcentrocosto');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "centrocosto";
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
        url: $('base').attr('href') + 'centrocosto/save_centrocosto',
        type: 'POST',
        data: 'id_centrocosto='+idcentrocosto+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_centrocostos(temp);
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
$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_areapuesto').validate({
        rules:
        {
          id_sucursal:{ required:true },
          areapuesto:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'areapuesto/validar_cc',
              type: "post",
              data: {
                areapuesto: function() { return $( "#areapuesto" ).val(); },
                id_sucursal: function() { return $( "#id_sucursal" ).val(); },
                id_areapuesto: function() { return $('#id_areapuesto').val(); }
              }
            }
          }       
        },
        messages: 
        {
          id_sucursal:{ required:"Sucursal" },
          areapuesto:
          {
            required:"Área de Puesto",
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
                url: $('base').attr('href') + 'areapuesto/save_areapuesto',
                type: 'POST',
                data: $('#form_save_areapuesto').serialize(),
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

                      $('#editareapuesto').modal('hide');

                      buscar_areapuestos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_areapuesto = parseInt($('#id_areapuesto').val());
                  id_areapuesto = (id_areapuesto>0) ? (id_areapuesto) : ("0");
                  var text = (id_areapuesto=="0") ? ("Guardo!") : ("Edito!");
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

$(document).on('click', '.add_areapuesto', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editareapuesto').modal('hide');
});

function limpiarform()
{
  $('#id_areapuesto').val('0');
  $('#areapuesto').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#areapuesto').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#areapuesto').parents('.form-group').removeClass('has-error');
  }

  if($('#areapuesto-error').length>0)
  {
    $('#areapuesto-error').html('');
  }
  var validatore = $( "#form_save_areapuesto" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_areapuestos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_areapuestos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_areapuestos(page);
});

function buscar_areapuestos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  var idsucu = $('#id_sucu').val();
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  if(idsucu.trim().length)
  {
    temp=temp+'&id_sucu='+idsucu;
  }

  $.ajax({
      url: $('base').attr('href') + 'areapuesto/buscar_areapuestos',
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
  var idareapuesto = $(this).parents('tr').attr('idareapuesto');
  $.ajax({
      url: $('base').attr('href') + 'areapuesto/edit',
      type: 'POST',
      data: 'id_areapuesto='+idareapuesto,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_areapuesto').val(response.data.id_areapuesto);
            $('#areapuesto').val(response.data.areapuesto);
            $('#id_sucursal').val(response.data.id_sucursal);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#areapuesto').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#areapuesto').parents('.col-md-8').removeClass('has-error');
            }

            if($('#areapuesto-error').length>0)
            {
              $('#areapuesto-error').html('');
            }
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  var page = 0;

  buscar_areapuestos(page);
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idareapuesto = $(this).parents('tr').attr('idareapuesto');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "areapuesto";
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
        url: $('base').attr('href') + 'areapuesto/save_areapuesto',
        type: 'POST',
        data: 'id_areapuesto='+idareapuesto+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_areapuestos(temp);
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
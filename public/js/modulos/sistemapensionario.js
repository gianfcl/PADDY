$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_sistemapensionario').validate({
      rules:
      {
        sistemapensionario: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'sistemapensionario/validar_sistemapensionario',
            type: "post",
            data: {
              sistemapensionario: function() { return $( "#sistemapensionario" ).val(); },
              id_sistemapensionario: function() { return $('#id_sistemapensionario').val(); }
            }
          }
        },
        id_tiposistemapensionario: {required:true}
      },
      messages: 
      {
        sistemapensionario: {required:"Sistema Pensionario", minlength: "Más de 2 Letras", remote: "Ya existe" },
        id_tiposistemapensionario: {required:"Tipo Contrato"}
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
          url: $('base').attr('href') + 'sistemapensionario/save_sistemapensionario',
          type: 'POST',
          data: $('#form_save_sistemapensionario').serialize(),
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

              buscar_sistemapensionario(page);              
            }
            else
            {
              if($('#sistemapensionario').parents('.form-group').attr('class')=="form-group")
              {
                $('#sistemapensionario').parents('.form-group').addClass('has-error');
              }
              
              if($('#sistemapensionario-error').length>0)
              {
                $('#sistemapensionario-error').html(response.message);
              }
              else
              {
                $('#sistemapensionario').parents('.col-md-6').append("<span id='sistemapensionario-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_sistemapensionario = parseInt($('#id_sistemapensionario').val());
            id_sistemapensionario = (id_sistemapensionario>0) ? (id_sistemapensionario) : ("0");
            var text = (id_sistemapensionario=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Sistema Pensionario se '+text+'.', 'success');
            limpform('form_save_sistemapensionario');
            $('#editsistemapensionario').modal('hide');
            $('#id_sistemapensionario').val('');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_sistemapensionario', function (e)
{
  limpform('form_save_sistemapensionario');
  $('#id_sistemapensionario').val('');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpform('form_save_sistemapensionario');
  $('#editsistemapensionario').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_sistemapensionario(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_sistemapensionario(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_sistemapensionario(page);
});

function buscar_sistemapensionario(page)
{
  var id_tiposistemapensionario_busc = $('#id_tiposistemapensionario_busc').val();
  var sistemapensionario_busc = $('#sistemapensionario_busc').val();
  var temp = "page="+page;

  if(id_tiposistemapensionario_busc.trim().length)
  {
    temp=temp+'&id_tiposistemapensionario_busc='+id_tiposistemapensionario_busc;
  }
  if(sistemapensionario_busc.trim().length)
  {
    temp=temp+'&sistemapensionario_busc='+sistemapensionario_busc;
  }
  $.ajax({
    url: $('base').attr('href') + 'sistemapensionario/buscar_sistemapensionario',
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

$(document).on('change', '#id_departamento', function (e)
{
  var id_departamento = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'ubigeo/combox_prov',
    type: 'POST',
    data: 'id_departamento='+id_departamento,
    dataType: "json",
    success: function(response) {
      if (response.code == "1") {
        $('#id_provincia').html(response.data);
        $('#id_distrito').html("<option value=''>DISTRITO</option>");
      }
    },
    complete: function() {
        //hideLoader();
    }
  });
});


$(document).on('change', '#id_provincia', function (e)
{
  var id_provincia = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'ubigeo/combox_dist',
    type: 'POST',
    data: 'id_provincia='+id_provincia,
    dataType: "json",
    success: function(response) {
      if (response.code == "1") {
        $('#id_distrito').html(response.data);
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.edit', function (e) {
  var idsistemapensionario = $(this).parents('tr').attr('idsistemapensionario');
  $.ajax({
    url: $('base').attr('href') + 'sistemapensionario/edit',
    type: 'POST',
    data: 'id_sistemapensionario='+idsistemapensionario,
    dataType: "json",
    beforeSend: function() {
      limpform('form_save_sistemapensionario');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_sistemapensionario').val(response.data.id_sistemapensionario);
        $('#sistemapensionario').val(response.data.sistemapensionario);
        $('#id_tiposistemapensionario').val(response.data.id_tiposistemapensionario);
        $('#id_modalidadcontrato').val(response.data.id_modalidadcontrato);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idsistemapensionario = $(this).parents('tr').attr('idsistemapensionario');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Vehículo";

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
        url: $('base').attr('href') + 'sistemapensionario/save_sistemapensionario',
        type: 'POST',
        data: 'id_sistemapensionario='+idsistemapensionario+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_sistemapensionario(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpform('form_save_sistemapensionario');
        }
      });
    }
  });    
});
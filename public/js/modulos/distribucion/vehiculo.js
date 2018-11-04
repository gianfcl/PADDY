$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_vehiculo').validate({
      rules:
      {
        placa: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'vehiculo/validar_vehiculo',
            type: "post",
            data: {
              placa: function() { return $( "#placa" ).val(); },
              id_vehiculo: function() { return $('#id_vehiculo').val(); }
            }
          }
        },
        marca: {required:true, minlength: 2},
        modelo: {required:true, minlength: 2}
      },
      messages: 
      {
        placa: {required:"Placa", minlength: "Más de 2 Letras", remote: "Ya existe" },
        marca: {required:"Marca", minlength: "Más de 2 Letras"},
        modelo: {required:"Modelo", minlength: "Más de 2 Letras"}
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
          url: $('base').attr('href') + 'vehiculo/save_vehiculo',
          type: 'POST',
          data: $('#form_save_vehiculo').serialize(),
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

              buscar_vehiculos(page);
            }
            else
            {
              if($('#vehiculo').parents('.form-group').attr('class')=="form-group")
              {
                $('#vehiculo').parents('.form-group').addClass('has-error');
              }
              
              if($('#vehiculo-error').length>0)
              {
                $('#vehiculo-error').html(response.message);
              }
              else
              {
                $('#vehiculo').parents('.col-md-6').append("<span id='vehiculo-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_vehiculo = parseInt($('#id_vehiculo').val());
            id_vehiculo = (id_vehiculo>0) ? (id_vehiculo) : ("0");
            var text = (id_vehiculo=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Vehículo se '+text+'.', 'success');
            limpform('form_save_vehiculo');
            $('#editvehiculo').modal('hide');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_vehiculo', function (e)
{
  limpform('form_save_vehiculo');
  $('#id_vehiculo').val('')
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpform('form_save_vehiculo');
  $('#editvehiculo').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_vehiculos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_vehiculos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_vehiculos(page);
});

function buscar_vehiculos(page)
{
  var marca_busc = $('#marca_busc').val();
  var modelo_busc = $('#modelo_busc').val();
  var placa_busc = $('#placa_busc').val();
  var temp = "page="+page;
  if(marca_busc.trim().length)
  {
    temp=temp+'&marca_busc='+marca_busc;
  }
  if(modelo_busc.trim().length)
  {
    temp=temp+'&modelo_busc='+modelo_busc;
  }
  if(placa_busc.trim().length)
  {
    temp=temp+'&placa_busc='+placa_busc;
  }
  $.ajax({
    url: $('base').attr('href') + 'vehiculo/buscar_vehiculos',
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
  var idvehiculo = $(this).parents('tr').attr('idvehiculo');
  $.ajax({
    url: $('base').attr('href') + 'vehiculo/edit',
    type: 'POST',
    data: 'id_vehiculo='+idvehiculo,
    dataType: "json",
    beforeSend: function() {
      limpform('form_save_vehiculo');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_vehiculo').val(response.data.id_vehiculo);
        $('#placa').val(response.data.placa);
        $('#marca').val(response.data.marca);
        $('#modelo').val(response.data.modelo);

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
  var idvehiculo = $(this).parents('tr').attr('idvehiculo');
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
        url: $('base').attr('href') + 'vehiculo/save_vehiculo',
        type: 'POST',
        data: 'id_vehiculo='+idvehiculo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_vehiculos(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpform('form_save_vehiculo');
        }
      });
    }
  });    
});
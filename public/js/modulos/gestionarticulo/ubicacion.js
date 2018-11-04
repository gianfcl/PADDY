$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_ubicacion').validate({
      rules:
      {
        id_zona:{ required:true },
        id_area:{ required:true },
        ubicacion:{ 
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'ubicacion/validar_ac',
            type: "post",
            data: {
              ubicacion: function() { return $( "#ubicacion" ).val(); },
              id_zona: function() { return $('#id_area').val(); },
              id_area: function() { return $('#id_area').val(); },
              id_ubicacion: function() { return $('#id_ubicacion').val(); }
            }
          } 
        }
      },
      messages: 
      {
        id_zona:{ required:"Zona" },
        id_area:{ required:"Área " },
        ubicacion:{ required:"ubicación", minlength: "Más de 2 Letras", remote:"Ya Existe" }
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
          url: $('base').attr('href') + 'ubicacion/save_ubicacion',
          type: 'POST',
          data: $('#form_save_ubicacion').serialize(),
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
              
              buscar_ubicacions(page);
              $('#editubicacion').modal('hide');
            }
            limpiarform();
          },
          complete: function() {
            var id_ubicacion = parseInt($('#id_ubicacion').val());
            id_ubicacion = (id_ubicacion>0) ? (id_ubicacion) : ("0");
            var text = (id_ubicacion=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta Ubicación se '+text+'.', 'success');
            limpiarform();
          }
        });/**/
      }
    });

    $(".select2_single1").select2({
      placeholder: "Seleccion zona",
      allowClear: true,
      width: 'resolve'
    });

    var $eventLog1 = $(".js-event-log1");
    var $eventSelect1 = $(".js-example-events1");
     
    $eventSelect1.on("select2:open", 
      function (e) {}
    );

    $eventSelect1.on("select2:close", 
      function (e) {  
        if($('#id_zona-error').length>0) { 
          $('#id_zona-error').html("zona");
        }
        $("#id_area").html("").trigger("change");
      }
    );

    $eventSelect1.on("select2:select", 
      function (e) {
        var padre = $('#id_zona-error');
        if(padre.length>0) { 
          padre.html("");
          if(padre.closest('.form-group').attr('class')=="form-group has-error") {
            padre.closest('.form-group').removeClass('has-error');
          }
        }

        $.ajax({
          url: $('base').attr('href') + 'area/cbox_area',
          type: 'POST',
          data: 'id_zona='+e.params.data.id,
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {
                $("#id_area").html("").trigger("change");
                $("#id_area").html(response.data).trigger("change");

                if($('#id_area-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
                {
                  $('#id_area-error').parents('.col-md-6').removeClass('has-error');
                }
                
                if($('#id_area-error').length>0)
                {
                  $('#id_area-error').html("");    
                  $('#id_area-error').parents('.form-group').removeClass('has-error');
                }
              }
          },
          complete: function() {
              //hideLoader();
          }
        });
      }
    );

    $(".select2_single").select2({
      placeholder: "Seleccione Familia",
      allowClear: true,
      width: 'resolve'
    });

    var $eventLog = $(".js-event-log");
    var $eventSelect = $(".js-example-events");
     
    $eventSelect.on("select2:open", 
      function (e) {}
    );

    $eventSelect.on("select2:close",
      function (e) {
        if($('#id_area-error').length>0) { 
          $('#id_area-error').html("area");
        }  
      }
    );

    $eventSelect.on("select2:select",
      function (e) {
        var padr = $('#id_area-error');
        if(padr.length>0) { 
          padr.html("");
          if(padr.closest('.form-group').attr('class')=="form-group has-error") {
            padr.closest('.form-group').removeClass('has-error');
          }
        }
      }
    );

  $( "#unidad_medida" ).autocomplete({
    serviceUrl: $('base').attr('href')+"unidadmedidacosto/get_unidadmedidacosto",
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_unidadmedidacosto').val(suggestion.id_unidadmedidacosto);
      if($('#id_unidadmedida_base-error').length>0)
      {
        if($('#id_unidadmedida_base-error').attr('class')=="help-block")
        {
          $('#id_unidadmedida_base-error').remove();
        }
      }
    }
  });

});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_ubicacion', function (e)
{
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  $('#editubicacion').modal('hide');
  limpiarform();
});

function limpiarform()
{
  $('#id_ubicacion').val('0');
  $('#id_area').val('');
  $('#id_zona').val('');
  $('#ubicacion').val('');
  $('#id_unidadmedidacosto').val('');
  $('#unidad_medida').val('');
  
  if($('#ubicacion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#ubicacion').parents('.form-group').removeClass('has-error');
  }
  
  if($('#ubicacion-error').length>0)
  {
    $('#ubicacion-error').html("");    
    $('#ubicacion-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_area').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_area').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_area-error').length>0)
  {
    $('#id_area-error').html("");
    $('#id_area-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_zona').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_zona').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_zona-error').length>0)
  {
    $('#id_zona-error').html("");
    $('#id_zona-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_ubicacion" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_ubicacions(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_ubicacions(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_ubicacions(page);
});

function buscar_ubicacions(page)
{
  var eeubicacion = $('#eeubicacion').val();
  var eezona = $('#eezona').val();
  var eearea = $('#eearea').val();
  var codigo = $('#codigo').val(); 
  var temp = "page="+page;
  
  if(codigo.trim().length)
  {
    temp=temp+'&codigo='+codigo;
  }

  if(eeubicacion.trim().length)
  {
    temp=temp+'&eeubicacion='+eeubicacion;
  }

  if(eezona.trim().length)
  {
    temp=temp+'&eezona='+eezona;
  }

  if(eearea.trim().length)
  {
    temp=temp+'&eearea='+eearea;
  }  
  
  $.ajax({
    url: $('base').attr('href') + 'ubicacion/buscar_ubicacion',
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
        limpiarform();
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
}

$(document).on('click', '.edit', function (e) {
  var idubicacion = $(this).parents('tr').attr('idubicacion');
  $.ajax({
    url: $('base').attr('href') + 'ubicacion/edit',
    type: 'POST',
    data: 'id_ubicacion='+idubicacion,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_ubicacion').val(response.data.id_ubicacion);
        $('#ubicacion').val(response.data.ubicacion);

        $('#id_area').val(response.data.id_area);
        $('select#id_area').val(response.data.id_area);
        $('select#id_area').trigger('change.select2');

        $('#id_zona').val(response.data.id_zona);
        $('select#id_zona').val(response.data.id_zona);
        $('select#id_zona').trigger('change.select2');

        var id_area = parseInt(response.data.id_area);
        if(id_area>0)
        {
          $('#id_area').html(response.data.area);
          $('select#id_area').val(response.data.id_area);
          $('select#id_area').trigger('change.select2');
        }

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);
        $('#unidad_medida').val(response.data.unidad_medida);
        $('#id_unidadmedidacosto').val(response.data.id_unidadmedidacosto);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#ubicacion').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#ubicacion').parents('.form-group').removeClass('has-error');
        }

        if($('#ubicacion-error').length>0)
        {
          $('#ubicacion-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idubicacion = parseInt($(this).parents('tr').attr('idubicacion'));
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Ubicación";
  if(idubicacion>0)
  {
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
          url: $('base').attr('href') + 'ubicacion/delete',
          type: 'POST',
          data: 'id_ubicacion='+idubicacion,
          dataType: "json",
          beforeSend: function() {
            //showLoader();
          },
          success: function(response) {
            if (response.code==1) {              
              buscar_ubicacions(page);
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
  }
       
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});
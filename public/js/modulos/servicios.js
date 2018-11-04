$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_servicios').validate({
      rules:
      {
        id_gruposervicios:{ required:true },
        id_familiaservicios:{ required:true },
        servicios:{ 
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'servicios/validar_ac',
            type: "post",
            data: {
              servicios: function() { return $( "#servicios" ).val(); },
              id_gruposervicios: function() { return $('#id_familiaservicios').val(); },
              id_familiaservicios: function() { return $('#id_familiaservicios').val(); },
              id_servicios: function() { return $('#id_servicios').val(); }
            }
          } 
        }
      },
      messages: 
      {
        id_gruposervicios:{ required:"Grupo Servicios" },
        id_familiaservicios:{ required:"Familia Servicios" },
        servicios:{ required:"Elemento Costo", minlength: "Más de 2 Letras", remote:"Ya Existe" }
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
          url: $('base').attr('href') + 'servicios/save_servicios',
          type: 'POST',
          data: $('#form_save_servicios').serialize(),
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
              
              buscar_servicioss(page);
              $('#editservicios').modal('hide');
            }
            limpiarform();
          },
          complete: function() {
            var id_servicios = parseInt($('#id_servicios').val());
            id_servicios = (id_servicios>0) ? (id_servicios) : ("0");
            var text = (id_servicios=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta familiaservicios se '+text+'.', 'success');
            limpiarform();
          }
        });/**/
      }
    });

    $(".select2_single1").select2({
      placeholder: "Seleccion Grupo",
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
        if($('#id_gruposervicios-error').length>0) { 
          $('#id_gruposervicios-error').html("Grupo Servicios");
        }
        $("#id_familiaservicios").html("").trigger("change");
      }
    );

    $eventSelect1.on("select2:select", 
      function (e) {
        var padre = $('#id_gruposervicios-error');
        if(padre.length>0) { 
          padre.html("");
          if(padre.closest('.form-group').attr('class')=="form-group has-error") {
            padre.closest('.form-group').removeClass('has-error');
          }
        }

        $.ajax({
          url: $('base').attr('href') + 'familiaservicios/combox_familiaservicios',
          type: 'POST',
          data: 'id_gruposervicios='+e.params.data.id,
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {
                $("#id_familiaservicios").html("").trigger("change");
                $("#id_familiaservicios").html(response.data).trigger("change");

                if($('#id_familiaservicios-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
                {
                  $('#id_familiaservicios-error').parents('.col-md-6').removeClass('has-error');
                }
                
                if($('#id_familiaservicios-error').length>0)
                {
                  $('#id_familiaservicios-error').html("");    
                  $('#id_familiaservicios-error').parents('.form-group').removeClass('has-error');
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
        if($('#id_familiaservicios-error').length>0) { 
          $('#id_familiaservicios-error').html("Familia Servicios");
        }  
      }
    );

    $eventSelect.on("select2:select",
      function (e) {
        var padr = $('#id_familiaservicios-error');
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

$(document).on('click', '.add_servicios', function (e)
{
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  $('#editservicios').modal('hide');
  limpiarform();
});

function limpiarform()
{
  $('#id_servicios').val('0');
  $('#id_familiaservicios').val('');
  $('#id_gruposervicios').val('');
  $('#servicios').val('');
  $('#id_unidadmedidacosto').val('');
  $('#unidad_medida').val('');
  
  $("select").val("").trigger("change");

  if($('#servicios').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#servicios').parents('.form-group').removeClass('has-error');
  }
  
  if($('#servicios-error').length>0)
  {
    $('#servicios-error').html("");    
    $('#servicios-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_familiaservicios').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_familiaservicios').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_familiaservicios-error').length>0)
  {
    $('#id_familiaservicios-error').html("");
    $('#id_familiaservicios-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_gruposervicios').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_gruposervicios').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_gruposervicios-error').length>0)
  {
    $('#id_gruposervicios-error').html("");
    $('#id_gruposervicios-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_servicios" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_servicioss(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_servicioss(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_servicioss(page);
});

function buscar_servicioss(page)
{
  var elmcosto = $('#elmcosto').val();
  var elemgrupo = $('#elemgrupo').val();
  var elemfamilia = $('#elemfamilia').val();
  var elmcodigo = $('#elmcodigo').val(); 
  var temp = "page="+page;
  
  if(elmcodigo.trim().length)
  {
    temp=temp+'&elmcodigo='+elmcodigo;
  }

  if(elmcosto.trim().length)
  {
    temp=temp+'&elmcosto='+elmcosto;
  }

  if(elemgrupo.trim().length)
  {
    temp=temp+'&elemgrupo='+elemgrupo;
  }

  if(elemfamilia.trim().length)
  {
    temp=temp+'&elemfamilia='+elemfamilia;
  }  
  
  $.ajax({
    url: $('base').attr('href') + 'servicios/buscar_servicios',
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
  var idservicios = $(this).parents('tr').attr('idservicios');
  $.ajax({
    url: $('base').attr('href') + 'servicios/edit',
    type: 'POST',
    data: 'id_servicios='+idservicios,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_servicios').val(response.data.id_servicios);
        $('#servicios').val(response.data.servicios);

        $('#id_familiaservicios').val(response.data.id_familiaservicios);
        $('select#id_familiaservicios').val(response.data.id_familiaservicios);
        $('select#id_familiaservicios').trigger('change.select2');

        $('#id_gruposervicios').val(response.data.id_gruposervicios);
        $('select#id_gruposervicios').val(response.data.id_gruposervicios);
        $('select#id_gruposervicios').trigger('change.select2');

        var id_familiaservicios = parseInt(response.data.id_familiaservicios);
        if(id_familiaservicios>0)
        {
          $('#id_familiaservicios').html(response.data.familiaservicios);
          $('select#id_familiaservicios').val(response.data.id_familiaservicios);
          $('select#id_familiaservicios').trigger('change.select2');
        }

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);
        $('#unidad_medida').val(response.data.unidad_medida);
        $('#id_unidadmedidacosto').val(response.data.id_unidadmedidacosto);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#servicios').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#servicios').parents('.form-group').removeClass('has-error');
        }

        if($('#servicios-error').length>0)
        {
          $('#servicios-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idservicios = parseInt($(this).parents('tr').attr('idservicios'));
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "servicios";
  if(idservicios>0)
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
          url: $('base').attr('href') + 'servicios/delete',
          type: 'POST',
          data: 'id_servicios='+idservicios,
          dataType: "json",
          beforeSend: function() {
            //showLoader();
          },
          success: function(response) {
            if (response.code==1) {              
              buscar_servicioss(page);
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
$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_subfamiliaaf').validate({
      rules:
      {
        id_grupoaf:{ required:true },
        id_familiaaf:{ required:true },
        subfamiliaaf:{ 
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'subfamiliaaf/validar_ac',
            type: "post",
            data: {
              subfamiliaaf: function() { return $( "#subfamiliaaf" ).val(); },
              id_grupoaf: function() { return $('#id_familiaaf').val(); },
              id_familiaaf: function() { return $('#id_familiaaf').val(); },
              id_subfamiliaaf: function() { return $('#id_subfamiliaaf').val(); }
            }
          } 
        }
      },
      messages: 
      {
        id_grupoaf:{ required:"grupoaf" },
        id_familiaaf:{ required:"familiaaf " },
        subfamiliaaf:{ required:"Sub familiaaf", minlength: "Más de 2 Letras", remote:"Ya Existe" }
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
          url: $('base').attr('href') + 'subfamiliaaf/save_subfamiliaaf',
          type: 'POST',
          data: $('#form_save_subfamiliaaf').serialize(),
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
              
              buscar_subfamiliaafs(page);
              $('#editsubfamiliaaf').modal('hide');
            }
            limpiarform();
          },
          complete: function() {
            var id_subfamiliaaf = parseInt($('#id_subfamiliaaf').val());
            id_subfamiliaaf = (id_subfamiliaaf>0) ? (id_subfamiliaaf) : ("0");
            var text = (id_subfamiliaaf=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta familiaaf se '+text+'.', 'success');
            limpiarform();
          }
        });/**/
      }
    });

    $(".select2_single1").select2({
      placeholder: "Seleccion grupoaf",
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
        if($('#id_grupoaf-error').length>0) { 
          $('#id_grupoaf-error').html("grupoaf");
        }
        $("#id_familiaaf").html("").trigger("change");
      }
    );

    $eventSelect1.on("select2:select", 
      function (e) {
        var padre = $('#id_grupoaf-error');
        if(padre.length>0) { 
          padre.html("");
          if(padre.closest('.form-group').attr('class')=="form-group has-error") {
            padre.closest('.form-group').removeClass('has-error');
          }
        }

        $.ajax({
          url: $('base').attr('href') + 'familiaaf/combox_familiaaf',
          type: 'POST',
          data: 'id_grupoaf='+e.params.data.id,
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {
                $("#id_familiaaf").html("").trigger("change");
                $("#id_familiaaf").html(response.data).trigger("change");

                if($('#id_familiaaf-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
                {
                  $('#id_familiaaf-error').parents('.col-md-6').removeClass('has-error');
                }
                
                if($('#id_familiaaf-error').length>0)
                {
                  $('#id_familiaaf-error').html("");    
                  $('#id_familiaaf-error').parents('.form-group').removeClass('has-error');
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
      placeholder: "Seleccione familiaaf",
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
        if($('#id_familiaaf-error').length>0) { 
          $('#id_familiaaf-error').html("familiaaf");
        }  
      }
    );

    $eventSelect.on("select2:select",
      function (e) {
        var padr = $('#id_familiaaf-error');
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

$(document).on('click', '.add_subfamiliaaf', function (e)
{
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  $('#editsubfamiliaaf').modal('hide');
  limpiarform();
});

function limpiarform()
{
  $('#id_subfamiliaaf').val('0');
  $('#id_familiaaf').val('');
  $('#id_grupoaf').val('');
  $('#subfamiliaaf').val('');
  $('#id_unidadmedidacosto').val('');
  $('#unidad_medida').val('');
  
  $("select").val("").trigger("change");

  if($('#subfamiliaaf').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#subfamiliaaf').parents('.form-group').removeClass('has-error');
  }
  
  if($('#subfamiliaaf-error').length>0)
  {
    $('#subfamiliaaf-error').html("");    
    $('#subfamiliaaf-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_familiaaf').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_familiaaf').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_familiaaf-error').length>0)
  {
    $('#id_familiaaf-error').html("");
    $('#id_familiaaf-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_grupoaf').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_grupoaf').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_grupoaf-error').length>0)
  {
    $('#id_grupoaf-error').html("");
    $('#id_grupoaf-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_subfamiliaaf" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_subfamiliaafs(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_subfamiliaafs(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_subfamiliaafs(page);
});

function buscar_subfamiliaafs(page)
{
  var eesubfamiliaaf = $('#eesubfamiliaaf').val();
  var eegrupoaf = $('#eegrupoaf').val();
  var eefamiliaaf = $('#eefamiliaaf').val();
  var codigo = $('#codigo').val(); 
  var temp = "page="+page;
  
  if(codigo.trim().length)
  {
    temp=temp+'&codigo='+codigo;
  }

  if(eesubfamiliaaf.trim().length)
  {
    temp=temp+'&eesubfamiliaaf='+eesubfamiliaaf;
  }

  if(eegrupoaf.trim().length)
  {
    temp=temp+'&eegrupoaf='+eegrupoaf;
  }

  if(eefamiliaaf.trim().length)
  {
    temp=temp+'&eefamiliaaf='+eefamiliaaf;
  }  
  
  $.ajax({
    url: $('base').attr('href') + 'subfamiliaaf/buscar_subfamiliaaf',
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
  var idsubfamiliaaf = $(this).parents('tr').attr('idsubfamiliaaf');
  $.ajax({
    url: $('base').attr('href') + 'subfamiliaaf/edit',
    type: 'POST',
    data: 'id_subfamiliaaf='+idsubfamiliaaf,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_subfamiliaaf').val(response.data.id_subfamiliaaf);
        $('#subfamiliaaf').val(response.data.subfamiliaaf);

        $('#id_familiaaf').val(response.data.id_familiaaf);
        $('select#id_familiaaf').val(response.data.id_familiaaf);
        $('select#id_familiaaf').trigger('change.select2');

        $('#id_grupoaf').val(response.data.id_grupoaf);
        $('select#id_grupoaf').val(response.data.id_grupoaf);
        $('select#id_grupoaf').trigger('change.select2');

        var id_familiaaf = parseInt(response.data.id_familiaaf);
        if(id_familiaaf>0)
        {
          $('#id_familiaaf').html(response.data.familiaaf);
          $('select#id_familiaaf').val(response.data.id_familiaaf);
          $('select#id_familiaaf').trigger('change.select2');
        }

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);
        $('#unidad_medida').val(response.data.unidad_medida);
        $('#id_unidadmedidacosto').val(response.data.id_unidadmedidacosto);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#subfamiliaaf').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#subfamiliaaf').parents('.form-group').removeClass('has-error');
        }

        if($('#subfamiliaaf-error').length>0)
        {
          $('#subfamiliaaf-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idsubfamiliaaf = parseInt($(this).parents('tr').attr('idsubfamiliaaf'));
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "subfamiliaaf";
  if(idsubfamiliaaf>0)
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
          url: $('base').attr('href') + 'subfamiliaaf/delete',
          type: 'POST',
          data: 'id_subfamiliaaf='+idsubfamiliaaf,
          dataType: "json",
          beforeSend: function() {
            //showLoader();
          },
          success: function(response) {
            if (response.code==1) {              
              buscar_subfamiliaafs(page);
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
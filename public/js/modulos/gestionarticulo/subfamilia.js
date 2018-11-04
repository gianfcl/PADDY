$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_subfamilia').validate({
      rules:
      {
        id_grupo:{ required:true },
        id_familia:{ required:true },
        subfamilia:{ 
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'subfamilia/validar_ac',
            type: "post",
            data: {
              subfamilia: function() { return $( "#subfamilia" ).val(); },
              id_grupo: function() { return $('#id_familia').val(); },
              id_familia: function() { return $('#id_familia').val(); },
              id_subfamilia: function() { return $('#id_subfamilia').val(); }
            }
          } 
        }
      },
      messages: 
      {
        id_grupo:{ required:"Grupo" },
        id_familia:{ required:"Familia " },
        subfamilia:{ required:"Sub Familia", minlength: "Más de 2 Letras", remote:"Ya Existe" }
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
          url: $('base').attr('href') + 'subfamilia/save_subfamilia',
          type: 'POST',
          data: $('#form_save_subfamilia').serialize(),
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
              
              buscar_subfamilias(page);
              $('#editsubfamilia').modal('hide');
            }
            limpiarform();
          },
          complete: function() {
            var id_subfamilia = parseInt($('#id_subfamilia').val());
            id_subfamilia = (id_subfamilia>0) ? (id_subfamilia) : ("0");
            var text = (id_subfamilia=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta familia se '+text+'.', 'success');
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
        if($('#id_grupo-error').length>0) { 
          $('#id_grupo-error').html("Grupo");
        }
        $("#id_familia").html("").trigger("change");
      }
    );

    $eventSelect1.on("select2:select", 
      function (e) {
        var padre = $('#id_grupo-error');
        if(padre.length>0) { 
          padre.html("");
          if(padre.closest('.form-group').attr('class')=="form-group has-error") {
            padre.closest('.form-group').removeClass('has-error');
          }
        }

        $.ajax({
          url: $('base').attr('href') + 'familia/combox_familia',
          type: 'POST',
          data: 'id_grupo='+e.params.data.id,
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {
                $("#id_familia").html("").trigger("change");
                $("#id_familia").html(response.data).trigger("change");

                if($('#id_familia-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
                {
                  $('#id_familia-error').parents('.col-md-6').removeClass('has-error');
                }
                
                if($('#id_familia-error').length>0)
                {
                  $('#id_familia-error').html("");    
                  $('#id_familia-error').parents('.form-group').removeClass('has-error');
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
        if($('#id_familia-error').length>0) { 
          $('#id_familia-error').html("Familia");
        }  
      }
    );

    $eventSelect.on("select2:select",
      function (e) {
        var padr = $('#id_familia-error');
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

$(document).on('click', '.add_subfamilia', function (e)
{
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  $('#editsubfamilia').modal('hide');
  limpiarform();
});

function limpiarform()
{
  $('#id_subfamilia').val('0');
  $('#id_familia').val('');
  $('#id_grupo').val('');
  $('#subfamilia').val('');
  $('#id_unidadmedidacosto').val('');
  $('#unidad_medida').val('');
  
  $("select").val("").trigger("change");

  if($('#subfamilia').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#subfamilia').parents('.form-group').removeClass('has-error');
  }
  
  if($('#subfamilia-error').length>0)
  {
    $('#subfamilia-error').html("");    
    $('#subfamilia-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_familia').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_familia').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_familia-error').length>0)
  {
    $('#id_familia-error').html("");
    $('#id_familia-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_grupo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_grupo').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_grupo-error').length>0)
  {
    $('#id_grupo-error').html("");
    $('#id_grupo-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_subfamilia" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_subfamilias(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_subfamilias(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_subfamilias(page);
});

function buscar_subfamilias(page)
{
  var eesubfamilia = $('#eesubfamilia').val();
  var eegrupo = $('#eegrupo').val();
  var eefamilia = $('#eefamilia').val();
  var codigo = $('#codigo').val(); 
  var temp = "page="+page;
  
  if(codigo.trim().length)
  {
    temp=temp+'&codigo='+codigo;
  }

  if(eesubfamilia.trim().length)
  {
    temp=temp+'&eesubfamilia='+eesubfamilia;
  }

  if(eegrupo.trim().length)
  {
    temp=temp+'&eegrupo='+eegrupo;
  }

  if(eefamilia.trim().length)
  {
    temp=temp+'&eefamilia='+eefamilia;
  }  
  
  $.ajax({
    url: $('base').attr('href') + 'subfamilia/buscar_subfamilia',
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
  var idsubfamilia = $(this).parents('tr').attr('idsubfamilia');
  $.ajax({
    url: $('base').attr('href') + 'subfamilia/edit',
    type: 'POST',
    data: 'id_subfamilia='+idsubfamilia,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_subfamilia').val(response.data.id_subfamilia);
        $('#subfamilia').val(response.data.subfamilia);

        $('#id_familia').val(response.data.id_familia);
        $('select#id_familia').val(response.data.id_familia);
        $('select#id_familia').trigger('change.select2');

        $('#id_grupo').val(response.data.id_grupo);
        $('select#id_grupo').val(response.data.id_grupo);
        $('select#id_grupo').trigger('change.select2');

        var id_familia = parseInt(response.data.id_familia);
        if(id_familia>0)
        {
          $('#id_familia').html(response.data.familia);
          $('select#id_familia').val(response.data.id_familia);
          $('select#id_familia').trigger('change.select2');
        }

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);
        $('#unidad_medida').val(response.data.unidad_medida);
        $('#id_unidadmedidacosto').val(response.data.id_unidadmedidacosto);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#subfamilia').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#subfamilia').parents('.form-group').removeClass('has-error');
        }

        if($('#subfamilia-error').length>0)
        {
          $('#subfamilia-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idsubfamilia = parseInt($(this).parents('tr').attr('idsubfamilia'));
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "subfamilia";
  if(idsubfamilia>0)
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
          url: $('base').attr('href') + 'subfamilia/delete',
          type: 'POST',
          data: 'id_subfamilia='+idsubfamilia,
          dataType: "json",
          beforeSend: function() {
            //showLoader();
          },
          success: function(response) {
            if (response.code==1) {              
              buscar_subfamilias(page);
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
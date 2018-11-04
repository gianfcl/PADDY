$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_actividades').validate({
      rules:
      {
        id_centrocosto:{ required:true },
        id_areacosto:{ required:true },
        actividades:{ 
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'actividades/validar_ac',
            type: "post",
            data: {
              actividades: function() { return $( "#actividades" ).val(); },
              id_centrocosto: function() { return $('#id_centrocosto').val(); },
              id_areacosto: function() { return $('#id_areacosto').val(); },
              id_actividades: function() { return $('#id_actividades').val(); }
            }
          } 
        }
      },
      messages: 
      {
        id_centrocosto:{ required:"Centro de Costos" },
        id_areacosto:{ required:"Área de Costos" },
        actividades:{ required:"Actividades", minlength: "Más de 2 Letras", remote:"Ya Existe" }
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
          url: $('base').attr('href') + 'actividades/save_actividades',
          type: 'POST',
          data: $('#form_save_actividades').serialize(),
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
              
              buscar_actividadess(page);
              $('#editactividades').modal('hide');
            }
            limpiarforu('form_save_actividades');
          },
          complete: function() {
            var id_actividades = parseInt($('#id_actividades').val());
            id_actividades = (id_actividades>0) ? (id_actividades) : ("0");
            var text = (id_actividades=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta areacosto se '+text+'.', 'success');
            //limpiarforu();
          }
        });/**/
      }
    });

    $(".select2_single1").select2({
      placeholder: "Seleccion Centro",
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
        if($('#id_centrocosto-error').length>0) { 
          $('#id_centrocosto-error').html("Centro de Costos");
        }
        $("#id_areacosto").html("").trigger("change");
      }
    );

    $eventSelect1.on("select2:select", 
      function (e) {
        var padre = $('#id_centrocosto-error');
        if(padre.length>0) { 
          padre.html("");
          if(padre.closest('.form-group').attr('class')=="form-group has-error") {
            padre.closest('.form-group').removeClass('has-error');
          }
        }

        $.ajax({
          url: $('base').attr('href') + 'areacosto/combox_areacosto',
          type: 'POST',
          data: 'id_centrocosto='+e.params.data.id,
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {
                $("#id_areacosto").html("").trigger("change");
                $("#id_areacosto").html(response.data).trigger("change");

                if($('#id_areacosto-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
                {
                  $('#id_areacosto-error').parents('.col-md-6').removeClass('has-error');
                }
                
                if($('#id_areacosto-error').length>0)
                {
                  $('#id_areacosto-error').html("");    
                  $('#id_areacosto-error').parents('.form-group').removeClass('has-error');
                }
              }
          },
          complete: function() {
              //hideLoader();
          }
        });
      }
    );

    $("#id_areacosto").select2({
      placeholder: "Seleccione Área",
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
        if($('#id_areacosto-error').length>0) { 
          $('#id_areacosto-error').html("Área de Costos");
        }  
      }
    );

    $eventSelect.on("select2:select",
      function (e) {
        var padr = $('#id_areacosto-error');
        if(padr.length>0) { 
          padr.html("");
          if(padr.closest('.form-group').attr('class')=="form-group has-error") {
            padr.closest('.form-group').removeClass('has-error');
          }
        }
      }
    );

});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_actividades', function (e)
{
  limpiarforu('form_save_actividades');
});

$(document).on('click', '.btn_limpiar', function (e) {
  $('#editactividades').modal('hide');
  limpiarforu('form_save_actividades');
});

function limpiarforu(form = '')
{
  if(form.trim().length)
  {
    $('#'+form+' input').each(function (index, value){
      if($(this).attr('type')=="text")
      {
        if($(this).parents('.form-group').attr('class')=="form-group has-error")
        {
          $(this).parents('.form-group').removeClass('has-error');
        }
        $(this).val('');

        id = $(this).attr('id');
        if($('#'+id+'-error').length>0)
        {
          $('#'+id+'-error').html('');
        }
      }  

      if($(this).attr('type')=="hidden"){
        $(this).val('');
      }    
    });

    $('select#id_centrocosto').val('');
    $('select#id_centrocosto').trigger('change.select2');

    $('select#id_areacosto').html('');
    $('select#id_areacosto').val('');
    $('select#id_areacosto').trigger('change.select2');
    
    $('#para_producir').prop('checked', false);

    $('#estado label').removeClass('active');
    $('#estado input').prop('checked', false);
    
    $('#estado #estado_1').prop('checked', true);
    $('#estado #estado_1').parent('label').addClass('active');

    var validatore = $( "#"+form ).validate();
    validatore.resetForm();
  }    
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_actividadess(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_actividadess(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_actividadess(page);
});

function buscar_actividadess(page)
{
  var elmactividades = $('#elmactividades').val();
  var elmcentrocosto = $('#elemcentrocosto').val();
  var elmareacosto = $('#elemareacosto').val();
  var elmcodigo = $('#elmcodigo').val(); 
  var temp = "page="+page;
  
  if(elmcodigo.trim().length)
  {
    temp=temp+'&elmcodigo='+elmcodigo;
  }

  if(elmactividades.trim().length)
  {
    temp=temp+'&elmactividades='+elmactividades;
  }

  if(elmcentrocosto.trim().length)
  {
    temp=temp+'&centrocosto='+elmcentrocosto;
  }

  if(elmareacosto.trim().length)
  {
    temp=temp+'&elmareacosto='+elmareacosto;
  }  
  
  $.ajax({
    url: $('base').attr('href') + 'actividades/buscar_actividades',
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
        limpiarforu();
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
}

$(document).on('click', '.edit', function (e) {
  var idactividades = $(this).parents('tr').attr('idactividades');
  $.ajax({
    url: $('base').attr('href') + 'actividades/edit',
    type: 'POST',
    data: 'id_actividades='+idactividades,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_actividades').val(response.data.id_actividades);
        $('#actividades').val(response.data.actividades);

        $('#id_areacosto').val(response.data.id_areacosto);
        $('select#id_areacosto').val(response.data.id_areacosto);
        $('select#id_areacosto').trigger('change.select2');

        $('#id_centrocosto').val(response.data.id_centrocosto);
        $('select#id_centrocosto').val(response.data.id_centrocosto);
        $('select#id_centrocosto').trigger('change.select2');

        var id_areacosto = parseInt(response.data.id_areacosto);
        if(id_areacosto>0)
        {
          $('#id_areacosto').html(response.data.areacosto);
          $('select#id_areacosto').val(response.data.id_areacosto);
          $('select#id_areacosto').trigger('change.select2');
        }

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);
        $('#unidad_medida').val(response.data.unidad_medida);
        $('#id_unidadmedidacosto').val(response.data.id_unidadmedidacosto);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        var es = parseInt(response.data.para_producir);
        var es_va = (es==2) ? (true) : (false);
        $('#para_producir').prop('checked', es_va);
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idactividades = parseInt($(this).parents('tr').attr('idactividades'));
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "actividades";
  if(idactividades>0)
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
          url: $('base').attr('href') + 'actividades/delete',
          type: 'POST',
          data: 'id_actividades='+idactividades,
          dataType: "json",
          beforeSend: function() {
            //showLoader();
          },
          success: function(response) {
            if (response.code==1) {              
              buscar_actividadess(page);
            }
          },
          complete: function() {
            var text = "Elimino!";
            alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
            limpiarforu();
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
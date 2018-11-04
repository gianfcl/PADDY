$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_areacosto').validate({
        rules:
        {
          id_centrocosto:{ required:true },
          areacosto:{ 
            required:true, 
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'areacosto/validar_ac',
              type: "post",
              data: {
                areacosto: function() { return $( "#areacosto" ).val(); },
                id_centrocosto: function() { return $('#id_centrocosto').val(); },
                id_areacosto: function() { return $('#id_areacosto').val(); }
              }
            } 
          }
        },
        messages: 
        {
          id_centrocosto:{ required:"Seleccione Centro de Costo" },
          areacosto:{ required:"Ingresar Área de Costo", minlength: "Más de 2 Letras", remote:"Ya Existe" }
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
                url: $('base').attr('href') + 'areacosto/save_areacosto',
                type: 'POST',
                data: $('#form_save_areacosto').serialize(),
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
                      
                      buscar_areacostos(page);
                      $('#editareacosto').modal('hide');
                    }
                    limpiarformu('form_save_areacosto');
                },
                complete: function() {
                  var id_areacosto = parseInt($('#id_areacosto').val());
                  id_areacosto = (id_areacosto>0) ? (id_areacosto) : ("0");
                  var text = (id_areacosto=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta centrocosto se '+text+'.', 'success');
                  limpiarformu('form_save_areacosto');
                }
            });/**/
        }
    });
    $(".select2_multiple").select2({
      maximumSelectionLength: 6,
      placeholder: "Maximo 6",
      allowClear: true
    });

    $(".select2_single").select2({
      placeholder: "Seleccione centrocosto",
      allowClear: true,
      width: 'resolve'
    });

    var $eventLog = $(".js-event-log");
    var $eventSelect = $(".js-example-events");
     
    $eventSelect.on("select2:open", function (e) { console.log("select2:open", e); });
    $eventSelect.on("select2:close", function (e) {  if($('#id_centrocosto-error').length>0) { $('#id_centrocosto-error').html("Seleccione centrocosto");}  });
    $eventSelect.on("select2:select", function (e) { if($('#id_centrocosto-error').length>0) { $('#id_centrocosto-error').html(""); }});
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_areacosto', function (e)
{
    limpiarformu('form_save_areacosto');
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarformu('form_save_areacosto');
    $('#editareacosto').modal('hide');
});

function limpiarformu(form)
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

  $("#id_centrocosto").val("").trigger("change");

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  
  var validatore = $( "#"+form ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_areacostos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_areacostos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_areacostos(page);
});

function buscar_areacostos(page)
{
  var um_busc = $('#um_busc').val();
  var um_busc1 = $('#um_busc1').val();
  
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }

  if(um_busc1.trim().length)
  {
    temp=temp+'&um_busc1='+um_busc1;
  }

  var idform = ifrome();
  if(idform != "-")
  {
    temp=temp+'&idestados='+idform;
  }
  
  $.ajax({
      url: $('base').attr('href') + 'areacosto/buscar_areacosto',
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
            limpiarformu('form_save_areacosto');
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
}

$(document).on('click', '.edit', function (e) {
  var idareacosto = $(this).parents('tr').attr('idareacosto');
  $.ajax({
    url: $('base').attr('href') + 'areacosto/edit',
    type: 'POST',
    data: 'id_areacosto='+idareacosto,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_areacosto').val(response.data.id_areacosto);
        $('#areacosto').val(response.data.areacosto);
        $('#id_centrocosto').val(response.data.id_centrocosto);
        $('select#id_centrocosto').val(response.data.id_centrocosto);
        $('select#id_centrocosto').trigger('change.select2');

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idareacosto = $(this).parents('tr').attr('idareacosto');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "areacosto";
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
        url: $('base').attr('href') + 'areacosto/delete',
        type: 'POST',
        data: 'id_areacosto='+idareacosto,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_areacostos(page);
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpiarformu('form_save_areacosto');
        }
      });
    }
  });   
});
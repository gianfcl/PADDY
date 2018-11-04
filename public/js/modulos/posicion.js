$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_posicion').validate({
        rules:
        {
          id_areaposicion:{ required:true },
          posicion:{ 
            required:true, 
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'posicion/validar',
              type: "post",
              data: {
                posicion: function() { return $( "#posicion" ).val(); },
                id_areaposicion: function() { return $('#id_areaposicion').val(); },
                id_posicion: function() { return $('#id_posicion').val(); }
              }
            } 
          }       
        },
        messages: 
        {
          id_areaposicion:{ required:"Seleccione Área Posición" },
          posicion:{ required:"Ingresar Posición", minlength: "Más de 2 Letras", remote: "Ya existe" }
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
                url: $('base').attr('href') + 'posicion/save_posicion',
                type: 'POST',
                data: $('#form_save_posicion').serialize(),
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
                      
                      buscar_posicions(page);
                      $('#editposicion').modal('hide');
                    }
                    limpiarform();
                },
                complete: function() {
                  var id_posicion = parseInt($('#id_posicion').val());
                  id_posicion = (id_posicion>0) ? (id_posicion) : ("0");
                  var text = (id_posicion=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta areaposicion se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });

    $(".select2_single").select2({
      placeholder: "Seleccione areaposicion",
      allowClear: true,
      width: 'resolve'
    });

    var $eventLog = $(".js-event-log");
    var $eventSelect = $(".js-example-events");
     
    $eventSelect.on("select2:open", function (e) { console.log("select2:open", e); });
    $eventSelect.on("select2:close", function (e) {  if($('#id_areaposicion-error').length>0) { $('#id_areaposicion-error').html("Seleccione areaposicion");}  });
    $eventSelect.on("select2:select", function (e) { if($('#id_areaposicion-error').length>0) { $('#id_areaposicion-error').html(""); }});
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_posicion', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarform();
    $('#editposicion').modal('hide');
});

function limpiarform()
{
  $('#id_posicion').val('0');
  $('#id_areaposicion').val('');
  $('#posicion').val('');
  $("select").val("").trigger("change");

  if($('#posicion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#posicion').parents('.form-group').removeClass('has-error');
  }
  
  if($('#posicion-error').length>0)
  {
    $('#posicion-error').html("");    
    $('#posicion-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_areaposicion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_areaposicion').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_areaposicion-error').length>0)
  {
    $('#id_areaposicion-error').html("");
    $('#id_areaposicion-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_posicion" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_posicions(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_posicions(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_posicions(page);
});

function buscar_posicions(page)
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
  
  $.ajax({
      url: $('base').attr('href') + 'posicion/buscar_posicions',
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
  var idposicion = $(this).parents('tr').attr('idposicion');
  $.ajax({
    url: $('base').attr('href') + 'posicion/edit',
    type: 'POST',
    data: 'id_posicion='+idposicion,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_posicion').val(response.data.id_posicion);
        $('#posicion').val(response.data.posicion);
        $('#id_areaposicion').val(response.data.id_areaposicion);
        $('select#id_areaposicion').val(response.data.id_areaposicion);
        $('select#id_areaposicion').trigger('change.select2');

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#posicion').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#posicion').parents('.form-group').removeClass('has-error');
        }

        if($('#posicion-error').length>0)
        {
          $('#posicion-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idposicion = $(this).parents('tr').attr('idposicion');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "posicion";
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
        url: $('base').attr('href') + 'posicion/delete',
        type: 'POST',
        data: 'id_posicion='+idposicion,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_posicions(page);
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
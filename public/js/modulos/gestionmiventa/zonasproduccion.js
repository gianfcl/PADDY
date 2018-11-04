$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_zonasproduccion').validate({
        rules:
        {
          id_areasproduccion:{ required:true },
          zonasproduccion:{ required:true, minlength: 2 }       
        },
        messages: 
        {
          id_areasproduccion:{
            required:"Seleccione areasproduccion" },
          zonasproduccion:{ required:"Ingresar zonasproduccion", minlength: "Más de 2 Letras" }
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
                url: $('base').attr('href') + 'zonasproduccion/save_zonasproduccion',
                type: 'POST',
                data: $('#form_save_zonasproduccion').serialize(),
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
                      
                      buscar_zonasproducciones(page);
                      $('#editzonasproduccion').modal('hide');
                    }
                    limpiarform();
                },
                complete: function() {
                  var id_zonasproduccion = parseInt($('#id_zonasproduccion').val());
                  id_zonasproduccion = (id_zonasproduccion>0) ? (id_zonasproduccion) : ("0");
                  var text = (id_zonasproduccion=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta areasproduccion se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });

    $(".select2_single").select2({
      placeholder: "Seleccione areasproduccion",
      allowClear: true,
      width: 'resolve'
    });

    var $eventLog = $(".js-event-log");
    var $eventSelect = $(".js-example-events");
     
    $eventSelect.on("select2:open", function (e) { console.log("select2:open", e); });
    $eventSelect.on("select2:close", function (e) {  if($('#id_areasproduccion-error').length>0) { $('#id_areasproduccion-error').html("Seleccione areasproduccion");}  });
    $eventSelect.on("select2:select", function (e) { if($('#id_areasproduccion-error').length>0) { $('#id_areasproduccion-error').html(""); }});
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_zonasproducciones(0);
});

$(document).on('click', '.add_zonasproduccion', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarform();
    $('#editzonasproduccion').modal('hide');
});

function limpiarform()
{
  $('#id_zonasproduccion').val('0');
  $('#id_areasproduccion').val('');
  $('#zonasproduccion').val('');

  if($('#zonasproduccion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#zonasproduccion').parents('.form-group').removeClass('has-error');
  }
  
  if($('#zonasproduccion-error').length>0)
  {
    $('#zonasproduccion-error').html("");    
    $('#zonasproduccion-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_areasproduccion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_areasproduccion').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_areasproduccion-error').length>0)
  {
    $('#id_areasproduccion-error').html("");
    $('#id_areasproduccion-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_zonasproduccion" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_zonasproducciones(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_zonasproducciones(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_zonasproducciones(page);
});

function buscar_zonasproducciones(page)
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
      url: $('base').attr('href') + 'zonasproduccion/buscar_zonasproducciones',
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
  var idzonasproduccion = $(this).parents('tr').attr('idzonasproduccion');
  $.ajax({
    url: $('base').attr('href') + 'zonasproduccion/edit',
    type: 'POST',
    data: 'id_zonasproduccion='+idzonasproduccion,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_zonasproduccion').val(response.data.id_zonasproduccion);
        $('#zonasproduccion').val(response.data.zonasproduccion);
        $('#id_areasproduccion').val(response.data.id_areasproduccion);
        $('select#id_areasproduccion').val(response.data.id_areasproduccion);
        $('select#id_areasproduccion').trigger('change.select2');

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#zonasproduccion').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#zonasproduccion').parents('.form-group').removeClass('has-error');
        }

        if($('#zonasproduccion-error').length>0)
        {
          $('#zonasproduccion-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idzonasproduccion = $(this).parents('tr').attr('idzonasproduccion');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "zonasproduccion";
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
        url: $('base').attr('href') + 'zonasproduccion/delete',
        type: 'POST',
        data: 'id_zonasproduccion='+idzonasproduccion,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_zonasproducciones(page);
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
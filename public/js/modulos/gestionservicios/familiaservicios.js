$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_familiaservicios').validate({
        rules:
        {
          id_gruposervicios:{ required:true },
          familiaservicios:{ 
            required:true, 
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'familiaservicios/validar_ac',
              type: "post",
              data: {
                familiaservicios: function() { return $( "#familiaservicios" ).val(); },
                id_gruposervicios: function() { return $('#id_gruposervicios').val(); },
                id_familiaservicios: function() { return $('#id_familiaservicios').val(); }
              }
            } 
          }
        },
        messages: 
        {
          id_gruposervicios:{ required:"Grupo E. C." },
          familiaservicios:{ required:"Familia  E. C.", minlength: "Más de 2 Letras", remote:"Ya Existe" }
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
                url: $('base').attr('href') + 'familiaservicios/save_familiaservicios',
                type: 'POST',
                data: $('#form_save_familiaservicios').serialize(),
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
                      
                      buscar_familiaservicioss(page);
                      $('#editfamiliaservicios').modal('hide');
                    }
                    limpiarform();
                },
                complete: function() {
                  var id_familiaservicios = parseInt($('#id_familiaservicios').val());
                  id_familiaservicios = (id_familiaservicios>0) ? (id_familiaservicios) : ("0");
                  var text = (id_familiaservicios=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Familia se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });

    $(".select2_single").select2({
      placeholder: "Seleccione Grupo",
      allowClear: true,
      width: 'resolve'
    });

    var $eventLog = $(".js-event-log");
    var $eventSelect = $(".js-example-events");
     
    $eventSelect.on("select2:open", function (e) { console.log("select2:open", e); });
    $eventSelect.on("select2:close", function (e) {  if($('#id_gruposervicios-error').length>0) { $('#id_gruposervicios-error').html("Seleccione gruposervicios");}  });
    $eventSelect.on("select2:select", function (e) { if($('#id_gruposervicios-error').length>0) { $('#id_gruposervicios-error').html(""); }});
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_familiaservicios', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarform();
    $('#editfamiliaservicios').modal('hide');
});

function limpiarform()
{
  $('#id_familiaservicios').val('0');
  $('#id_gruposervicios').val('');
  $('#familiaservicios').val('');
  $("select").val("").trigger("change");

  if($('#familiaservicios').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#familiaservicios').parents('.form-group').removeClass('has-error');
  }
  
  if($('#familiaservicios-error').length>0)
  {
    $('#familiaservicios-error').html("");    
    $('#familiaservicios-error').parents('.form-group').removeClass('has-error');
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

  var validatore = $( "#form_save_familiaservicios" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_familiaservicioss(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_familiaservicioss(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_familiaservicioss(page);
});

function buscar_familiaservicioss(page)
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
      url: $('base').attr('href') + 'familiaservicios/buscar_familiaservicios',
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
  var idfamiliaservicios = $(this).parents('tr').attr('idfamiliaservicios');
  $.ajax({
    url: $('base').attr('href') + 'familiaservicios/edit',
    type: 'POST',
    data: 'id_familiaservicios='+idfamiliaservicios,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_familiaservicios').val(response.data.id_familiaservicios);
        $('#familiaservicios').val(response.data.familiaservicios);
        $('#id_gruposervicios').val(response.data.id_gruposervicios);
        $('select#id_gruposervicios').val(response.data.id_gruposervicios);
        $('select#id_gruposervicios').trigger('change.select2');

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#familiaservicios').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#familiaservicios').parents('.form-group').removeClass('has-error');
        }

        if($('#familiaservicios-error').length>0)
        {
          $('#familiaservicios-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idfamiliaservicios = $(this).parents('tr').attr('idfamiliaservicios');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "familiaservicios";
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
        url: $('base').attr('href') + 'familiaservicios/delete',
        type: 'POST',
        data: 'id_familiaservicios='+idfamiliaservicios,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_familiaservicioss(page);
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
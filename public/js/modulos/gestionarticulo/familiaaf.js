$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_familiaaf').validate({
        rules:
        {
          id_grupoaf:{ required:true },
          familiaaf:{ required:true, minlength: 2 }       
        },
        messages: 
        {
          id_grupoaf:{
            required:"Seleccione grupoaf" },
          familiaaf:{ required:"Ingresar familiaaf", minlength: "Más de 2 Letras" }
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
                url: $('base').attr('href') + 'familiaaf/save_familiaaf',
                type: 'POST',
                data: $('#form_save_familiaaf').serialize(),
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
                      
                      buscar_familiaafs(page);
                      $('#editfamiliaaf').modal('hide');
                    }
                    limpiarform();
                },
                complete: function() {
                  var id_familiaaf = parseInt($('#id_familiaaf').val());
                  id_familiaaf = (id_familiaaf>0) ? (id_familiaaf) : ("0");
                  var text = (id_familiaaf=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta grupoaf se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });

    $(".select2_single").select2({
      placeholder: "Seleccione grupoaf",
      allowClear: true,
      width: 'resolve'
    });

    var $eventLog = $(".js-event-log");
    var $eventSelect = $(".js-example-events");
     
    $eventSelect.on("select2:open", function (e) { console.log("select2:open", e); });
    $eventSelect.on("select2:close", function (e) {  if($('#id_grupoaf-error').length>0) { $('#id_grupoaf-error').html("Seleccione grupoaf");}  });
    $eventSelect.on("select2:select", function (e) { if($('#id_grupoaf-error').length>0) { $('#id_grupoaf-error').html(""); }});
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_familiaaf', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarform();
    $('#editfamiliaaf').modal('hide');
});

function limpiarform()
{
  $('#id_familiaaf').val('0');
  $('#id_grupoaf').val('');
  $('#familiaaf').val('');

  if($('#familiaaf').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#familiaaf').parents('.form-group').removeClass('has-error');
  }
  
  if($('#familiaaf-error').length>0)
  {
    $('#familiaaf-error').html("");    
    $('#familiaaf-error').parents('.form-group').removeClass('has-error');
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

  var validatore = $( "#form_save_familiaaf" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_familiaafs(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_familiaafs(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_familiaafs(page);
});

function buscar_familiaafs(page)
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
      url: $('base').attr('href') + 'familiaaf/buscar_familiaafs',
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
  var idfamiliaaf = $(this).parents('tr').attr('idfamiliaaf');
  $.ajax({
    url: $('base').attr('href') + 'familiaaf/edit',
    type: 'POST',
    data: 'id_familiaaf='+idfamiliaaf,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_familiaaf').val(response.data.id_familiaaf);
        $('#familiaaf').val(response.data.familiaaf);
        $('#id_grupoaf').val(response.data.id_grupoaf);
        $('select#id_grupoaf').val(response.data.id_grupoaf);
        $('select#id_grupoaf').trigger('change.select2');

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#familiaaf').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#familiaaf').parents('.form-group').removeClass('has-error');
        }

        if($('#familiaaf-error').length>0)
        {
          $('#familiaaf-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idfamiliaaf = $(this).parents('tr').attr('idfamiliaaf');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "familiaaf";
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
        url: $('base').attr('href') + 'familiaaf/delete',
        type: 'POST',
        data: 'id_familiaaf='+idfamiliaaf,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_familiaafs(page);
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
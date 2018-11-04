$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_familia').validate({
        rules:
        {
          id_grupo:{ required:true },
          familia:{ required:true, minlength: 2 }       
        },
        messages: 
        {
          id_grupo:{
            required:"Seleccione Grupo" },
          familia:{ required:"Ingresar Familia", minlength: "Más de 2 Letras" }
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
                url: $('base').attr('href') + 'familia/save_familia',
                type: 'POST',
                data: $('#form_save_familia').serialize(),
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
                      
                      buscar_familias(page);
                      $('#editfamilia').modal('hide');
                    }
                    limpiarform();
                },
                complete: function() {
                  var id_familia = parseInt($('#id_familia').val());
                  id_familia = (id_familia>0) ? (id_familia) : ("0");
                  var text = (id_familia=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Grupo se '+text+'.', 'success');
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
    $eventSelect.on("select2:close", function (e) {  if($('#id_grupo-error').length>0) { $('#id_grupo-error').html("Seleccione Grupo");}  });
    $eventSelect.on("select2:select", function (e) { if($('#id_grupo-error').length>0) { $('#id_grupo-error').html(""); }});
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_familia', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarform();
    $('#editfamilia').modal('hide');
});

function limpiarform()
{
  $('#id_familia').val('0');
  $('#id_grupo').val('');
  $('#familia').val('');

  if($('#familia').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#familia').parents('.form-group').removeClass('has-error');
  }
  
  if($('#familia-error').length>0)
  {
    $('#familia-error').html("");    
    $('#familia-error').parents('.form-group').removeClass('has-error');
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

  var validatore = $( "#form_save_familia" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_familias(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_familias(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_familias(page);
});

function buscar_familias(page)
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
      url: $('base').attr('href') + 'familia/buscar_familias',
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
  var idfamilia = $(this).parents('tr').attr('idfamilia');
  $.ajax({
    url: $('base').attr('href') + 'familia/edit',
    type: 'POST',
    data: 'id_familia='+idfamilia,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_familia').val(response.data.id_familia);
        $('#familia').val(response.data.familia);
        $('#id_grupo').val(response.data.id_grupo);
        $('select#id_grupo').val(response.data.id_grupo);
        $('select#id_grupo').trigger('change.select2');

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#familia').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#familia').parents('.form-group').removeClass('has-error');
        }

        if($('#familia-error').length>0)
        {
          $('#familia-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idfamilia = $(this).parents('tr').attr('idfamilia');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Familia";
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
        url: $('base').attr('href') + 'familia/delete',
        type: 'POST',
        data: 'id_familia='+idfamilia,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_familias(page);
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
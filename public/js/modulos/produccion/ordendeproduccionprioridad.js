$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $.validator.addMethod("regex", function(value, element) {
      var exp = value;
      if (exp <= 0) { return false; }
      else {
          if($.isNumeric(exp)){ return true; }
          else{ return false; }
      }
    }, "Solo #s Mayores a 0");

    $('#form_save_ordendeproduccionprioridad').validate({
      rules:
      {
        ordendeproduccionprioridad: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'ordendeproduccionprioridad/validar_ordendeproduccionprioridad',
            type: "post",
            data: {
              ordendeproduccionprioridad: function() { return $( "#ordendeproduccionprioridad" ).val(); },
              id_ordendeproduccionprioridad: function() { return $('#id_ordendeproduccionprioridad').val(); }
            }
          }
        },
        abreviatura:{required:true},
        orden:{regex:true}
      },
      messages: 
      {
        ordendeproduccionprioridad: {required:"Prioridad", minlength: "Mas de 2 Letras", remote: "Ya existe" },
        abreviatura:{required:"Ingresar"}
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
          url: $('base').attr('href') + 'ordendeproduccionprioridad/save_ordendeproduccionprioridad',
          type: 'POST',
          data: $('#form_save_ordendeproduccionprioridad').serialize(),
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

              buscar_ordendeproduccionprioridads(page);
            }
            else
            {
              if($('#ordendeproduccionprioridad').parents('.form-group').attr('class')=="form-group")
              {
                $('#ordendeproduccionprioridad').parents('.form-group').addClass('has-error');
              }
              
              if($('#ordendeproduccionprioridad-error').length>0)
              {
                $('#ordendeproduccionprioridad-error').html(response.message);
              }
              else
              {
                $('#ordendeproduccionprioridad').parents('.col-md-6').append("<span id='ordendeproduccionprioridad-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_ordendeproduccionprioridad = parseInt($('#id_ordendeproduccionprioridad').val());
            id_ordendeproduccionprioridad = (id_ordendeproduccionprioridad>0) ? (id_ordendeproduccionprioridad) : ("0");
            var text = (id_ordendeproduccionprioridad=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Esta Prioridad se '+text+'.', 'success');
            limp_todo('form_save_ordendeproduccionprioridad');
            $('#editordendeproduccionprioridad').modal('hide');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_ordendeproduccionprioridad', function (e)
{
  limp_todo('form_save_ordendeproduccionprioridad');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_ordendeproduccionprioridad');
  $('#editordendeproduccionprioridad').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_ordendeproduccionprioridads(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_ordendeproduccionprioridads(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  buscar_ordendeproduccionprioridads(0);
});

$(document).on('click', '#datatable-buttons .limpiar', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  buscar_ordendeproduccionprioridads(0);
});

function buscar_ordendeproduccionprioridads(page)
{  
  var temp = "page="+page;
  var ordendeproduccionprioridad_busc = $('#ordendeproduccionprioridad_busc').val();
  var abreviatura_busc = $('#abreviatura_busc').val();

  if(ordendeproduccionprioridad_busc.trim().length)
  {
    temp=temp+'&ordendeproduccionprioridad_busc='+ordendeproduccionprioridad_busc;
  }

  if(abreviatura_busc.trim().length)
  {
    temp=temp+'&abreviatura_busc='+abreviatura_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'ordendeproduccionprioridad/buscar_ordendeproduccionprioridads',
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
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
}

$(document).on('click', '.edit', function (e) {
  limp_todo('form_save_ordendeproduccionprioridad');
  var idordendeproduccionprioridad = $(this).parents('tr').attr('idordendeproduccionprioridad');
  $.ajax({
    url: $('base').attr('href') + 'ordendeproduccionprioridad/edit',
    type: 'POST',
    data: 'id_ordendeproduccionprioridad='+idordendeproduccionprioridad,
    dataType: "json",
    beforeSend: function() {
      limp_todo('form_save_ordendeproduccionprioridad');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_ordendeproduccionprioridad').val(response.data.id_ordendeproduccionprioridad);
        $('#ordendeproduccionprioridad').val(response.data.ordendeproduccionprioridad);
        $('#abreviatura').val(response.data.abreviatura);
        $('#orden').val(response.data.orden);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idordendeproduccionprioridad = $(this).parents('tr').attr('idordendeproduccionprioridad');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Motivo de Ajuste";

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
        url: $('base').attr('href') + 'ordendeproduccionprioridad/save_ordendeproduccionprioridad',
        type: 'POST',
        data: 'id_ordendeproduccionprioridad='+idordendeproduccionprioridad+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_ordendeproduccionprioridads(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_ordendeproduccionprioridad');
        }
      });
    }
  });    
});
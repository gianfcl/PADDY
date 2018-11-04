$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_motivoajusteinventario').validate({
      rules:
      {
        motivoajusteinventario: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'motivoajusteinventario/validar_motivoajusteinventario',
            type: "post",
            data: {
              motivoajusteinventario: function() { return $( "#motivoajusteinventario" ).val(); },
              id_motivoajusteinventario: function() { return $('#id_motivoajusteinventario').val(); }
            }
          }
        },
        abreviatura:{required:true},
        'id_tipo[]':{required:true}
      },
      messages: 
      {
        motivoajusteinventario: {required:"Motivo de Ajuste", minlength: "Mas de 2 Letras", remote: "Ya existe" },
        abreviatura:{required:"Ingresar"},
        'id_tipo[]':{required:"Seleccionar"}
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
          url: $('base').attr('href') + 'motivoajusteinventario/save_motivoajusteinventario',
          type: 'POST',
          data: $('#form_save_motivoajusteinventario').serialize(),
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) {
              var page = 0;
              if($('#paginacion_data ul.pagination li.active a').length>0)
              {
                page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
              }                     

              buscar_motivoajusteinventarios(page);
            }
            else
            {
              if($('#motivoajusteinventario').parents('.form-group').attr('class')=="form-group")
              {
                $('#motivoajusteinventario').parents('.form-group').addClass('has-error');
              }
              
              if($('#motivoajusteinventario-error').length>0)
              {
                $('#motivoajusteinventario-error').html(response.message);
              }
              else
              {
                $('#motivoajusteinventario').parents('.col-md-6').append("<span id='motivoajusteinventario-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            $.LoadingOverlay("hide");
            var id_motivoajusteinventario = parseInt($('#id_motivoajusteinventario').val());
            id_motivoajusteinventario = (id_motivoajusteinventario>0) ? (id_motivoajusteinventario) : ("0");
            var text = (id_motivoajusteinventario=="0") ? ("Creó!") : ("Editó!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Motivo de Ajuste se '+text+'.', 'success');
            limp_todo('form_save_motivoajusteinventario');
            $('#editmotivoajusteinventario').modal('hide');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_motivoajusteinventario', function (e)
{ 
  $('.btn-toolbar .btn-submit span').text('Agregar');
  limp_todo('form_save_motivoajusteinventario');
  $('#id_tipo').val('');
  $('#id_tipo').selectpicker('refresh');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_motivoajusteinventario');
  $('#editmotivoajusteinventario').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_motivoajusteinventarios(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_motivoajusteinventarios(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  buscar_motivoajusteinventarios(0);
});

$(document).on('click', '#datatable-buttons .limpiar', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select option').prop('selected',true);
  $('#buscartipo').selectpicker('refresh');
  $('#estado_busc').selectpicker('refresh')
  buscar_motivoajusteinventarios(0);

});

function buscar_motivoajusteinventarios(page)
{  
  var temp = "page="+page;
  var motivoajusteinventario_busc = $('#motivoajusteinventario_busc').val();
  var abreviatura_busc = $('#abreviatura_busc').val();
  var buscartipo = $('#buscartipo').val();
  var estado  = String($('#estado_busc').val());
  if(motivoajusteinventario_busc.trim().length)
  {
    temp=temp+'&motivoajusteinventario_busc='+motivoajusteinventario_busc;
  }

  if(abreviatura_busc.trim().length)
  {
    temp=temp+'&abreviatura_busc='+abreviatura_busc;
  }
  if(buscartipo)
  {
    temp=temp+'&id_tipo='+buscartipo;
  }
  if((estado.split(",")).length>0)
  {
    temp=temp+'&estado='+estado;
  }

  $.ajax({
    url: $('base').attr('href') + 'motivoajusteinventario/buscar_motivoajusteinventarios',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('click', '.edit', function (e) {
  $('.btn-toolbar .btn-submit span').text('Editar');
  limp_todo('form_save_motivoajusteinventario');
  $('#id_tipo').val('');
  $('#id_tipo').selectpicker('refresh');
  var idmotivoajusteinventario = $(this).parents('tr').attr('idmotivoajusteinventario');
  $.ajax({
    url: $('base').attr('href') + 'motivoajusteinventario/edit',
    type: 'POST',
    data: 'id_motivoajusteinventario='+idmotivoajusteinventario,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      limp_todo('form_save_motivoajusteinventario');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_motivoajusteinventario').val(response.data.id_motivoajusteinventario);
        $('#motivoajusteinventario').val(response.data.motivoajusteinventario);
        $('#abreviatura').val(response.data.abreviatura);

        var tipo = response.data.id_tipo;
        if(tipo == 3)
        {
          $('#id_tipo option').prop('selected',true);
        }
        else
        {
          $('#id_tipo').val(response.data.id_tipo);
        }
        
        $('#id_tipo').selectpicker('refresh');
        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idmotivoajusteinventario = $(this).parents('tr').attr('idmotivoajusteinventario');
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
        url: $('base').attr('href') + 'motivoajusteinventario/save_motivoajusteinventario',
        type: 'POST',
        data: 'id_motivoajusteinventario='+idmotivoajusteinventario+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_motivoajusteinventarios(page);
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_motivoajusteinventario');
        }
      });
    }
  });    
});
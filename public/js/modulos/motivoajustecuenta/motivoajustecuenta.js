$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_motivoajustecuenta').validate({
      rules:
      {
        motivoajustecuenta: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'motivoajustecuenta/validar_motivoajustecuenta',
            type: "post",
            data: {
              motivoajustecuenta: function() { return $( "#motivoajustecuenta" ).val(); },
              id_motivoajustecuenta: function() { return $('#id_motivoajustecuenta').val(); }
            }
          }
        },
        abreviatura:{required:true},
        'id_tipo[]':{required:true}
      },
      messages: 
      {
        motivoajustecuenta: {required:"Motivo de Ajuste", minlength: "Mas de 2 Letras", remote: "Ya existe" },
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
          url: $('base').attr('href') + 'motivoajustecuenta/save_motivoajustecuenta',
          type: 'POST',
          data: $('#form_save_motivoajustecuenta').serialize(),
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

              buscar_motivoajustecuentas(page);
            }
            else
            {
              if($('#motivoajustecuenta').parents('.form-group').attr('class')=="form-group")
              {
                $('#motivoajustecuenta').parents('.form-group').addClass('has-error');
              }
              
              if($('#motivoajustecuenta-error').length>0)
              {
                $('#motivoajustecuenta-error').html(response.message);
              }
              else
              {
                $('#motivoajustecuenta').parents('.col-md-6').append("<span id='motivoajustecuenta-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            $.LoadingOverlay("hide");
            var id_motivoajustecuenta = parseInt($('#id_motivoajustecuenta').val());
            id_motivoajustecuenta = (id_motivoajustecuenta>0) ? (id_motivoajustecuenta) : ("0");
            var text = (id_motivoajustecuenta=="0") ? ("Creó!") : ("Editó!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Motivo de Ajuste se '+text+'.', 'success');
            limp_todo('form_save_motivoajustecuenta');
            $('#editmotivoajustecuenta').modal('hide');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_motivoajustecuenta', function (e)
{ 
  $('.btn-toolbar .btn-submit span').text('Agregar');
  limp_todo('form_save_motivoajustecuenta');
  $('#id_tipo').val('');
  $('#id_tipo').selectpicker('refresh');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_motivoajustecuenta');
  $('#editmotivoajustecuenta').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_motivoajustecuentas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_motivoajustecuentas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  buscar_motivoajustecuentas(0);
});

$(document).on('click', '#datatable-buttons .limpiar', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select option').prop('selected',true);
  $('#buscartipo').selectpicker('refresh');
  $('#estado_busc').selectpicker('refresh')
  buscar_motivoajustecuentas(0);

});

function buscar_motivoajustecuentas(page)
{  
  var temp = "page="+page;
  var motivoajustecuenta_busc = $('#motivoajustecuenta_busc').val();
  var abreviatura_busc = $('#abreviatura_busc').val();
  var buscartipo = $('#buscartipo').val();
  var estado  = String($('#estado_busc').val());
  if(motivoajustecuenta_busc.trim().length)
  {
    temp=temp+'&motivoajustecuenta_busc='+motivoajustecuenta_busc;
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
    url: $('base').attr('href') + 'motivoajustecuenta/buscar_motivoajustecuentas',
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
  limp_todo('form_save_motivoajustecuenta');
  $('#id_tipo').val('');
  $('#id_tipo').selectpicker('refresh');
  var idmotivoajustecuenta = $(this).parents('tr').attr('idmotivoajustecuenta');
  $.ajax({
    url: $('base').attr('href') + 'motivoajustecuenta/edit',
    type: 'POST',
    data: 'id_motivoajustecuenta='+idmotivoajustecuenta,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      limp_todo('form_save_motivoajustecuenta');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_motivoajustecuenta').val(response.data.id_motivoajustecuenta);
        $('#motivoajustecuenta').val(response.data.motivoajustecuenta);
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
  var idmotivoajustecuenta = $(this).parents('tr').attr('idmotivoajustecuenta');
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
        url: $('base').attr('href') + 'motivoajustecuenta/save_motivoajustecuenta',
        type: 'POST',
        data: 'id_motivoajustecuenta='+idmotivoajustecuenta+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_motivoajustecuentas(page);
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_motivoajustecuenta');
        }
      });
    }
  });    
});
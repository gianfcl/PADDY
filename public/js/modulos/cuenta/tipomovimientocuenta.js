$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_tipomovimientocuenta').validate({
      rules:
      {
        tipomovimientocuenta: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'tipomovimientocuenta/validar_tipomovimientocuenta',
            type: "post",
            data: {
              tipomovimientocuenta: function() { return $( "#tipomovimientocuenta" ).val(); },
              id_tipomovimientocuenta: function() { return $('#id_tipomovimientocuenta').val(); }
            }
          }
        },
        abreviatura:{required:true},
        id_tipo:{required:true}
      },
      messages: 
      {
        tipomovimientocuenta: {required:"tipomovimientocuenta", minlength: "Más de 2 Letras", remote: "Ya existe" },
        abreviatura:{required:"Ingresar"},
        id_tipo:{required:"Seleccionar"}
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
          url: $('base').attr('href') + 'tipomovimientocuenta/save_tipomovimientocuenta',
          type: 'POST',
          data: $('#form_save_tipomovimientocuenta').serialize(),
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

              buscar_tipomovimientocuentas(page);
            }
            else
            {
              if($('#tipomovimientocuenta').parents('.form-group').attr('class')=="form-group")
              {
                $('#tipomovimientocuenta').parents('.form-group').addClass('has-error');
              }
              
              if($('#tipomovimientocuenta-error').length>0)
              {
                $('#tipomovimientocuenta-error').html(response.message);
              }
              else
              {
                $('#tipomovimientocuenta').parents('.col-md-6').append("<span id='tipomovimientocuenta-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_tipomovimientocuenta = parseInt($('#id_tipomovimientocuenta').val());
            id_tipomovimientocuenta = (id_tipomovimientocuenta>0) ? (id_tipomovimientocuenta) : ("0");
            var text = (id_tipomovimientocuenta=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Tipo Movimiento se '+text+'.', 'success');
            limp_todo('form_save_tipomovimientocuenta');
            $('#edittipomovimientocuenta').modal('hide');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_tipomovimientocuenta', function (e)
{
  limp_todo('form_save_tipomovimientocuenta');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_tipomovimientocuenta');
  $('#edittipomovimientocuenta').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_tipomovimientocuentas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tipomovimientocuentas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_tipomovimientocuentas(page);
});

function buscar_tipomovimientocuentas(page)
{  
  var temp = "page="+page;
  var tipomovimientocuenta_busc = $('#tipomovimientocuenta_busc').val();
  var abreviatura_busc = $('#abreviatura_busc').val();

  if(tipomovimientocuenta_busc.trim().length)
  {
    temp=temp+'&tipomovimientocuenta_busc='+tipomovimientocuenta_busc;
  }

  if(abreviatura_busc.trim().length)
  {
    temp=temp+'&abreviatura_busc='+abreviatura_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'tipomovimientocuenta/buscar_tipomovimientocuentas',
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
  limp_todo('form_save_tipomovimientocuenta');
  var idtipomovimientocuenta = $(this).parents('tr').attr('idtipomovimientocuenta');
  $.ajax({
    url: $('base').attr('href') + 'tipomovimientocuenta/edit',
    type: 'POST',
    data: 'id_tipomovimientocuenta='+idtipomovimientocuenta,
    dataType: "json",
    beforeSend: function() {
      limp_todo('form_save_tipomovimientocuenta');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_tipomovimientocuenta').val(response.data.id_tipomovimientocuenta);
        $('#id_tipo').val(response.data.id_tipo);
        $('#tipomovimientocuenta').val(response.data.tipomovimientocuenta);
        $('#abreviatura').val(response.data.abreviatura);

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
  var idtipomovimientocuenta = $(this).parents('tr').attr('idtipomovimientocuenta');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "tipomovimientocuenta";

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
        url: $('base').attr('href') + 'tipomovimientocuenta/save_tipomovimientocuenta',
        type: 'POST',
        data: 'id_tipomovimientocuenta='+idtipomovimientocuenta+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_tipomovimientocuentas(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_tipomovimientocuenta');
        }
      });
    }
  });    
});
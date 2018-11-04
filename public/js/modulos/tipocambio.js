$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#fecha').datetimepicker({
    locale:moment.locale('es'),
    format: 'DD-MM-YYYY'
  });

  $('#fecha_busc').datetimepicker({
    locale:moment.locale('es'),
    format: 'DD-MM-YYYY'
  });
  
    $('#form_save_tipocambio').validate({
      rules:
      {
        factor_compra:{required:true},
        factor_venta:{required:true},
        id_moneda:{ required:true },
        fecha:{ 
          required:true, 
          remote: {
            url: $('base').attr('href') + 'tipocambio/validar_ac',
            type: "post",
            data: {
              id_moneda: function() { return $( "#id_moneda" ).val(); },
              id_tipocambio: function() { return $( "#id_tipocambio" ).val(); },
              fecha: function() { return $( "#fecha" ).val(); }
            }
          } 
        }
      },
      messages: 
      {
        factor_compra:{required:"Factor compra"},
        factor_venta:{required:"Factor venta"},
        id_moneda:{ required:"Seleccione moneda" },
        fecha:{ required:"Ingresar fecha", remote: "Ya Existe" }
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
        if(element.parents('.col-md-6').length) 
        {
          error.insertAfter(element.parents('.form-group')); 
        }
      },
      submitHandler: function() {
        var fv = $('#factor_venta').val();
        var fc = $('#factor_compra').val();
        
        if(parseInt(fv)>0 && parseInt(fc)>0)
        {

          $.ajax({
            url: $('base').attr('href') + 'tipocambio/save_tipocambio',
            type: 'POST',
            data: $('#form_save_tipocambio').serialize(),
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
                buscar_tipocambios(page);
                alerta('Se hicieron los cambios','correctamente!','success');
                $('#edittipocambio').modal('hide');
                limpiarform();
              }
            },
            complete: function() {
              $.LoadingOverlay("hide");
            }
          });/**/
        }
        else
        {
          swal('Los factores deben de ser','mayor a 0!!!','error');
        }
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_tipocambios(0);
});

$(document).on('click', '.add_tipocambio', function (e)
{
  limpform('form_save_tipocambio');
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarform();
    $('#edittipocambio').modal('hide');
});

function limpiarform()
{
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked',false);
  $('#estado #estado_1').prop('checked',true);
  $('#estado #estado_1').parent().addClass('active');
  $('#id_tipocambio').val('');
  $('#id_moneda').val('');
  $('#fecha').val('');
  $('#factor_compra').val('');
  $('#factor_venta').val('');
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_tipocambios(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tipocambios(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_tipocambios(page);
});

function buscar_tipocambios(page)
{
  var moneda = $('#moneda_busc').val();
  var fecha = $('#fecha_busc').val();
  
  var temp = "page="+page;
  if(moneda.trim().length)
  {
    temp=temp+'&moneda='+moneda;
  }

  if(fecha.trim().length)
  {
    temp=temp+'&fecha='+fecha;
  }
  
  $.ajax({
      url: $('base').attr('href') + 'tipocambio/buscar_tipocambios',
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
  limpform('form_save_tipocambio');
  var idtipocambio = $(this).parents('tr').attr('idtipocambio');
  $.ajax({
    url: $('base').attr('href') + 'tipocambio/edit',
    type: 'POST',
    data: 'id_tipocambio='+idtipocambio,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_tipocambio').val(response.data.id_tipocambio);
        $('#id_moneda').val(response.data.id_moneda);
        $('#fecha').val(response.data.fecha);
        $('#factor_compra').val(response.data.factor_compra);
        $('#factor_venta').val(response.data.factor_venta);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#tipocambio').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#tipocambio').parents('.form-group').removeClass('has-error');
        }

        if($('#tipocambio-error').length>0)
        {
          $('#tipocambio-error').html('');
        }
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idtipocambio = $(this).parents('tr').attr('idtipocambio');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Tipo de cambio";
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
        url: $('base').attr('href') + 'tipocambio/delete',
        type: 'POST',
        data: 'id_tipocambio='+idtipocambio,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_tipocambios(page);
            }
        },
        complete: function() {
          $.LoadingOverlay("hide");
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpiarform();
        }
      });
    }
  });   
});
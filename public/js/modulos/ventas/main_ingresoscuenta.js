$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "");

  $('#form_save_kardexcuenta').validate({
    rules:
    {
      fecha_ingreso: { formespn:true },
      id_moneda: { required:true},
      id_cuenta: { required:true}   
    },
    messages: 
    {
      id_moneda: { required:"Moneda" },
      id_cuenta: { required:"cuenta" }
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
        url: $('base').attr('href') + 'ingresoscuenta/save_pagopendiente',
        type: 'POST',
        data: $('#form_save_kardexcuenta').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            if($('#id_cobranza').length)
            {
              location.reload();
              /*var id = 0;
              var url = $('base').attr('href');
              var link = "";
              if($('#id_facturacion'))
              {
                id = $('#id_facturacion').val();
                link = url+'facturacion/ver_factura/'+id;
              }
              else
              {
                if($('#id_documento'))
                {
                  id = $('#id_facturacion').val();
                  link = url+'facturacion/ver_factura/'+id;
                }
              }

              
                
              window.location.href = link;*/
            }
            else
            {
              var page = 0;
              if($('#paginacion_data ul.pagination li.active a').length>0)
              {
                page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
              }
              buscar_facturas(page);
              $('#editkardexcuenta').modal('hide');
              limpiarform();
            }
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });/**/
    }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    maxDate: moment()
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});
  

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo( "form_save_kardexcuenta" );
  $('#buscarpagos').modal('hide');
});

function limpiarform()
{
  $('#id_cobranza_det').val('');
  $('#m_total').val('');
  $('#id_moneda').val('');
  $('#id_cuenta').val('');
  $('#otro_monto').val('');
}

$(document).on('click', '.add_pend_pago', function (e)
{
  limp_todo( "form_save_kardexcuenta" );
  buscar_pendientes(0,$('#id_cobranza').val());
});

$(document).on('click', '.add_pend_pagoo', function (e)
{
  limp_todo( "form_save_kardexcuenta" );
  var idcob = parseInt($(this).closest('tr').attr('idcobranza'));
  buscar_pendientes(0,idcob);
});

function buscar_pendientes(page,idcob)
{
  var temp = 'page='+page+'&id_cobranza='+idcob;
  $.ajax({
      url: $('base').attr('href') + 'ingresoscuenta/buscar_pendientes',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            $('#buscar_pagos tbody').html(response.data.rta);
            $('#pagina_data_buscar').html(response.data.paginacion);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });
}

$(document).on('click', '.add_pago', function (e) {
  var padre = $(this).closest('tr');
  var iddet = parseInt(padre.attr('idcobranzadet'));
  var fec = $('#form_save_kardexcuenta').attr('fecha');
  $('#fecha_ingreso').val(fec);
  if(iddet>0)
  {
    $('#id_cobranza_det').val(iddet);
    $('#buscarpagos').modal('hide');
    var monto = parseFloat(padre.find('td.pend span.pull-right').html());
    $('#m_total').val(monto);
    monto = parseFloat(padre.find('td.pend input').val());
    $('#otro_monto').val(monto);
  }
});

$(document).on('change', '#id_moneda', function (e) {
  var padre = $(this);
  var idmon = parseInt(padre.val());
  $('#id_cuenta').html('');
  if(idmon>0)
  {
    var temp = 'idmoneda='+idmon;
    
    $.ajax({
      url: $('base').attr('href') + 'moventrecuenta/cbx_cuentadetin',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_cuenta').html(response.data.cbxcuenta);
          $('#simbo').html(response.data.simbolo);
          $('#txtstock em').html(response.data.simbolo);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    }); 
  }
});

$(document).on('change', '#id_cuenta', function (e) {
  var padre = $(this);
  var idcuenta = parseInt(padre.val());
  var idmon = parseInt($('#id_moneda').val());
  $('#txtstock b').html('');
  $('#txtstock input').val('');
  if(idcuenta>0 && idmon>0)
  {
    temp='idmoneda='+idmon+'&idcuenta='+idcuenta;
    $.ajax({
      url: $('base').attr('href') + 'salidaxprestamo/stock_cuentamoneda',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#txtstock b').html(response.data.stock);
          $('#txtstock input').val(response.data.stock);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});
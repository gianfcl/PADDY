$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_kardexcuenta').validate({
    rules:
    {
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
            //showLoader();
        },
        success: function(response) {
          if (response.code==1) {
            var id = $('#id_facturacion').val();
            var url = $('base').attr('href');
            var link = url+'facturacion/ver_factura/'+id;
            window.location.href = link;
          }
          else
          {
            limpiarform();
          }
        },
        complete: function() {
          //alerta("Guardo!", 'Este cobró se realizo.', 'success');
        }
      });/**/
    }
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
    buscar_pendientes(0);
});

function buscar_pendientes(page)
{
  var temp = 'page='+page+'&id_cobranza='+$('#id_cobranza').val()
  $.ajax({
      url: $('base').attr('href') + 'ingresoscuenta/buscar_pendientes',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#buscar_pagos tbody').html(response.data.rta);
            $('#pagina_data_buscar').html(response.data.paginacion);
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
}

$(document).on('click', '.add_pago', function (e) {
  var padre = $(this).closest('tr');
  var iddet = parseInt(padre.attr('idcobranzadet'));
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
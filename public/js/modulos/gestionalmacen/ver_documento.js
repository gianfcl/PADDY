$( document ).ready(function() {

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
        url: $('base').attr('href') + 'egresoscuenta/save_pagopendiente',
        type: 'POST',
        data: $('#form_save_kardexcuenta').serialize(),
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          if($('#id_cobranza').length && $('#id_facturacion'))
          {
            var id = $('#id_documento').val();
            var url = $('base').attr('href');
            var link = url+'ingresoxcompra/ver_documento/'+id;
            window.location.href = link;
          }
          else
          {
            var page = 0;
            if($('#paginacion_data ul.pagination li.active a').length>0)
            {
              page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
            }
            buscar_documentos(page);
            $('#editkardexcuenta').modal('hide');
            limpiarform();
          }
        },
        complete: function() {
          alerta("Guardo!", 'Este cobró se realizo.', 'success');
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

$(document).on('click', '.add_pend_pago', function (e)
{
  limp_todo( "form_save_kardexcuenta" );
  buscar_pendientes(0,$('#id_cobranza').val());
});

$(document).on('click', '.add_pend_pagoo', function (e)
{
  limp_todo( "form_save_kardexcuenta" );
  var idcob = parseInt($(this).closest('tr').attr('idcobranza'));
  var fec = $('#form_save_kardexcuenta').attr('fecha');
  $('#fecha_ingreso').val(fec);
  buscar_pendientes(0,idcob);
});

function buscar_pendientes(page,idcob)
{
  var temp = 'page='+page+'&id_cobranza='+idcob;
  $.ajax({
      url: $('base').attr('href') + 'egresoscuenta/buscar_pendientes',
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
  var idtipo = parseInt(padre.attr('idtipo'));
  if(iddet>0)
  {
    $('#id_cobranza_det').val(iddet);
    $('#buscarpagos').modal('hide');
    var monto = parseFloat(padre.find('td.pend span.pull-right').html());
    $('#m_total').val(monto);
    monto = parseFloat(padre.find('td.pend input').val());
    $('#otro_monto').val(monto);
    $('#idtipo').val(idtipo);
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
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_cuenta').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    }); 
  }
});

function limpiarform()
{
  $('#id_cobranza_det').val('');
  $('#m_total').val('');
  $('#id_moneda').val('');
  $('#id_cuenta').val('');
  $('#otro_monto').val('');
}
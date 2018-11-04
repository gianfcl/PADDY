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

  $('#datet1').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale('es')
  });

  $('#datet2').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale('es'),
    useCurrent: false //Important! See issue #1075
  });

  $("#datet1").on("dp.change", function (e) {
      $('#datet2').data("DateTimePicker").minDate(e.date);
  });
  $("#datet2").on("dp.change", function (e) {
      $('#datet1').data("DateTimePicker").maxDate(e.date);
  });

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
      var sto = parseFloat($('#txtstock input').val());
      var mon = parseFloat($('#otro_monto').val());
      sto = (sto>0) ? (sto) : (0);
      if(sto<mon)
      {
        //$('#otro_monto').addClass('erroinput');
        alerta('Verificar!', 'Stock Insuficiente', 'error');
      }
      else
      {
        $.ajax({
          url: $('base').attr('href') + 'egresoscuenta/save_pagopendiente',
          type: 'POST',
          data: $('#form_save_kardexcuenta').serialize(),
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
              buscar_kardexcuentas(page);
              $('#editkardexcuenta').modal('hide');
            }
            else
            {
              limpiarform();
            }
          },
          complete: function() {
            alerta("Guardo!", 'Este cobró se realizo.', 'success');
          }
        });/**/
      }
        
    }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    maxDate: moment()
  });
});

$(document).on('click', '#datatable-buttons #filtro .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('select').val(0);
  $('#'+id).find('.selectpicker').selectpicker('refresh');
  buscar_kardexcuentas(0);
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

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_kardexcuentas(page);
});

$(document).on('click', '#paginacion_data a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_kardexcuentas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_kardexcuentas(page);
});

function buscar_kardexcuentas(page)
{
  
  var temp = "page="+page;
  
  var f_i = $('#f_inicio').val();
  var f_f = $('#f_fin').val();
  var t_mov = $('#tmov_sele').val();
  var t_mon = $('#moneda_sele').val();
  var caj = $('#cuenta_sele').val();

  if(f_i)
  {
    temp = temp + '&fecha_i='+f_i;
  }
  if(f_f)
  {
    temp = temp + '&fecha_f='+f_f;
  }
  if(t_mov)
  {
    temp = temp + '&tipo_mov='+t_mov;
  }
  if(t_mon)
  {
    temp = temp + '&tipo_mone='+t_mon;
  }
  if(caj)
  {
    temp = temp + '&cuenta='+caj;
  }

  $.ajax({
      url: $('base').attr('href') + 'egresoscuenta/buscar_egresoscuentas',
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


$(document).on('click', '#pagina_data_buscar li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_pendientes(page);
});

$(document).on('click', '#pagina_data_buscar a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_pendientes(page);
});

$(document).on('click', '.add_pend_pago', function (e)
{
  limp_todo( "form_save_kardexcuenta" );
  buscar_pendientes(0);
  var fec = $('#form_save_kardexcuenta').attr('fecha');
  $('#fecha_ingreso').val(fec);
});

function buscar_pendientes(page)
{  
  var temp = "page="+page;
  
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
  var padre = $(this).parents('tr');
  var iddet = parseInt(padre.attr('idcobranzadet'));
  var idtipo = parseInt(padre.attr('idtipo')); //alert(idtipo);
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
          $('#id_cuenta').html(response.data.cbxcuenta);
          $('#simbo').html(response.data.simbolo);
          $('#txtstock em').html(response.data.simbolo);
        }
      },
      complete: function() {
        //hideLoader();
      }
    }); 
  }
});

$(document).on('click', '.ver_info', function (e) {
  var tis = $(this);
  var padre = tis.closest('tr');
  var idcob = parseInt(padre.attr('idcobranza'));
  var idtipo = parseInt(padre.attr('idtipo'));
  var det = parseInt(padre.attr('det'));
  $('#verform_cobranza').html('');
  $('#verdocu').html('');
  if(idcob>0 && idtipo>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'egresoscuenta/ver_documento',
      type: 'POST',
      data: 'id_cobranza='+idcob+'&idtipo='+idtipo+'&det='+det,
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if (response.code==1) {
          $('#verdocu').html(response.data.codigo);
          $('#verform_cobranza').html(response.data.html);
        }
      },
      complete: function() {
        //hideLoader();
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
      },
      success: function(response) {
        if (response.code==1) {
          $('#txtstock b').html(response.data.stock);
          $('#txtstock input').val(response.data.stock);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

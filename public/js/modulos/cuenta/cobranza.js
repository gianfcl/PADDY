$( document ).ready(function() {
  $('#fechad_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
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

            var URLactual = window.location.href;
            var sURLVariables = URLactual.split('/');
            //console.log(sURLVariables[5]);
            if(sURLVariables[5] == 'ver'){ location.reload();}else{

                var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                buscar_cobranzas(page);
            }

            
            $('#editkardexcuenta').modal('hide');
            limpiartexto();

           /* if($('#id_cobranza').length)
            {
              var page = 0;
              buscar_cobranzas(page);
            }
            else
            {
              var page = 0;
              if($('#paginacion_data ul.pagination li.active a').length>0)
              {
                page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
              }
              //buscar_facturas(page);
              $('#editkardexcuenta').modal('hide');
              limpiartexto();
            }*/
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

function limpiartexto()
{
  $('#id_cobranza_det').val('');
  $('#m_total').val('');
  $('#id_moneda').val('');
  $('#id_cuenta').val('');
  $('#otro_monto').val('');
  $('#stoki').val('');
  $('#voucher').val('');
}

$(document).on('click', 'table#datatable-buttons  tr#filtro a.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_cobranzas(0);
});

$(document).on('click', '.add_cobranza', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editcobranza').modal('hide');
});

function limpiarform()
{
  $('#id_cobranza').val('0');
  $('#cobranza').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  limp_todo( "#form_save_cobranza" );
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_cobranzas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_cobranzas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_cobranzas(page);
});

function buscar_cobranzas(page)
{
  var codigo_busc = $('#codigo_buscar').val();
  var fechad_busc = $('#fechad_busc').val();

  var usuario_busc = $('#usuario_busc').val();  
  var sede_busc = $('#sede_busc').val();

  var monto_total = $('#monto_total').val();
  var monto_pago = $('#monto_pago').val();

  var cobes_busc = $('#id_cobestado').val();
  var forma_pago = $('#forma_pago').val();
  var id_origen = $('#id_origen option:selected').text();

  var temp = "page="+page;
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(fechad_busc.trim().length)
  {
    temp=temp+'&fechad_busc='+fechad_busc;
  }
  if(usuario_busc.trim().length)
  {
    temp=temp+'&usuario_busc='+usuario_busc;
  }
  if(sede_busc.trim().length)
  {
    temp=temp+'&sede_busc='+sede_busc;
  }
  if(monto_total.trim().length)
  {
    temp=temp+'&monto_total='+monto_total;
  }
  if(monto_pago.trim().length)
  {
    temp=temp+'&monto_pago='+monto_pago;
  }
  if(parseInt(cobes_busc))
  {
    temp=temp+'&id_cobestado='+cobes_busc;
  }
  if(id_origen.trim().length)
  {
    temp=temp+'&id_origen='+id_origen;
  }



  $.ajax({
      url: $('base').attr('href') + 'cobranza/buscar_cobranzas',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            console.log(response)
            $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
            $('#paginacion_data').html(response.data.paginacion);
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
}

$(document).on('click', '.ver_info', function (e) {
  var tis = $(this);
  var padre = tis.closest('tr');
  var idcob = parseInt(padre.attr('idcobranza'));
  if(idcob>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'cobranza/ver_documento',
      type: 'POST',
      data: 'id_cobranza='+idcob,
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


//--
/*
$(document).on('click', '.add_pago', function (e) {
  var padre = $(this).closest('tr');
  var iddet = parseInt(padre.attr('idcobranzadet'));
  var fec = $('#form_save_kardexcuenta').attr('fecha');
  $('#fecha_ingreso').val(fec);
  $('#div_fp').addClass('hidden');
  var idtipo = parseInt(padre.attr('idtipo'));  
  if(iddet>0)
  {
    var fc = padre.attr('fc');

    $('#fc_preciodeuda').val(fc);
    $('#id_cobranza_det').val(iddet);
    if($('#buscarpagos').length)
    {
      $('#buscarpagos').modal('hide');
    }
    var monto = parseFloat(padre.find('td.pend input').val());
    var id_mon = padre.attr('idm');
    $('#id_moneda_compra').val(id_mon);
    $('#id_moneda').val(id_mon);
    $('#id_moneda').change();
    var sim = padre.find('td.pend span.pull-left b i').html();
    $('#simbo').text(sim);
    $('#m_total').val(monto);
    monto = parseFloat(padre.find('td.pend input').val());
    $('#otro_monto').val(monto);
    $('#idtipo').val(idtipo);
  }
});*/

$(".ver_infomov").click(function(){
  var ti = $(this);
  var pad = ti.closest('tr');

  var fepa = pad.find('td.fe_pa').html();
  var usu = pad.find('td.usu').html();
  var regis = pad.find('td.idka').html();
  var sim = pad.find('td.sim').html();
  var mone = pad.find('td.mone').html();
  var monpa = pad.find('td.monpa').html();
  var cuen = pad.find('td.cuen').html();
  var vou = pad.find('td.vou').html();
  $("#fecre").html(fepa);
  $("#usucrea").html(usu);
  $("#regis").html(regis);
  $("#montpag").html(monpa);
  $("#vouch").html(vou);
  //console.log(fepa+' '+usu+' '+regis+' '+mone+' '+cuen+' '+vou);
});

$(document).on('change', '#id_moneda', function (e) {
  var padre = $(this);
  var idmon = parseInt(padre.val());
  $('#id_cuenta').html('');
  $('#div_fp').addClass('hidden');
  $('#div_monto').addClass('hidden');
$('#factor_final').val('');
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
          $('#simbo').html(response.data.simbolo);simbo_fijo
          $('#txtstock em').html(response.data.simbolo);
          $('#id_cuenta').change();
          var id_moneda_compra = $('#id_moneda_pagado').val();
          if(!(id_moneda_compra==idmon))
          {
            $('#div_fp').removeClass('hidden');
            $('#div_monto').removeClass('hidden');
            $('#factor_pago').val('');
          }
          else
          {
            $('#factor_pago').val($('#fc_preciodeuda').val());
            $('#factor_final').val(1);
          }
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
});/*
$('#factor_pago').keyup(function (e) {
  var code = e.keyCode || e.which;
  if (code >= 48 && code <= 57 || code == 44 || code == 46 || code == 8 || code==9) { 
    var fc = $(this).val();
    var fc_compra = $('#fc_preciodeuda').val(); //console.log(fc_compra);
    var fc_final = parseFloat(fc/fc_compra);
    $('#factor_final').val(fc_final);
    return true; 
  }
  else {

    return false;
  }
});*/


//-- vista principal - pagar

$(document).on('click', '.add_pend_pagoo', function (e)
{
  //limp_todo( "form_save_kardexcuenta" );
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
       //alert(response.code);
          if (response.code==1) {
            $('#buscar_pagos tbody').html(response.data.rta);
            //$('#pagina_data_buscar').html(response.data.paginacion);
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
   
    $('#monto_convertido').val("");
   var id_mon = padre.attr('idm');
    //$("#id_moneda").val(id_mon);
    $('#id_moneda_pagado').val(id_mon);
    $('#id_moneda').val(id_mon);
    $('#id_moneda').change();

    var simbb = padre.attr('mon');
    $('#simbo_fijo').html(simbb);
    $('#id_cobranza_det').val(iddet);
    $('#buscarpagos').modal('hide');
    var monto = parseFloat(padre.find('td.pend span.pull-right').html());
    $('#m_total').val(monto);
    monto = parseFloat(padre.find('td.pend input').val());
    $('#otro_monto').val(monto);
  }
});

$(document).on('keyup', '#factor_pago', function (e) {

  //console.log("jaja");
  var factor = $('#factor_pago').val();
  var otro_monto = $('#otro_monto').val();
   if (factor>0){

    var moneda = $('#simbo').html();
    console.log(moneda);
    console.log("jaja");
    var monedafijo = $('#simbo_fijo').val();
    if (moneda == "S/.") { var resul = otro_monto / factor } else { resul = otro_monto *  factor}
    $('#monto_convertido').val(resul);

   }
});

$(document).on('keyup', '#otro_monto', function (e) {

  //console.log("jaja");
  var factor = $('#factor_pago').val();
  var otro_monto = $('#otro_monto').val();

  if (factor>0){
    var moneda = $('#simbo').val();
    var monedafijo = $('#simbo_fijo').val();
    if (moneda == "S/.") { var resul = otro_monto / factor } else { resul = otro_monto *  factor}
    $('#monto_convertido').val(resul);
  }

});


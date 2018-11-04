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
      id_cuenta: { required:true},
      montopago: {required:true},
      factor_pago: { required: true}
    },
    messages: 
    {
      id_moneda: { required:"Moneda" },
      id_cuenta: { required:"Cuenta" },
      montopago: {required:"Monto"},
      factor_pago: {required: "Factor"}
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
      var pasa = true;
      if($('#id_cobranza').length) { }
      else
      {
        var sto = parseFloat($('#txtstock input').val());
        var mon = parseFloat($('#otro_monto').val());
        sto = (sto>0) ? (sto) : (0);
        if(sto<mon)
        {
          pasa = false;
          alerta('Verificar!', 'Saldo Insuficiente', 'error');
        }
        else if (mon<=0) {
          pasa = false;
          alerta('Verificar!', 'Monto de Pago Incorrecto', 'error');
        }
      }
      
      var monto_paga = ($('#otro_monto').val())*($('#factor_final').val());

      var monto_pagar = $('#m_total').val();
      if(monto_pagar<monto_paga || monto_paga<=0)
      {
        pasa = false;
        alerta('Verificar!', 'Monto de Pago Incorrecto', 'error');
      }

      if(pasa) {
        $.ajax({
          url: $('base').attr('href') + 'egresoscuenta/save_pagopendiente',
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
                /*var id = $('#id_facturacion').val();
                var url = $('base').attr('href');
                var link = url+'facturacion/ver_factura/'+id;
                window.location.href = link;*/
              }
              else
              {
                var page = 0;
                $('#editkardexcuenta').modal('hide');
                if($('#paginacion_data ul.pagination li.active a').length>0)
                {
                  page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                }
                if( $('#form_busc_planilla').length)
                {
                  buscar_adelantos(page);
                  //limp_todo('form_save_kardexcuenta')
                }
                else
                {
                  buscar_documentos(page);
                  limpiarform();
                }
                
              }
            }
          },
          complete: function() {
            $.LoadingOverlay("hide");
          }
        });/**/
      }
    }
  });

  /*$('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    maxDate: moment()
  });*/
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
  $('#factor_final').val('');
  $('#voucher_pag').val('');
}

$(document).on('click', '.add_pend_pagoo', function (e)
{
  limp_todo( "form_save_kardexcuenta" );
  var papichulo = $(this).closest('tr');
  var idcob = (isNaN(parseInt(papichulo.attr('idcobranza')))) ? $('#id_cobranza').val() : papichulo.attr('idcobranza');
  console.log(idcob);
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
  var mon = padre.find('td.pend span b i').html();
  var deuda = padre.find('td.pend span.pull-right').html();
  $('#fecha_ingreso').val(fec);
  $('#div_fp').addClass('hidden');
  var idtipo = parseInt(padre.attr('idtipo'));
  console.log(iddet);
  console.log(fec);
  console.log(mon);
  console.log(deuda);
  if(iddet>0)
  {
    var fc =padre.attr('fc');
    console.log(fc);

    $('#fc_preciodeuda').val(fc);
    $('#id_cobranza_det').val(iddet);
    if($('#buscarpagos').length)
    {
      $('#buscarpagos').modal('hide');
    }
    var monto = parseFloat(padre.find('td.pend input').val());
    console.log(monto);
    var id_mon = padre.attr('idm');
    console.log(id_mon);
    $('#id_moneda_compra').val(id_mon);
    $('#id_moneda').val(id_mon);
    $('#id_moneda').change();
    var sim = padre.find('td.pend span.pull-left b i').html();
    $('#simbo').text(sim);
    $('#m_total').val(monto);
    monto = parseFloat(padre.find('td.pend input').val());
    $('#otro_monto').val(monto);
    $('#idtipo').val(idtipo);
    $('#txtdeuda em').html(mon);
    $('#txtdeuda b').html(deuda);
    $('#deu').html(deuda);
  }
});

$(document).on('change', '#id_moneda', function (e) {
  var padre = $(this);
  var idmon = parseInt(padre.val());
  $('#id_cuenta').html('');
  $('#div_fp').addClass('hidden');
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
          $('#simbo').html(response.data.simbolo);
          $('#txtstock em').html(response.data.simbolo);
          $('#txtstock_f em').html(response.data.simbolo);
          $('#id_cuenta').change();
          var id_moneda_compra = $('#id_moneda_compra').val();
          console.log(id_moneda_compra+"-"+idmon);
          if(!(id_moneda_compra==idmon))
          {
            $('#div_fp').removeClass('hidden');
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
          var m = $('#txtstock b').html();
          var mm = $('#txtdeuda b').html();
          var mmm = (m-mm).toFixed(2);
          $('#txtstock_f b').html(mmm);
          $('#txtstock input').val(response.data.stock);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$('#factor_pago').keyup(function (e) {
  var code = e.keyCode || e.which;
  if ((code >= 48 && code <= 57) || code >= 97 && code <= 105 || code == 44 || code == 190 || code == 46 || code == 8 || code==9 || code==32 || code==18 || code==17) { 
    var fc = $(this).val();
    var fc_compra = $('#fc_preciodeuda').val();
    var fc_final = parseFloat(fc);
    $('#factor_final').val(fc_final);
    var m_tot = $('#m_total').val();
    var montop = (isNaN(fc) || fc=="") ? (" ") : (parseFloat(m_tot/fc)).toFixed(3);
    $('#otro_monto').val(montop);
    return true; 
  }
  else {

    return false;
  }
});

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
  var tip_m = pad.find('td.tip_movi').html();
  var tc_empre = pad.find('td.tc_emp').html();
  $("#fecre").html(fepa);
  $("#usucrea").html(usu);
  $("#regis").html(regis);
  $("#montpag").html(monpa);
  $("#vouch").html(vou);
  $("#tip_m").html(tip_m);
  $("#tc_empre").html(tc_empre);
});

//$('#movimientosanulados-tab').parent().attr("class","hidden");
$(".anular_pago").click(function(e){
e.preventDefault();
  var ti = $(this);
  var pad_g = ti.closest('tr');
  var id_kc = pad_g.find('td.idka').html();
  swal({
    title: 'Confirm',
    text: '¿Estas seguro que desea eliminar este pago?',
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'SI, eliminar'
  }).then(function(isConfirm) {
  if (isConfirm) {
  console.log(id_kc);
    $.ajax({
      url: $('base').attr('href') + 'cuentaxpagar/anularcuentaxpagar',
      type: 'POST',
      data: 'id_kardexcuenta='+id_kc,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
      },
      complete: function() {
        $.LoadingOverlay("hide");
        swal("Listo!","Se ha generado la anulacion del documento "+id_kc,"success").then(function(isConfirm){
          if(isConfirm){location.reload();}
        });
      }
    });
  }
  });
});


$(".save_mov").click(function(){
  var id_kardexcu = $("#regis").html();
  var voucher_nu = $("#vouch").val();
  var temp = 'id_kardexcuenta='+id_kardexcu+'&voucher='+voucher_nu;
  if (id_kardexcu) {
    $.ajax({
      url: $('base').attr('href') + 'cuentaxpagar/edit_movimiento',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
      },
      complete: function() {
        $.LoadingOverlay("hide");
        swal("Listo!","Se ha editado el documento "+id_kardexcu,"success").then(function(isConfirm){
          if(isConfirm){location.reload();}
        });
      }
    });
  }
});

$(".can").click(function(){
  $("#vermovimiento").modal("hide");
});

$('#otro_monto').keyup(function (e) {
  var aa = parseFloat($(this).val());
  var a = $("#txtstock b").html();
  console.log(a);
  console.log(aa);
  var aaa = (aa==0 || isNaN(aa)) ? (" ") : (a - aa).toFixed(2);
  $("#txtstock_f b").html(aaa);
});


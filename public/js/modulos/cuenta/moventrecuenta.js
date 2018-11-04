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

  $.validator.addMethod("regex", function(value, element) {
    var exp = value;
    if (exp <= 0) { return false; }
    else {
      if($.isNumeric(exp)){ return true; }
      else{ return false; }
    }
  }, "Solo #s Mayores a 0");

  $('#form_cobranza').validate({
    rules:
    {
      fecha_ingreso: { formespn:true },
      monto: { regex:true },
      id_cuentapartida:{required:true},
      id_moneda:{required:true},
      cuentallegada:{required:true},
    },
    messages: 
    {
      id_cuentapartida:{required:"Seleccione"},
      id_moneda:{required:"Seleccione"},
      cuentallegada:{required:"Seleccione"},
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
      if(element.parent('.col-md-4').length) 
      { 
        error.insertAfter(element.parent()); 
      }
      else
      {
        error.insertAfter(element);
      }
    },
    submitHandler: function() {
      var sto = parseFloat($('#stock').val());
      var mon = parseFloat($('#monto').val());
      sto = (sto>0) ? (sto) : (0);
      if(sto<mon)
      {
        $('#monto').addClass('erroinput');
        alerta('Verificar!', 'Stock Insuficiente', 'error');
      }
      else
      {
        if($('#id_cuentapartida').val()==$('#id_cuentallegada').val())
        {
          alerta('Verificar!', 'Cuentas iguales', 'error');
        }
        else
        {
          $.ajax({
            url: $('base').attr('href') + 'moventrecuenta/save_moventrecuenta',
            type: 'POST',
            data: $('#form_cobranza').serialize(),
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

                $('#editcobranza').modal('hide');

                buscar_moventrecuentas(page);
              }
              else
              {
                limpiarform();
              }
            },
            complete: function() {
              $.LoadingOverlay("hide");
              alerta('Transferencia',' hecha correctamente!!','success');
              limpiarform();
            }
          });/**/
        }
      }
    }
  });

  $('#fechad_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#fechai_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });
});

$(document).on('click', 'table#datatable-buttons  tr#filtro a.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input').val('');
  $('#'+id).find('select').val('');
  buscar_moventrecuentas(0);
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
  $('.sim').html('');
  $('td.stock span').html('');
  $('td.nuevomonto span').html('');
  $('#id_cuentapartida').html('');
  $('#id_cuentallegada').html('');
  limp_todo( "form_cobranza" );
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_moventrecuentas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_moventrecuentas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_moventrecuentas(page);
});

function buscar_moventrecuentas(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var fechad_busc = $('#fechad_busc').val();
  var id_usu = $('#id_usuario').val();
  var fecha_ingreso = $('#fechai_busc').val();
  var id_mon = $('#moneda_busc').val();
  var tipomov = $('#id_tipomov').val();
  var cuentapartida = $('#cuenta_partida').val();
  var cuentallegada = $('#cuenta_llegada').val();

  var temp = "page="+page;
  if(parseInt(id_mon)>0)
  {
    temp+='&id_moneda='+id_mon;
  }
  if(fecha_ingreso.trim().length)
  {
    temp+='&fecha_ingreso='+fecha_ingreso;
  }
  if(codigo_busc.trim().length)
  {
    temp+='&codigo_busc='+codigo_busc;
  }
  if(fechad_busc.trim().length)
  {
    temp+='&fechad_busc='+fechad_busc;
  }
  if(parseInt(id_usu)>0)
  {
    temp+='&id_usuario_creado='+id_usu;
  }
  if(parseInt(tipomov)>0)
  {
    temp+='&tipomovimiento='+tipomov;
  }
  if(parseInt(cuentapartida)>0)
  {
    temp+='&cuentapartida='+cuentapartida;
  }
  if(parseInt(cuentallegada)>0)
  {
    temp+='&cuentallegada='+cuentallegada;
  }
  $.ajax({
      url: $('base').attr('href') + 'moventrecuenta/buscar_moventrecuentas',
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

$(document).on('change', '#id_cuentapartida', function (e) {
  $('table#cuentallegada tbody tr td.stock span').html('');
  var padre = $(this);
  var idcuenta = parseInt(padre.val());
  var idmon = $('#id_moneda').val();
  var idcuentan = idcuenta;
  if(idcuenta>0 && idmon>0)
  {
    temp='idmoneda='+idmon+'&idcuenta='+idcuenta;
    $.ajax({
      url: $('base').attr('href') + 'moventrecuenta/stock_cuentamon',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          var simbolo = $('#id_moneda option:selected').attr('sim');
          var stock = response.data.stock;
          $('.sim').text(simbolo);
          $('#cuentapartida .stock span').text(stock);
          $('#stock').val(stock);
          $('#monto').trigger('keyup');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });


    $.ajax({
      url: $('base').attr('href') + 'moventrecuenta/cuentas_llegada',
      type: 'POST',
      data: 'id_cuenta='+idcuentan,
      dataType: "json",
      beforeSend: function() {
        //$.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_cuentallegada').html(response.data.cbxcuenta.out);
          
        }
      },
      complete: function() {
        //$.LoadingOverlay("hide");
      }
    });    
  }
});

$(document).on('change', '#id_moneda', function (e) {
  //console.log($('table#cuentallegada tbody tr td.stock span'));

  $('table#cuentallegada tbody tr td.stock span').html('');
  $('table#cuentallegada tbody tr td.mfinal span').html('');

  var padre = $(this);
  var idmon = parseInt(padre.val());
  var moneda = '';
  $('.sim').html('');
  $('td.stock span').html('');
  $('.mfinal span').html('');
  $('#id_cuentapartida').html('');
  $('#id_cuentallegada').html('');
  $('#monto').val('');
  $('.nuevomonto span').html('');
  if(idmon>0)
  {
    var temp = 'idmoneda='+idmon;
    $.ajax({
      url: $('base').attr('href') + 'moventrecuenta/cbx_cuentasxtrans',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {

          $('#id_cuentapartida').html(response.data.cbxcuenta.in);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
  else
  {
    swal('error','Seleccione Moneda','error');
  }
});

$(document).on('change', '#id_cuentallegada', function (e) {
  var padre = $(this);
  var cajll = parseInt(padre.val());
  var idmon = parseInt($('#id_moneda').val());
  if(cajll>0 && idmon>0)
  {
    temp='idmoneda='+idmon+'&cajll='+cajll;
    $.ajax({
      url: $('base').attr('href') + 'moventrecuenta/stock_cuentamoneda',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('table#cuentallegada tbody tr td.stock span').html(response.data.lleg);
          $('#monto').trigger('keyup');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('focusout', '#monto', function (e) {
  var cant = parseFloat($(this).val());
  $('table#cuentallegada tbody tr td.nuevomonto span').html(cant);
});

$(document).on('click', '.ver_info', function (e) {
  var tis = $(this);
  var padre = tis.closest('tr');
  var idcob = parseInt(padre.attr('idcobranza'));
  if(idcob>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'moventrecuenta/ver_documento',
      type: 'POST',
      data: 'id_cobranza='+idcob,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#verdocu').html(response.data.codigo);
          $('#verform_cobranza').html(response.data.html);
          $('#verform_sis').html(response.data.htm);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('focusout', '.add_trans', function (e) {
  limpiarform();
  var fec = $('#form_cobranza').attr('fecha');
  $('#fecha_ingreso').val(fec);
});

$("#usuario").autocomplete({
  type:'POST',
  serviceUrl: $('base').attr('href')+"usuarios/get_usuario",
  onSelect: function (suggestion) 
  {
    $('#id_usuario').val(suggestion.id_usuario);
  }
});

$(document).on('change','#moneda_busc',function () {
  var id = $(this).val();
  $('#cuenta_partida').html('');
  $('#cuenta_llegada').html('');
  if(parseInt(id)>0)
  {
    var temp = 'idmoneda='+id;
    $.ajax({
      url: $('base').attr('href') + 'moventrecuenta/cbx_cuentadetin',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#cuenta_partida').html(response.data.cbxcuenta);
          $('#cuenta_llegada').html(response.data.cbxcuenta);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$('#monto').keyup(function () {
  var id_moneda = parseInt($('#id_moneda').val());
  var cuenta_o = parseInt($('#id_cuentapartida').val());
  var cuenta_ll = parseInt($('#id_cuentallegada').val());
  //console.log(id_moneda);
  //console.log(cuenta_o);
  //console.log(cuenta_ll);
  if(id_moneda>0 && cuenta_o>0)
  {
    //Cuenta Origen
    var stock = parseFloat($('#cuentapartida tbody td.stock input').val());
    var monto = parseFloat($(this).val());
    var nuevomonto = stock-monto;
    // console.log(stock);
    // console.log(monto);
    // console.log(nuevomonto);
    //console.log($('#cuentapartida tbody td.mfinal span').length);
    $('#cuentapartida tbody td.mfinal span').html(nuevomonto);
    
  }
  else
  {
    $('#cuentapartida td.mfinal .sim').html('');
    $('#cuentapartida td.mfinal span').html('0.00');
  }

  //Cuenta Destino

  if(id_moneda>0 && cuenta_ll>0)
  {
    var stock = parseFloat($('#cuentallegada tbody td.stock span').html());
    var monto = parseFloat($(this).val());
    var nuevomonto = stock+monto;
    //console.log(nuevomonto);
    $('#cuentallegada tbody td.mfinal span').html(nuevomonto);
  }
  else
  {
    $('#cuentallegada td.mfinal .sim').html('');
    $('#cuentallegada td.mfinal span').html('0.00');
  }

  
});

$('.ver_obser').click(function(){
  var tis = $(this);
  var padre = tis.closest('tr');
  var idcob = parseInt(padre.attr('idcobranza'));
  //console.log(idcob);
  $.ajax({
    url: $('base').attr('href') + 'moventrecuenta/ver_observacion',
    type: 'POST',
    data: 'id_cobranza='+idcob,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
    if (response.code==1) {
      $('#verform_obser').html(response.data.html);
      $('#verform_sis_ob').html(response.data.htm);
    }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });

});

$(document).on('click', '#editmov_en', function () {
  var id_cobranza_nu = parseInt($('#id_cobranza_nu').html());
  var id_cobranzapa = parseInt($('table#partida thead').prop('id'));
  var id_cobranzall = parseInt($('table#llegada thead').prop('id'));
  var voucher_nu = $('#voucher_nu').val();
  var observacion_nu = $('#observacion_nu').val();
  var temp= 'id_cobranza='+id_cobranza_nu;
  temp+='&voucher='+voucher_nu;
  temp+='&observacion='+observacion_nu;
  temp+='&id_cobranza_det_pa='+id_cobranzapa;
  temp+='&id_cobranza_det_ll='+id_cobranzall;
  console.log(temp);
  $.ajax({
    url:$('base').attr('href')+'moventrecuenta/editmoventrecuenta',
    type:'POST',
    data:temp,
    dataType:"json",
    beforeSend:function(){
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});   
    },
    success:function(response){
      $('#verobserva').modal("hide");
      buscar_moventrecuentas();
    },
    complete:function(){
      $.LoadingOverlay("hide");
      location.reload();
    }
  });
});

$(document).on('click','#cancel_edit' , function() {
  var page=0;
  buscar_moventrecuentas(page);
  $('#verobserva').modal("hide");
  location.reload();
});
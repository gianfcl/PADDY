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

  $('#form_nuevoingreso').validate({
    rules:
    {
      fecha_documento: { formespn:true },
      monto: { regex:true },
      id_cuenta:{required:true},
      id_moneda:{required:true},
      id_motivo:{required:true},
    },
    messages: 
    {
      id_cuenta:{required:"Seleccione"},
      id_moneda:{required:"Seleccione"},
      id_motivo:{required:"Seleccione"},
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
      $.ajax({
        url: $('base').attr('href') + 'ingresoxajustecuent/save_ingresoxajustecuenta',
        type: 'POST',
        data: $('#form_nuevoingreso').serialize(),
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

            $('#editnuevo').modal('hide');

            buscar_ingresoxajustecuenta(page);
          }
          else
          {
            limpiarform();
          }
        },
        complete: function() {
          var id_nuevoingreso = parseInt($('#id_nuevoingreso').val());
          id_nuevoingreso = (id_nuevoingreso>0) ? (id_nuevoingreso) : ("0");
          var text = (id_nuevoingreso=="0") ? ("Guardo!") : ("Edito!");
          alerta(text, 'Con exito este Ajuste '+text+'.', 'success');
          limpiarform();
        }
      });/**/
    }
  });

  $('#fechac_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#fechaid_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    maxDate: moment()
  });

});

  $('#verform_nuevoingreso').validate({
  rules:
  {
    fecha_ingreso: { formespn:true },
    monto: { regex:true },
    id_cuenta:{required:true},
    id_moneda:{required:true},
  },
  messages: 
  {
    id_cuenta:{required:"Seleccione"},
    id_moneda:{required:"Seleccione"}
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
    var id_cobranza = parseInt($('#id_cob').html());
    var observacion_1 = $('#observacion_1').val();
    var voucher_1 = parseInt($('#voucher_1').val());
    
    var tem='id_cobranza='+id_cobranza;
    tem=tem+'&observacion='+observacion_1;
    tem=tem+'&voucher='+voucher_1;
    console.log(tem);

    $.ajax({
      url: $('base').attr('href') + 'ingresoxajustecuent/edit_detallemov',
      type: 'POST',
      data: tem,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          swal('¡Listo!','Datos guardos correctamente','success');
          $('#vercobranza').modal('hide');
          buscar_ingresoxajustecuenta(0);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
  });

$(document).on('click', 'table#datatable-buttons  tr#filtro a.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input').val('');
  $('#id_moneda_busc').val('');
  $('#id_cuenta_busc').html('');
  buscar_ingresoxajustecuenta(0);
});

$(document).on('focusout', '.add_invent', function (e) {
  //limpiarform();
  var fec = $('#form_nuevoingreso').attr('fecha');
  var idmone = $('#id_moneda').val();
  $('#fecha_documento').val(fec);
  if (parseInt(idmone)) {
    var temp= 'idmoneda='+idmone;
    $.ajax({
      url: $('base').attr('href') + 'ingresoxajustecuent/cbx_cuentadetin',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        //$.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_cuenta').html(response.data.cbxcuenta);
          $('#simbo').html(response.data.simbolo);
          $('#id_saldo').html('');
          $('#simbo1').html(response.data.simbolo);
          $('#simbo2').html(response.data.simbolo);
        }
      },
      complete: function() {
        //$.LoadingOverlay("hide");
      }
  });
  }
});

$(document).on('click', '.add_cobranza', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editnuevo').modal('hide');
});


function buscar_ingresoxajustecuenta(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var fechac_busc = $('#fechac_busc').val();
  var id_usuario = $('#id_usuario').val();
  var fecha_ingreso = $('#fechaid_busc').val();
  var id_motivo = $('#id_motivo_busc').val();
  var id_moneda = $('#id_moneda_busc').val();
  var voucher_busc = $('#voucher_busc').val();
  var id_cuenta = $('#id_cuenta_busc').val();

  var temp = "page="+page;
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(fechac_busc.trim().length)
  {
    temp=temp+'&fechac_busc='+fechac_busc;
  }
  if(parseInt(id_usuario)>0)
  {
    temp=temp+'&id_usuario='+id_usuario;
  }
  if(fecha_ingreso.trim().length)
  {
    temp=temp+'&fecha_ingreso='+fecha_ingreso;
  }
  if(parseInt(id_moneda)>0)
  {
    temp=temp+'&id_moneda='+id_moneda;
  }
  if(parseInt(id_motivo)>0)
  {
    temp=temp+'&id_motivo='+id_motivo;
  }
  if(voucher_busc.trim().length)
  {
    temp=temp+'&voucher_busc='+voucher_busc;
  }
  if(parseInt(id_cuenta)>0)
  {
    temp=temp+'&id_cuenta='+id_cuenta;
  }
  console.log(temp);
  $.ajax({
      url: $('base').attr('href') + 'ingresoxajustecuent/buscar_ingresoxajustecuentas',
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

$(document).on('change', '#id_moneda', function (e) {
  var padre = $(this);
  var idmon = parseInt(padre.val());
  $('#id_cuenta').html('');
  if(idmon>0)
  {
    var temp = 'idmoneda='+idmon;
    
    $.ajax({
      url: $('base').attr('href') + 'ingresoxajustecuent/cbx_cuentadetin',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_cuenta').html(response.data.cbxcuenta);
          $('#simbo').html(response.data.simbolo);
          $('#id_saldo').html('');
          $('#simbo1').html(response.data.simbolo);
          $('#simbo2').html(response.data.simbolo);
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
  var mon = $('#id_moneda');
  var idcu = parseInt(padre.val());
  var idmon = parseInt(mon.val());
  //$('#id_montocuenta').html('');
  if(idcu>0 && idmon>0)
  {
    var temp = 'id_cuenta='+idcu;
    temp=temp+'&id_moneda='+idmon;
    
    $.ajax({
      url: $('base').attr('href') + 'ingresoxajustecuent/cbx_moncuenta',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_saldo').html(response.data);
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
  $('#id_nuevoingreso').val('0');
  $('#cobranza').val('');
  $('#monto').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  limp_todo( "form_nuevoingreso" );
}


$("#usuario").autocomplete({
  type:'POST',
  serviceUrl: $('base').attr('href')+"usuarios/get_usuario",
  onSelect: function (suggestion) 
  {
    $('#id_usuario').val(suggestion.id_usuario);
  }
});

$(document).on('click', '.ver_info', function (e) {
  var tis = $(this);
  $('#sistemas-tab').closest('li').removeClass('hidden');
  var padre = tis.closest('tr');
  var idcob = parseInt(padre.attr('idcobranza'));
  console.log(idcob);
  if(idcob>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'ingresoxajustecuent/ver_documento',
      type: 'POST',
      data: 'id_nuevoingreso='+idcob,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          //$('#verdocu').html(response.data.codigo);
          $('#verform_nuevoingreso').html(response.data.html);
          $('#verform_sis').html(response.data.htm);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('click', '.ver_obser', function (e) {
  var tis = $(this);
  var padre = tis.closest('tr');
  var idcob = parseInt(padre.attr('idcobranza'));
  console.log(idcob);
  if(idcob>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'ingresoxajustecuent/ver_observacion',
      type: 'POST',
      data: 'id_nuevoingreso='+idcob,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#verobser').html(response.data.codigo);
          $('#verform_obser').html(response.data.html);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_ingresoxajustecuenta(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_ingresoxajustecuenta(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_ingresoxajustecuenta(page);
});

$('#monto').keyup(function(){
  var montosum = parseFloat($('#monto').val());
  var saldof= parseFloat($('#id_saldo').text());
  console.log(montosum);

  saldof = saldof + montosum;
  if (isNaN(saldof)) {}else{
    $('#id_saldo_final').html((saldof).toFixed(2));
  }

});

$(document).on('click', '#datatable-buttons .refresh', function (e) {
  $("#fechac_busc").val('');
  $("#id_usuario").val('');
  $("#usuario").val('');
  $("#codigo_busc").val('');
  $("#fechaid_busc").val('');
  $("#id_moneda_busc").val('');
  $("#id_cuenta_busc").val('');
  $("#voucher_busc").val('');
  $("#id_motivo_busc").val('');
});
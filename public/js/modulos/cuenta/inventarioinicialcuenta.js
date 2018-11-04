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
      $.ajax({
        url: $('base').attr('href') + 'saldoinicialcuenta/save_inventarioinicialcuenta',
        type: 'POST',
        data: $('#form_cobranza').serialize(),
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

            $('#editcobranza').modal('hide');

            buscar_inventarioinicialcuentas(page);
          }
          else
          {
            limpiarform();
          }
        },
        complete: function() {
          var id_cobranza = parseInt($('#id_cobranza').val());
          id_cobranza = (id_cobranza>0) ? (id_cobranza) : ("0");
          var text = (id_cobranza=="0") ? ("Guardo!") : ("Edito!");
          alerta(text, 'Con exito este Inventario '+text+'.', 'success');
          limpiarform();
        }
      });/**/
    }
  });

  $('#verform_cobranza').validate({
    rules:
    {
      fecha_ingreso: { formespn:true },
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
      $.ajax({
        url: $('base').attr('href') + 'saldoinicialcuenta/edit_detallemov',
        type: 'POST',
        data: $('#verform_cobranza').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            swal('¡Listo!','Datos guardos correctamente','success');
            $('#vercobranza').modal('hide');
            buscar_inventarioinicialcuentas(0);
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });/**/
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

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    maxDate: moment()
  });
});

$(document).on('click', 'table#datatable-buttons  tr#filtro a.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input').val('');
  $('#id_moneda_busc').val('');
  $('#id_cuenta_busc').html('');
  buscar_inventarioinicialcuentas(0);
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

  limp_todo( "form_cobranza" );
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_inventarioinicialcuentas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_inventarioinicialcuentas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_inventarioinicialcuentas(page);
});

function buscar_inventarioinicialcuentas(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var fechad_busc = $('#fechad_busc').val();
  var id_usuario = $('#id_usuario').val();
  var fecha_ingreso = $('#fechai_busc').val();
  var id_moneda = $('#id_moneda_busc').val();
  var id_cuenta = $('#id_cuenta_busc').val();

  var temp = "page="+page;
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(fechad_busc.trim().length)
  {
    temp=temp+'&fechad_busc='+fechad_busc;
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
  if(parseInt(id_cuenta)>0)
  {
    temp=temp+'&id_cuenta='+id_cuenta;
  }

  $.ajax({
      url: $('base').attr('href') + 'saldoinicialcuenta/buscar_inventarioinicialcuentas',
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
  $('#id_cuenta').html('');
  var padre = $(this);
  var idmon = parseInt(padre.val());
  if(idmon>0)
  {
    var temp = 'idmoneda='+idmon;  
    $.ajax({
      url: $('base').attr('href') + 'saldoinicialcuenta/cbx_cuentadetin',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_cuenta').html(response.data.cbxcuenta);
          $('#simbo').html(response.data.simbolo);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    }); 
  }
});

$(document).on('click', '.ver_info', function (e) {
  var tis = $(this);
  var padre = tis.closest('tr');
  var idcob = parseInt(padre.attr('idcobranza'));
  if(idcob>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'saldoinicialcuenta/ver_documento',
      type: 'POST',
      data: 'id_cobranza='+idcob,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#tipomov').html("Saldo Inicial Cuenta <b id='verdocu'>"+response.data.codigo+"</b>");
          $('#verform_cobranza').html(response.data.html);
          $('#idcob2').val(idcob);
          $('#verform_infosis').html(response.data.htm);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('focusout', '.add_invent', function (e) {
  limpiarform();
  var fec = $('#form_cobranza').attr('fecha');
  $('#fecha_ingreso').val(fec);
  $('#id_moneda').change();
});

$(document).on('change','#id_moneda_busc',function () {
  var id = $(this).val();
  if(parseInt(id)>0)
  {
    var temp = 'idmoneda='+id;
    $.ajax({
      url: $('base').attr('href') + 'moventrecuenta/cbx_cuentadetin',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        //$.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_cuenta_busc').html(response.data.cbxcuenta);
        }
      },
      complete: function() {
        //$.LoadingOverlay("hide");
      }
    });
  }
});

$("#usuario").autocomplete({
  type:'POST',
  serviceUrl: $('base').attr('href')+"usuarios/get_usuario",
  onSelect: function (suggestion) 
  {
    $('#id_usuario').val(suggestion.id_usuario);
  }
}); 
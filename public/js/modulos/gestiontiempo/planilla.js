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
      id_personal: { required:true },
      dni: { required:true },
      nombres: { required:true },
      apellidos: { required:true }
    },
    messages: 
    {
      id_personal: { required:"Buscar y Seleccionar" },
      dni: { required:"Ingresar" },
      nombres: { required:"Ingresar" },
      apellidos: { required:"Ingresar" }
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
      var sto = parseFloat($('#txtstock1 input').val());
      var mon = parseFloat($('#monto1').val());
      sto = (sto>0) ? (sto) : (0);
      var cbx = parseInt($('#id_cuenta1').val());
      cbx = (cbx>0) ? (cbx) : (0);
      if(sto<mon && cbx)
      {
        $('#monto1').addClass('erroinput');
        alerta('Verificar!', 'Stock Insuficiente', 'error');
      }
      else
      {
        $.ajax({
          url: $('base').attr('href') + 'planilla/save_adelanto',
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

              limpiarform();
              buscar_adelantos(page);
            }
            else
            {
              limpiarform();
            }
          },
          complete: function() {
            var id_cobranza = parseInt($('#id_cobranza1').val());
            id_cobranza = (id_cobranza>0) ? (id_cobranza) : ("0");
            var text = (id_cobranza=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Con exito este Adelanto '+text+'.', 'success');            
          }
        });/**/
      }
    }
  });

  $('#form_busc_planilla').validate({
    rules: 
    {
      id_personal: { required:true},
      mes: {required:true}
    },
    messages: 
    {
      id_personal: { required:"Seleccionar" },
      mes: { required:"Ingresar" }
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
      if(element.parent('.col-md-4').length) { error.insertAfter(element.parent()); }
      else {}
    },
    submitHandler: function() {
      var url = $('#linkmodulo').val();
      var idpl = parseInt($('#id_personal').val());
      var mes = $('#mes').val();
      if(idpl>0 && (mes.trim().length)>0)
      {
        window.location.href = url+'/buscar/'+idpl+'/'+mes;
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

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    maxDate: moment()
  });

  $('#datetimepicker7').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#selemes').datetimepicker({    
    viewMode: 'years',
    format: '-YYYY HH:mm A',
    locale: moment.locale("es")
  });
});

$(document).on('click', '.add_invent', function (e) {
  //$('#id_moneda1').val('');
  $('#observacion1').val('');
  $('#monto1').val('');
  $('#id_cobranza1').val('');
  var mes = parseInt(($('#mes').val()).split("-")[0])-1;
  
  $('#datetimepicker7').data("DateTimePicker").minDate(primerdia_mes(mes));
  $('#datetimepicker7').data("DateTimePicker").maxDate(ultimodia_mes(mes));

  //var fec = $('#form_cobranza').attr('fecha');
  //$('#fecha_ingreso1').val('');

});

$(document).on('change', '#id_moneda1', function (e) {
  var padre = $(this);
  var idmon = parseInt(padre.val());
  $('#id_cuenta1').html('');
  $('#txtstock1 b').html('');
  $('#txtstock1 input').val('');
  if(idmon>0)
  {
    var temp = 'idmoneda='+idmon;
    
    $.ajax({
      url: $('base').attr('href') + 'salidaxprestamo/cbx_cuentadetin',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_cuenta1').html(response.data.cbxcuenta);
          $('#simbo1').html(response.data.simbolo);
          $('#txtstock1 em').html(response.data.simbolo);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    }); 
  }
});

$(document).on('change', '#id_cuenta1', function (e) {
  var padre = $(this);
  var idcuenta = parseInt(padre.val());
  var idmon = parseInt($('#id_moneda1').val());
  $('#txtstock1 b').html('');
  $('#txtstock1 input').val('');
  if(idcuenta>0 && idmon>0)
  {
    temp='idmoneda='+idmon+'&idcuenta='+idcuenta;
    $.ajax({
      url: $('base').attr('href') + 'salidaxprestamo/stock_cuentamoneda',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#txtstock1 b').html(response.data.stock);
          $('#txtstock1 input').val(response.data.stock);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

function buscar_adelantos(page)
{
  location.reload();
}

function limpiarform()
{
  $('#id_cobranza1').val('0');
  $('#cobranza').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');
  limp_todo( "form_cobranza" );
  $('#idpnl').val($('#id_personal').val());

  $('#id_moneda1').val('');
  $('#observacion1').val('');
  $('#monto1').val('');
}

$(document).on('click', '.edit_info', function (e) {
  var tis = $(this);
  var padre = tis.closest('tr');
  var idcobranza = parseInt(padre.attr('idcobranza'));
  console.log("idcobranza=>"+idcobranza);
  if(idcobranza>0)
  {    
    $.ajax({
      url: $('base').attr('href') + 'planilla/edit_adela',
      type: 'POST',
      data: 'id_cobranza='+idcobranza,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#fecha_ingreso1').val(response.data.fecha_ingreso);
          var mes = parseInt(($('#mes').val()).split("-")[0])-1;
          $('#datetimepicker7').data("DateTimePicker").minDate(primerdia_mes(mes));
          $('#datetimepicker7').data("DateTimePicker").maxDate(ultimodia_mes(mes));
          var estado = response.data.estado;

          $('#id_moneda1').val(response.data.id_moneda);
          $('#id_cuenta1').html(response.data.cbx);
          $('#monto1').val(response.data.monto);
          $('#stoki1').val(response.data.stoki);
          $('#observacion1').val(response.data.observacion);
          $('#txtstock1 b').html(response.data.stock);
          $('#txtstock1 input').val(response.data.stock);
          $('#id_cobranza_det1').val(response.data.id_cobranza_det);
          $('#id_cobranza1').val(response.data.id_cobranza);
          $('#simbo1').html(response.data.simbolo);
          if(estado == 2 || estado == 4)
          {
            $('#id_moneda1').attr("style", "pointer-events: none;");
            $('#monto1').prop('readonly',true);
          }
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idcobranza = $(this).parents('tr').attr('idcobranza');

  var page = parseInt($('#paginacion_data ul.pagination li.active a').attr('tabindex'));
  var um_busc = $('#um_busc').val();
  page = (page>0) ? (page) : (0); console.log(page);

  var temp = "page="+page;

  if(idcobranza > 0)
  {
    var nomb = "Adelanto";
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
          url: $('base').attr('href') + 'planilla/delete_adela',
          type: 'POST',
          data: 'id_cobranza='+idcobranza+'&estado=0',
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
              if (response.code==1) {
                buscar_adelantos(temp);
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
  }        
});

$(document).on('change', '.cla', function (e) {
  var tip = $(this).attr('tipo'); console.log(tip);
  var id = parseInt($(this).closest('tr').attr('id'));
  var che = ($(this).is(':checked')) ? (2): (1);
  var temp = "id_personalhorariomarca="+id+'&check'+tip+'='+che;

  var check = 0;
  var sum = 0;
  var idd = 0;
  var val = 0;

  $('table#planilla tbody tr td.'+tip+' span.pull-right').each(function (index, value){
    check = ($(this).closest('td').find('input.cla').is(':checked')) ? (2): (1);
    val = parseFloat($(this).html());
    if(check==1)
    {
      sum = sum + val;
    }  
  });
  sum = (sum>0) ? (sum.toFixed(2)) : ("0.00");
  $('table#planilla tr.sumtotal td.sum'+tip+' span.pull-right').html(sum);
  sum = 0
  $('table#planilla tbody tr.sumtotal td span.pull-right').each(function (index, value){
    val = parseFloat($(this).html());
    sum = sum + val;
  });
  sum = (sum>0) ? (sum.toFixed(2)) : ("0.00");
  $('table#planilla tr.sumartodo td.sumatodo span.pull-right').html(sum);
  if(id>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'planilla/save_chekpago',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) 
        {
          
        }
      },
      complete: function(response) {
        $.LoadingOverlay("hide");
      }
    });
  }
    
});

$(document).on('change', '#id_areapuesto', function (e)
{
  var idarea = parseInt($(this).val());
  idarea = (idarea>0) ? (idarea) : ("");
  $('#id_puesto').html('');
  $('#id_personal').html('');
  if(idarea>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'puesto/commbx',
      type: 'POST',
      data: 'id_areapuesto='+idarea,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
    if (response.code==1) {
      $('#id_puesto').html(response.data);
    }                    
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('change', '#id_puesto', function (e)
{
  var idpue = parseInt($(this).val());
  idpue = (idpue>0) ? (idpue) : ("");
  $('#id_personal').html('');
  if(idpue>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'personal/buscar_pnl_puesto',
      type: 'POST',
      data: 'id_puesto='+idpue,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
    if (response.code==1) {
      $('#id_personal').html(response.data);
    }                    
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});


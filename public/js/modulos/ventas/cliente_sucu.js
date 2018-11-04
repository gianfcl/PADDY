$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form-add-contactos').validate({
        rules:
        {
          apellidos:
          {
            required:true,
            minlength: 3
          },
          nombres:
          {
            required:true,
            minlength: 3
          },
          cargo:
          {
            required:true
          },
          celular:
          {
            rangelength:[9,9],
            number:true
          }            
        },
        messages: 
        {
          apellidos:
          {
            required:"",
            minlength: ""
          },
          nombres:
          {
            required:"",
            minlength: ""
          },
          cargo:
          {
            required:""
          },
          celular:
          {
            rangelength:"Celular Incorrecto",
            number:""
          }
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
            if(element.parent('.col-md-12').length) { error.insertAfter(element.parent()); }
            else if(element.parent('.col-md-9').length) { error.insertAfter(element.parent()); }
            else {}         
        },
        submitHandler: function() {
          var orden_ = 0;
          var orden = 0;
          var id_sucursal = 0;
          var id_contacto = $('#id_contacto').val();
          if($('.row_sucursal').length>0)
          {
            orden_ = $('.row_sucursal:last').attr('orden');
            
            if($('#contacto_cont_'+orden_+' table tbody tr').length>0)
            {
              orden = $('#row_sucursal_'+orden_+' table tbody tr:last').attr('orden');
            }    
          }
          var id_sucursal = $(document).data('datsucu');
          //alerta('Ok',"lo formamos-->"+orden+'id_sucursal-->'+id_sucursal,'success');
          if(id_sucursal!=0)
          {            
            $.ajax({
                url: $('base').attr('href') + 'clientes/save_contacto',
                type: 'POST',
                data: $('#form-add-contactos').serialize()+'&orden='+orden+'&id_sucursal='+id_sucursal,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var link = ($('#tipo_persona').val()==1) ? ('edit_juri') : ('edit_nat');
    
                      var id_cliente = $('#id_cliente').val();
                      window.location.href = $('base').attr('href') +'clientes/'+link+'/'+id_cliente;                        
                    }
                },
                complete: function() {
                    //hideLoader();
                }
            });
          }
            
        }
    });

    $.validator.addMethod("time24", function(value, element) {
        var exp = value;
        if($.trim(exp).length>0)
        {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [APap][mM]$/.test(value);
        }
        else
        {
          return true;
        }
    }, "");

    $.validator.addMethod("formespn",
      function(value, element) {
        if(value.trim().length)
          return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
        else
          return true;
    }, "Ingrese est Formato dd-mm-yyyy");

    $('#form-add-sucursal').validate({
        rules:
        {
          nombre_sede:
          {
            required:true,
            minlength: 3,
            remote: {
              url: $('base').attr('href') + 'clientes/validar_sede',
              type: "post",
              data: {
                nombre_sede: function() { return $( "#nombre_sede" ).val(); },
                id_cliente: function() { return $('#id_cliente').val(); },
                id_sucursal: function() { return $('#id_sucursal').val(); }
              }
            }
          },
          direccion:
          {
            required:true,
            minlength: 3
          },
          id_departamento:
          {
            required:true
          },
          id_provincia:
          {
            required:true
          },
          id_distrito:
          {
            required:true
          },
          hora_inicio:
          {
            time24:true
          }          
        },
        messages: 
        {
          nombre_sede:
          {
            required:"",
            minlength: "",
            remote: "Ya existe"
          },
          direccion:
          {
            required:"",
            minlength: ""
          },
          id_departamento:
          {
            required:""
          },
          id_provincia:
          {
            required:""
          },
          id_distrito:
          {
            required:""
          }
        },      

        highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
            $(element).closest('.col-md-9').addClass('has-error');         
        },
        unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
            $(element).closest('.col-md-9').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) 
        {
            if(element.parent('.col-md-12').length) { error.insertAfter(element.parent()); }
            else if(element.parent('.col-md-9').length) { error.insertAfter(element.parent()); }
            else {}             
        },
        submitHandler: function() {
          var orden = ($('.row_sucursal').length>0) ? ($('.row_sucursal:last').attr('orden')) : (0);
          var id_cliente = $('#id_cliente').val();

          $.ajax({
              url: $('base').attr('href') + 'clientes/save_sucurssal',
              type: 'POST',
              data: $('#form-add-sucursal').serialize()+'&orden='+orden+'&id_cliente='+id_cliente,
              dataType: "json",
              beforeSend: function() {
                  //showLoader();
              },
              success: function(response) {
                if (response.code==1) 
                {
                  if(id_cliente=='0')
                  {
                    $('#cont_sucursales').append(response.data);
                    $('#modalsucursal').modal('hide');
                  }
                  else
                  {
                    var link = ($('#tipo_persona')==1) ? ('edit_juri') : ('edit_nat');
      
                    var id_cliente = $('#id_cliente').val();
                    window.location.href = $('base').attr('href') +'clientes/'+link+'/'+id_cliente;
                  }
                }
              },
              complete: function() {
                  //hideLoader();
              }
          });
        }
    }); 
    
});

$(function () {
  $('#hora_fin').datetimepicker({format: 'LT'});
  $('#hora_inicio').datetimepicker({format: 'LT'});
});

$(document).on('click', '.delete_cont', function (e)
{
  e.preventDefault();
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este contacto?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if(isConfirm)
    {
      $(this).parents('.row').remove();
    }    
  }); 
});

$(document).on('hidden.bs.modal', '#modalcontacto', function (e)
{
  limpiarcontacto();
});

$(document).on('click', '.btn_cancelconct', function (e)
{
  limpiarcontacto();
});

$(document).on('click', '.cont_modal', function (e)
{    
  html_operador('tipo=add_operadortel&orden=0', 'div_tel');
  html_operador('tipo=add_operadorcel&orden=0', 'div_celu');
  limpiarcontacto();
  var idsucu = parseInt($(this).attr('idsucu'));
  if(idsucu>0)
  {
    $(document).data('datsucu',idsucu);
  }  
});

function limpiarcontacto()
{
  $('form#form-add-contactos').find('input[type=text]').val('');
  $('form#form-add-contactos').find('input[type=hidden]').val('0');
  var validcont = $('#form-add-contactos').validate();
  validcont.resetForm();

  if($('#apel_cont').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#apel_cont').parents('.form-group').removeClass('has-error');
  }  
  if($('#apel_cont-error').length>0)
  {
    $('#apel_cont-error').html("");
  }

  if($('#nom_cont').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#nom_cont').parents('.form-group').removeClass('has-error');
  }  
  if($('#nom_cont-error').length>0)
  {
    $('#nom_cont-error').html("");
  }

  if($('#car_cont').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#car_cont').parents('.form-group').removeClass('has-error');
  }  
  if($('#car_cont-error').length>0)
  {
    $('#car_cont-error').html("");
  }
}

$(document).on('click', '.edit_contact', function (e)
{
    var idcontacto = $(this).parents('tr').attr('idcontacto');
    $.ajax({
      url: $('base').attr('href') + 'clientes/get_one_contacto',
      type: 'POST',
      data: 'id_contacto='+idcontacto,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#id_contacto').val(response.data.id_contacto);
          $('#apel_cont').val(response.data.apellidos);
          $('#nom_cont').val(response.data.nombres);
          $('#car_cont').val(response.data.cargo);          
          $('#ema_cont').val(response.data.email);
          var cel = response.data.celular;
          var tel = response.data.telefono; console.log(jQuery.type(cel));
          if(jQuery.type(cel) === "null")
          {
              html_operador('tipo=add_operadorcel&orden=0', 'div_celu');
          }
          else
          {
            $('#div_celu').html(response.data.celular);
          }

          if(jQuery.type(tel) === "null")
          {
            html_operador('tipo=add_operadortel&orden=0', 'div_tel');
          }
          else
          {
            $('#div_tel').html(response.data.telefono);            
          }
        }
      },
      complete: function() {
          //hideLoader();
      }
  });
    
});

$(document).on('click', '.delete_contact', function (e)
{
  e.preventDefault();
  var idcontacto = $(this).parents('tr').attr('idcontacto');
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este contacto?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if(isConfirm)
    {
      $.ajax({
          url: $('base').attr('href') + 'clientes/delete_contact',
          type: 'POST',
          data: 'id_contacto='+idcontacto+'&estado=0',
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {
                var id_cliente = $('#id_cliente').val();

                var link = ($('#tipo_persona').val()==1) ? ('edit_juri') : ('edit_nat');
        
                window.location.href = $('base').attr('href') +'clientes/'+link+'/'+id_cliente;
              }
          },
          complete: function() {
              //hideLoader();
          }
      });
    }
      
  });
});

$(document).on('hidden.bs.modal', '#modalsucursal', function (e)
{
  $('form#form-add-sucursal').find('input[type=text]').val('');
  $('form#form-add-sucursal').find('input:radio, input:checkbox').prop('checked', false);
});

$(document).on('click', '.delete_sucursal', function (e)
{
  e.preventDefault();
  var idsucursal = $(this).parents('tr').attr('idsucursal');
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar esta Sucursal?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if(isConfirm)
    {
      $.ajax({
        url: $('base').attr('href') + 'clientes/delete_sucursal',
        type: 'POST',
        data: 'id_sucursal='+idsucursal+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              var link = ($('#tipo_persona').val()==1) ? ('edit_juri') : ('edit_nat');
      
              var id_cliente = $('#id_cliente').val();
              window.location.href = $('base').attr('href') +'clientes/'+link+'/'+id_cliente;
            }
        },
        complete: function() {
            //hideLoader();
        }
      });
    }      
  });  
    
});

$(document).on('click', '.edit_sucur', function (e)
{
    var idsucursal = $(this).parents('tr').attr('idsucursal'); console.log("idsucursal->"+idsucursal);
    $.ajax({
      url: $('base').attr('href') + 'clientes/get_one_sucursal',
      type: 'POST',
      data: 'id_sucursal='+idsucursal,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#id_sucursal').val(response.data.id_sucursal);
          $('#nombre_sede').val(response.data.nombre_sede);
          $('#direccion').val(response.data.direccion);
          $('#id_departamento').val(response.data.id_departamento);
          $('#id_provincia').html(response.data.provincia);
          $('#id_distrito').html(response.data.distrito);
          $('#hora_inicio input').val(response.data.hora_inicio);
          $('#hora_fin input').val(response.data.hora_fin);

          jQuery.each( response.data.dias_atencion, function( i, val ) {
            $( "#" + val ).prop( "checked", true ); console.log("#" + val);
          });
        }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.sucur_modal', function (e)
{
  var cant_div = $('#cont_sucursales > .row_sucursal').length;
  var id_cliente = $('#id_cliente').val();
  console.log('cant_div->'+cant_div+' id_cliente->'+id_cliente);

  $.ajax({
      url: $('base').attr('href') + 'clientes/add_sucursal',
      type: 'POST',
      data: 'q=add_sucursal&orden='+cant_div+'&id_cliente='+id_cliente,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#cont_sucursales').append(response.data);
        }
      },
      complete: function() {
          //hideLoader();
      }
  });
});
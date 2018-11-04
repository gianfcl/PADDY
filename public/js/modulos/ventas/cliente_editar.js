$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_pers_juridica').validate({
        rules:
        {
          ruc:
          {
            required:true,
            number: true,
            rangelength:[11,11],
            remote: {
              url: $('base').attr('href') + 'clientes/validar_ruc',
              type: "post",
              data: {
                ruc: function() { return $( "#ruc" ).val(); },
                id_cliente: function() { return $('#id_cliente').val(); }
              }
            }
          },
          razon_social:{ required:true },
          direccion_fiscal:{ required:true },
          id_departamento:{ required:true },
          id_provincia:{ required:true },
          id_distrito:{ required:true },
          email:{email: true },
          aniversario:{formespn:true},
        },
        messages: 
        {
          ruc:
          {
            required:"Ingrese RUC",
            number: "Solo #s",
            rangelength:"RUC Incorrecto",
            remote: "Ya existe"
          },
          razon_social:{ required: "" },
          direccion_fiscal:{ required: "" },
          aniversario:{ date: "Ingrese una fecha valida" },
          id_departamento:{ required:"" },
          id_provincia:{ required:"" },
          id_distrito:{ required:"" },
          email:{email: "Incorrecto" }
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
            if(element.parent('.form-group').length) 
            {
              error.insertAfter(element.parent());
              //element.closest('.control-group').find('.help-block').html(error.text()); 
            } 
            else { 
              if(element.parent('.col-md-12').length) { error.insertAfter(element.parent());}
              else if(element.parent('.col-md-9').length) { error.insertAfter(element.parent());}
              else {}
            }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'clientes/save_cliente',
                type: 'POST',
                data: $('#form_save_pers_juridica').serialize(),
                dataType: "json",
                beforeSend: function() {
                  $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    if (response.code==1) {
                       window.location.href = $('base').attr('href') +'clientes/edit_juri/'+response.data.id+'/sucu'
                    }
                    else
                    {
                      if($('#ruc').parents('.col-md-4').attr('class')=="col-md-4")
                      {
                        $('#ruc').parents('.col-md-4').addClass('has-error');
                      }
                      
                      if($('#ruc-error').length>0)
                      {
                        $('#ruc-error').html(response.message);
                      }
                      else
                      {
                        $('#ruc').parents('.col-md-4').append("<span id='ruc-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                  $.LoadingOverlay("hide");
                }
            });/**/
        }
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
                    $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                  if (response.code==1) {
                    direccionar();                      
                  }
                },
                complete: function() {
                  $.LoadingOverlay("hide");
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
              url: $('base').attr('href') + 'personajuridica/validar_sede',
              type: "post",
              data: {
                nombre_sede: function() { return $( "#nombre_sede" ).val(); },
                id_prsnatjur: function() { return $('#id_prsnatjur').val(); },
                id_sucursal: function() { return $('#id_sucursal').val(); },
                tipo_persona: function() { return $('#tipo_persona').val(); }
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
          var id_prsnatjur = $('#id_prsnatjur').val();
          var tipo_persona = $('#tipo_persona').val();

          $.ajax({
              url: $('base').attr('href') + 'personajuridica/save_sucurssal',
              type: 'POST',
              data: $('#form-add-sucursal').serialize()+'&orden='+orden+'&tipo_persona='+tipo_persona+'&id_prsnatjur='+id_prsnatjur,
              dataType: "json",
              beforeSend: function() {
                $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
              },
              success: function(response) {
                if (response.code==1) 
                {
                  if(id_prsnatjur=='0')
                  {
                    $('#cont_sucursales').append(response.data);
                    $('#modalsucursal').modal('hide');
                  }
                  else
                  {
                    direccionar();
                  }
                }
              },
              complete: function() {
                $.LoadingOverlay("hide");
              }
          });
        }
    });

    $('#fecha_nac_aniv').daterangepicker({
      singleDatePicker: true,
      format: 'DD-MM-YYYY',
      calender_style: "picker_4"
    }, function(start, end, label) {
      console.log(start.toISOString(), end.toISOString(), label);
    });

    $('#aniversario').daterangepicker({
      singleDatePicker: true,
      format: 'DD-MM-YYYY',
      calender_style: "picker_4"
    }, function(start, end, label) {
      console.log(start.toISOString(), end.toISOString(), label);
    });

    $('#fecha_nacimiento').daterangepicker({
      singleDatePicker: true,
      format: 'DD-MM-YYYY',
      calender_style: "picker_4"
    }, function(start, end, label) {
      console.log(start.toISOString(), end.toISOString(), label);
    });

    $.validator.addMethod("forni", function(value, element) {
      var exp = value;
      var num = parseInt($('input:radio[name=id_documentoidentidad]:checked').val());// console.log(num);
      if(num==1)
      {
        if (exp <= 0) { return false; }
        else {
            if($.isNumeric(exp) && exp.trim().length==8){ return true; }
            else{ return false; }
        }
      }
      else
      {
        if(exp.trim().length==12) {return true}
        else { return false;}
      }
        
  }, "Corregir");

    $('#form_save_pers_natural').validate({
        rules:
        {
          dni:
          {
            required:true,
            forni: true,
            remote: {
              url: $('base').attr('href') + 'clientes/validar_dni',
              type: "post",
              data: {
                dni: function() { return $( "#dni" ).val(); },
                id_cliente: function() { return $('#id_cliente').val(); },
                id_documentoidentidad: function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); }             
              }
            }
          },
          nombres:{required:true},
          apellidos:{required:true},
          sexo:{required:true },
          fecha_nacimiento:{formespn:true},
          id_departamento:{ required:true },
          id_provincia:{ required:true },
          id_distrito:{ required:true }        
        },
        messages: 
        {
          dni:
          {
            required:"DNI",
            number: "Solo #s",
            remote: "Ya existe"
          },
          nombres:{required:""},
          apellidos:{required: ""},
          sexo:{required: ""},
          aniversario:{date: "Ingrese una fecha valida"},
          id_departamento:{ required:"" },
          id_provincia:{ required:"" },
          id_distrito:{ required:"" }
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
          else if(element.parent('.col-md-8').length) { error.insertAfter(element.parent()); }
          else {}
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'clientes/save_cliente',
                type: 'POST',
                data: $('#form_save_pers_natural').serialize(),
                dataType: "json",
                beforeSend: function() {
                  $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    if (response.code==1) {
                       window.location.href = $('base').attr('href') +'clientes/edit_nat/'+response.data.id;
                    }
                    else
                    {
                      if($('#dni').parents('.col-md-4').attr('class')=="col-md-4")
                      {
                        $('#dni').parents('.col-md-4').addClass('has-error');
                      }
                      
                      if($('#dni-error').length>0)
                      {
                        $('#dni-error').html(response.message);
                      }
                      else
                      {
                        $('#dni').parents('.col-md-4').append("<span id='dni-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                  $.LoadingOverlay("hide");
                }
            });/**/
        }
    });

    
});

function direccionar()
{
  var link = $('#id_cliente').val();
  if($('#tipo_persona').val()==1)
  {
    link = "edit_juri/"+link;
    if($('#subtab').length)
    {
      link = link+"/"+$('#subtab').val();
    }
  }
  else
  {
    link = "edit_nat/"+link;
  }
  window.location.href = $('base').attr('href') +'clientes/'+link; 
}

function crearids(idsuc = 0)
{
  var div = parseInt(idsuc);
  div = div >0 ? div : 0;
  var ids =  new Array();
    
  if(div>0)
  {
    var i = 0;
    var idp = 0;
    $('#contacto_cont_'+div+' table tbody tr.orden').each(function (index, value){
      idp = parseInt($(this).attr('idperona'));
      idp = idp > 0 ? idp : 0;
      if(idp >0 )
      {
        ids[i] = idp;
        i++;
      }        
    })
  }
  return ids.join(',');
}

$(function () {
    $('#hora_fin').datetimepicker({format: 'LT'});
    $('#hora_inicio').datetimepicker({format: 'LT'});

  $( "#dni" ).autocomplete({
    params: { 
      'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); }
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"persona/get_dni",
    onSelect: function (suggestion) 
    {
      $('#id_persona_natural').val(suggestion.id_persona);
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#fecha_nacimiento').val(suggestion.fecha_nacimiento);
      $('#telefono').val(suggestion.telefono);
      $('#celular').val(suggestion.celular);
      $('#pagina_web').val(suggestion.pagina_web);
      $('#email').val(suggestion.email);
      $('#dni').val(suggestion.dni);

      $('#gender label').removeClass('active');
      $('#gender input').prop('checked', false);

      var num = suggestion.sexo;
      $('#gender #sexo_'+num).prop('checked', true);
      $('#gender #sexo_'+num).parent('label').addClass('active');
    }
  });

  $( "#apel_cont" ).autocomplete({
    params: { 
      'ids': function() { return crearids($(document).data('datsucu')); },
      'va': function() { return 'apellidos'; }
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"personajuridica/get_infopn",
    onSelect: function (suggestion) 
    {
      $('#id_personanatur').val(suggestion.id_persona);
      $('#apel_cont').val(suggestion.apellidos);
      $('#nom_cont').val(suggestion.nombres);
      $('#ema_cont').val(suggestion.email);
      var obj = isSession(suggest.id_persona);
    }
  });

  $( "#ruc" ).autocomplete({
  //appendTo: autondni,
  type:'POST',
  serviceUrl: $('base').attr('href')+"personajuridica/get_ruc",
  onSelect: function (suggestion) 
  {
    $('#id_prsnatjur').val(suggestion.id_persona_juridica);
    $('#nombre_comercial').val(suggestion.nombre_comercial);
    $('#razon_social').val(suggestion.razon_social);
    $('#direccion_fiscal').val(suggestion.direccion_fiscal);
    $('#id_departamento').val(suggestion.id_departamento);
    $('#id_provincia').val(suggestion.id_provincia);
    $('#id_distrito').val(suggestion.id_distrito);
    $('#aniversario').val(suggestion.aniversario);
    $('#pagina_web').val(suggestion.pagina_web);
    $('#ruc').val(suggestion.ruc);
  }
});

});

$(document).on('change', '#form_save_pers_natural input:radio[name=id_documentoidentidad]', function (e)
{
  var id = parseInt($(this).val());
  $('#dni').val('');
  $('#dni').prop( "disabled", false );
  $('#divdocu input').prop('checked', false);
  $('input#nodocu').prop('checked', true);
  if(id>0)
  {
    var autoge = $('#autoge').val();
    var nombr = autoge+$('input.doc_'+id).val();
    var padre = $('#dni').closest('.form-group');
    padre.find('label.control-label span').html(nombr+' *');
    $('#dni').attr({'placeholder':nombr});
  }    
});

$(document).on('change', '#form_save_pers_natural input:radio[name=genera]', function (e)
{
  var id = parseInt($(this).val());
  var va = false;
  if(id>0)
  {
    va = true;
    $.ajax({
      url: $('base').attr('href') + 'persona/dni_genera',
      type: 'POST',
      data: 'id_documentoidentidad='+$('input:radio[name=id_documentoidentidad]:checked').val(),
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#dni').val(response.data);
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
  else
  {
    $('#dni').val('');
  }
  $('#dni').prop( "disabled", va );
});

$(document).on('change', 'input:radio[name=es_juridica]', function (e)
{
  var id = parseInt($(this).val());
  $('#ruc').val('');
  $('#divdocuruc input').prop('checked', false);
  $('input#nodocuruc').prop('checked', true);

  
  if(id>0)
  {
    $('#divdocuruc input:radio[name=genera_ruc]').prop( "disabled", false );
    $('#ruc').prop("disabled",false);
  }
  else
  {
    $('#divdocuruc input:radio[name=genera_ruc]').prop( "disabled", true );
    
  }
});

$(document).on('change', 'input:radio[name=genera_ruc]', function (e)
{
  var id = parseInt($(this).val())
  //var va = false;
  var check = parseInt($('input:radio[name=es_juridica]:checked').val());

  if(check>0)
  {
    $('#ruc').prop("disabled",true);
    $.ajax({
      url: $('base').attr('href') + 'persona/ruc_genera',
      type: 'POST',
      data: 'es_juridica='+check,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#ruc').val(response.data);

        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
  else
  {
    $('#ruc').prop("disabled",false);
  }
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
          $('#id_personanatur').val(response.data.id_persona);
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
            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
              if (response.code==1) {
                //direccionar();
              }
          },
          complete: function() {
            $.LoadingOverlay("hide");
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
          $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {
              direccionar();
            }
        },
        complete: function() {
          $.LoadingOverlay("hide");
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
          $('#referencia_').val(response.data.referencia);
          $('#id_departamento_').val(response.data.id_departamento);
          $('#id_provincia_').html(response.data.provincia);
          $('#id_distrito_').html(response.data.distrito);
          //$('#id_distrito_').val(response.data.id_distrito);
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

$(document).on('change', '#id_departamento', function (e)
{
  var id_departamento = $(this).val();

  $.ajax({
      url: $('base').attr('href') + 'ubigeo/combox_prov',
      type: 'POST',
      data: 'id_departamento='+id_departamento,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#id_provincia').html(response.data);
          $('#id_distrito').html("<option value=''>DISTRITO</option>");
        }
      },
      complete: function() {
          //hideLoader();
      }
  });
});


$(document).on('change', '#id_provincia', function (e)
{
  var id_provincia = $(this).val();

  $.ajax({
      url: $('base').attr('href') + 'ubigeo/combox_dist',
      type: 'POST',
      data: 'id_provincia='+id_provincia,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#id_distrito').html(response.data);
        }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.deltete_client', function (e)
{
  var idcliente = $(this).parents('tr').attr('idcliente');
  e.preventDefault();
  var nomb = "Cliente";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este "+nomb+'!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'clientes/deltete_client',
        type: 'POST',
        data: 'id_cliente='+idcliente+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {
              var text = "Elimino!";
              alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
              window.location.href = $('base').attr('href') +'clientes';
            }
        },
        complete: function() {
          $.LoadingOverlay("hide");        
        }
      });
    }
  });   
});

$(document).on('click', '#gender', function (e) {
  var cla_se = $(this).parents('.control-group').attr('class');
  if(cla_se == "control-group has-error")
  {
    $(this).parents('.control-group').removeClass('has-error');
  }
});

$(document).on('click', '.delet_cel', function (e) {
  e.preventDefault();
  var nomb = "Celular";
  var padre = $(this);
  eliminar(padre, nomb);
});

$(document).on('click', '.delet_tel', function (e) {
  e.preventDefault();
  var nomb = "Teléfono";
  var padre = $(this);
  eliminar(padre, nomb);
});

function eliminar(padre, nomb)
{
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este # de "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if(isConfirm)
    {
      padre.parents('.form-group').remove();
    }    
  });
}

$(document).on('click', '#cont_cel', function (e) {
  add_op('celu','cel');             
});

$(document).on('click', '#cont_tel', function (e) {
  add_op('tel','tel');                    
});

function add_operador(temp, div)
{
  if((temp.trim().length)>0 && (div.trim().length)>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'clientes/add_operador',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {
              $( "#"+div ).append(response.data);
            }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
    });
  }
}

function html_operador(temp, div)
{
  if((temp.trim().length)>0 && (div.trim().length)>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'clientes/add_operador',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              $( "#"+div ).html(response.data);
            }
        },
        complete: function() {
            //hideLoader();
        }
    });
  }
}

$(document).on('click', '#cont_celu', function (e) {
  add_op('celuu','cel');          
});

$(document).on('click', '#cont_tele', function (e) {
  add_op('tele','tel');                 
});

function add_op(div,tip)
{
  var ord = ($("#div_"+div+" .form-group").length>0) ? ($("#div_"+div+" .form-group:last").attr('orden')) : (0);
  ord = parseInt(ord)+1;
  var i = 0;
  var tipo = 'add_operador'+tip;
  var txt = (tip=='cel') ? ('Celular') : ('Teléfono');
  $( "#div_"+div+" .form-group select" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });

  $( "#div_"+div+" .form-group input" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });
  if(i == 0)
  {
    add_operador('tipo='+tipo+'&orden='+ord, 'div_'+div);
  }
  else
  {
    alerta('Completar!','Tiene que Completar el # de '+txt,'error');
  }
}
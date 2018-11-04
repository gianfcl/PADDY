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
            else {}             
        },
        submitHandler: function() {

          var orden = $('#cont_contactos table tbody tr:last').attr('orden');

          var id_proveedor = $('#id_proveedor').val();

          if(id_proveedor!=0)
          {
            $.ajax({
                url: $('base').attr('href') + 'proveedor/save_contacto',
                type: 'POST',
                data: $('#form-add-contactos').serialize()+'&orden='+orden+'&id_proveedor='+id_proveedor,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      if(id_contacto == '0')
                      {
                        $('#cont_contactos table tbody').append(response.data);
                        $('#modalcontacto').modal('hide');
                        limpiarcontacto();
                      }
                      else
                      {
                        var link = ($('#tipo_persona').val()==1) ? ('edit_juri') : ('edit_nat');
                        window.location.href = $('base').attr('href') +'proveedor/'+link+'/'+id_proveedor;
                      }                        
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

    $('#form-add-sucursal').validate({
        rules:
        {
          nombre_sede:
          {
            required:true,
            minlength: 3
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
            minlength: ""
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
          var id_proveedor = $('#id_proveedor').val();

          $.ajax({
              url: $('base').attr('href') + 'proveedor/save_sucurssal',
              type: 'POST',
              data: $('#form-add-sucursal').serialize()+'&orden='+orden+'&id_proveedor='+id_proveedor,
              dataType: "json",
              beforeSend: function() {
                  //showLoader();
              },
              success: function(response) {
                if (response.code==1) 
                {
                  if(id_proveedor=='0')
                  {
                    $('#cont_sucursales').append(response.data);
                    $('#modalsucursal').modal('hide');
                  }
                  else
                  {
                    var link = ($('#tipo_persona').val()==1) ? ('edit_juri') : ('edit_nat');
      
                    var id_proveedor = $('#id_proveedor').val();
                    window.location.href = $('base').attr('href') +'proveedor/'+link+'/'+id_proveedor;
                  }
                }
              },
              complete: function() {
                  //hideLoader();
              }
          });
        }
    });

    $('#fecha_nacimiento').daterangepicker({
      singleDatePicker: true,
      format: 'YYYY-MM-DD',
      calender_style: "picker_4"
    }, function(start, end, label) {
      console.log(start.toISOString(), end.toISOString(), label);
    });

    $('#form_save_pers_natural').validate({
        rules:
        {
          id_proveedor:
          {
            required:true
          }  
        },
        messages: 
        {
          id_proveedor:
          {
            required:""
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
          if(element.parent('.col-md-9').length) 
          {
            error.insertAfter(element.parent()); 
          }
        },
        submitHandler: function() {
          $.ajax({
            url: $('base').attr('href') + 'personanatural/save_proveedor',
            type: 'POST',
            data: $('#form_save_pers_natural').serialize(),
            dataType: "json",
            beforeSend: function() {
              //showLoader();
            },
            success: function(response) {
              if (response.code==1) {
                direccionar();
              }
            },
            complete: function() {
              //hideLoader();
            }
          });/**/
        }
    });

    
});

$(function () {
    $('#hora_fin').datetimepicker({format: 'LT'});
    $('#hora_inicio').datetimepicker({format: 'LT'});

    $( "#dni" ).autocomplete({
    //appendTo: autondni,
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
      $('#direccion').val(suggestion.direccion);

      $('#gender label').removeClass('active');
      $('#gender input').prop('checked', false);

      var num = suggestion.sexo;
      $('#gender #sexo_'+num).prop('checked', true);
      $('#gender #sexo_'+num).parent('label').addClass('active');
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

$(document).on('change', 'input:radio[name=id_documentoidentidad]', function (e)
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

$(document).on('change', 'input:radio[name=genera]', function (e)
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

/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/
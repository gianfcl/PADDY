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
          dni:
          {
            required:true,
            number: true,
            remote: {
              url: $('base').attr('href') + 'proveedor/validar_dni',
              type: "post",
              data: {
                dni: function() { return $( "#dni" ).val(); },
                id_proveedor: function() { return $('#id_proveedor').val(); }
              }
            }
          },
          nombres:
          {
            required:true
          },
          apellidos:
          {
            required:true
          },
          sexo:
          {
            required:true
          }       
        },
        messages: 
        {
          dni:
          {
            required:"",
            number: "Solo #s",
            remote: "Ya existe"
          },
          nombres:
          {
            required:""
          },
          apellidos: 
          {
            required: ""
          },
          sexo:
          {
            required: ""
          },
          aniversario:
          {
            date: "Ingrese una fecha valida"
          }
        },      

        highlight: function(element) {
            $(element).closest('.control-group').addClass('has-error');
            $(element).closest('.btn-group').addClass('has-error'); 
            //console.log(element);     
        },
        unhighlight: function(element) {
            $(element).closest('.control-group').removeClass('has-error');
            $(element).closest('.btn-group').removeClass('has-error');
            console.log($(element).attr('type'));

            
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) 
        {
            if(element.parent('.control-group').length) 
            {
              error.insertAfter(element.parent());
              //element.closest('.control-group').find('.help-block').html(error.text()); 
            } //console.log(element); console.log(error);
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'proveedor/save_proveedor',
                type: 'POST',
                data: $('#form_save_pers_natural').serialize(),
                dataType: "json",
                beforeSend: function() {
                  $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    if (response.code==1) {
                      swal({
                        title : 'Guardo!',
                        text: 'Proveedor Registrado correctamente!!',
                        type: 'success',
                        confirmButtonText: 'Listo!',
                      }).then(function () {
                        var tipo = $('#myTab li.active').attr('tabs');
                        window.location.href = $('base').attr('href') +'proveedor/edit_nat/'+response.data.id;
                      });
                    }
                    else
                    {
                      alerta('No se pudieron guardar ','los datos ','error');
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

$(document).on('click', '.delete_cont', function (e)
{
  e.preventDefault();

  if (confirm("Seguro que deseas eliminar esta contacto?")) 
  {
    $(this).parents('.row').remove();
  }  
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
    var idcontacto = $(this).parents('tr').attr('idcontacto'); console.log(idcontacto);
    $.ajax({
      url: $('base').attr('href') + 'proveedor/get_one_contacto',
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

  if (confirm("Seguro que deseas eliminar este contacto?")) 
  {
    var idcontacto = $(this).parents('tr').attr('idcontacto');

    $.ajax({
        url: $('base').attr('href') + 'proveedor/delete_contact',
        type: 'POST',
        data: 'id_contacto='+idcontacto+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              var id_proveedor = $('#id_proveedor').val();

              var link = ($('#tipo_persona').val()==1) ? ('edit_juri') : ('edit_nat');
      
              window.location.href = $('base').attr('href') +'proveedor/'+link+'/'+id_proveedor;
            }
        },
        complete: function() {
            //hideLoader();
        }
    });
  }   
    
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
  if (confirm("Seguro que deseas eliminar este Celuar?")) 
  {
    $(this).parents('.form-group').remove();
  }
});

$(document).on('click', '.delet_tel', function (e) {
  e.preventDefault();
  if (confirm("Seguro que deseas eliminar este Telefono?")) 
  {
    $(this).parents('.form-group').remove();
  }
});

$(document).on('click', '#cont_cel', function (e) {
  var ord = ($('#div_celu .form-group').length>0) ? ($('#div_celu .form-group:last').attr('orden')) : (0);
  ord = parseInt(ord)+1;
  var i = 0;
  $( "#div_celu .form-group select" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });

  $( "#div_celu .form-group input" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });
  if(i == 0)
  {
    add_operador('tipo=add_operadorcel&orden='+ord, 'div_celu');
  }
  else
  {
    alert('Completar!');
  }                   
});

$(document).on('click', '#cont_tel', function (e) {
  var ord = ($('#div_tel .form-group').length>0) ? ($('#div_tel .form-group:last').attr('orden')) : (0);
  ord = parseInt(ord)+1;
  var i = 0;
  $( "#div_tel .form-group select" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });

  $( "#div_tel .form-group .col-md-4 input" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });

  if(i == 0)
  {
    add_operador('tipo=add_operadortel&orden='+ord, 'div_tel');
  }
  else
  {
    alert('Completar!');
  }                   
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
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              $( "#"+div ).append(response.data);
            }
        },
        complete: function() {
            //hideLoader();
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
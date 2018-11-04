$( document ).ready(function() {
  $.validator.addMethod("time24", function(value, element) {
    var exp = value;
    if($.trim(exp).length>0) {
      return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [APap][mM]$/.test(value);
    }
    else {
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
        if(exp.trim().length<20) {return true}
        else { return false;}
      }
        
  }, "Corregir");

  $('#form_save_personal').validate({
    rules:
    {
      dni:
      {
        required:true,
        forni: true,
        remote: {
          url: $('base').attr('href') + 'personal/validar_dni',
          type: "post",
          data: {
            dni: function() { return $( "#dni" ).val(); },
            id_personal: function() { return $('#id_personal').val(); },
            id_documentoidentidad: function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); }             
          }
        }
      },
      nombres:{ required:true },
      apellidos:{ required:true },
      nombre_corto:{
        required:true,
        minlength: 4,
        remote: {
          url: $('base').attr('href') + 'persona/validar_nombcorto',
          type: "post",
          data: {
            nombre_corto: function() { return $( "#nombre_corto" ).val(); },
            id_persona: function() { return $('#id_persona').val(); }
          }
        }
      },
      sexo:{ required:true },
      fecha_nacimiento:{formespn:true}      
    },
    messages:{
      dni: { required:"Ingrese DNI", remote: "Ya existe"},
      nombres:{ required:"" },
      apellidos:{ required: "" },
      nombre_corto: { required:"", minlength: "Más de 4 Letras", remote: "Ya existe"},
      sexo:{ required: "" }
    },      

    highlight: function(element) {
        $(element).closest('.control-group').addClass('has-error');        
    },
    unhighlight: function(element) {
        $(element).closest('.control-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
        if(element.parent('.control-group').length) 
        {
          error.insertAfter(element.parent());
        }
    },
    submitHandler: function() {
        $.ajax({
            url: $('base').attr('href') + 'personal/save_personal',
            type: 'POST',
            data: $('#form_save_personal').serialize(),
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
              if (response.code==1) {
                var tipo = $('#myTab li.active').attr('tabs');
                window.location.href = $('base').attr('href') +'personal/edit/'+response.data.id+'/'+tipo;
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
            complete: function(response) {
              
            }
        });/**/
    }
  });

  $('#fecha_nacimiento').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#hora_salida').datetimepicker({format: 'LT'});
  $('#hora_ingreso').datetimepicker({format: 'LT'});

  $("#dni").autocomplete({
    params: { 
      'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); }
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"persona/get_dni",
    onSelect: function (suggestion) 
    {
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#fecha_nacimiento').val(suggestion.fecha_nacimiento);
      $('#telefono').val(suggestion.telefono);
      $('#celular').val(suggestion.celular);
      $('#pagina_web').val(suggestion.pagina_web);
      $('#email').val(suggestion.email);
      $('#dni').val(suggestion.dni);
      $('#id_persona').val(suggestion.id_persona);
      $('#direccion').val(suggestion.direccion);
      $('#gender label').removeClass('active');
      $('#gender input').prop('checked', false);

      var num = suggestion.sexo;
      $('#gender #sexo_'+num).prop('checked', true);
      $('#gender #sexo_'+num).parent('label').addClass('active');
    }
  });

  $("#apellidos").autocomplete({
    params: { 
      'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); }
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"persona/get_apellidos",
    onSelect: function (suggestion) 
    {
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#fecha_nacimiento').val(suggestion.fecha_nacimiento);
      $('#telefono').val(suggestion.telefono);
      $('#celular').val(suggestion.celular);
      $('#pagina_web').val(suggestion.pagina_web);
      $('#email').val(suggestion.email);
      $('#dni').val(suggestion.dni);
      $('#id_persona').val(suggestion.id_persona);
      $('#direccion').val(suggestion.direccion);
      $('#gender label').removeClass('active');
      $('#gender input').prop('checked', false);

      var num = suggestion.sexo;
      $('#gender #sexo_'+num).prop('checked', true);
      $('#gender #sexo_'+num).parent('label').addClass('active');
    }
  });

  $("#nombres").autocomplete({
    params: { 
      'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); }
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"persona/get_nombres",
    onSelect: function (suggestion) 
    {
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#fecha_nacimiento').val(suggestion.fecha_nacimiento);
      $('#telefono').val(suggestion.telefono);
      $('#celular').val(suggestion.celular);
      $('#pagina_web').val(suggestion.pagina_web);
      $('#email').val(suggestion.email);
      $('#dni').val(suggestion.dni);
      $('#id_persona').val(suggestion.id_persona);
      $('#direccion').val(suggestion.direccion);
      $('#gender label').removeClass('active');
      $('#gender input').prop('checked', false);

      var num = suggestion.sexo;
      $('#gender #sexo_'+num).prop('checked', true);
      $('#gender #sexo_'+num).parent('label').addClass('active');
    }
  });
  
});

$(document).on('change', 'input:radio[name=id_documentoidentidad]', function (e)
{
  var id = parseInt($(this).val());
  if(id>0)
  {
    var nombr = $('input.doc_'+id).val();
    var padre = $('#dni').closest('.control-group');
    padre.find('label').html(nombr+' *');
    $('#dni').attr({'placeholder':nombr});
  }    
});

$(document).on('change', '.id_departamento', function (e)
{
  var padre = $(this);
  var id_departamento = padre.val();
  var tipo = padre.attr('tipo');
  
  $.ajax({
      url: $('base').attr('href') + 'ubigeo/combox_prov',
      type: 'POST',
      data: 'id_departamento='+id_departamento,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('select[name=id_provincia'+tipo+']').html(response.data);
          $('select[name=id_distrito'+tipo+']').html("<option value=''>DISTRITO</option>");        
        }
      },
      complete: function() {
        //hideLoader();
      }
  });
});


$(document).on('change', '.id_provincia', function (e)
{
  var padre = $(this);
  var id_provincia = padre.val();

  var tipo = padre.attr('tipo');
  
  $.ajax({
      url: $('base').attr('href') + 'ubigeo/combox_dist',
      type: 'POST',
      data: 'id_provincia='+id_provincia,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('select[name=id_distrito'+tipo+']').html(response.data);         
        }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/
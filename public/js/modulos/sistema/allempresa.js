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
        if(exp.trim().length==12) {return true}
        else { return false;}
      }
        
  }, "Corregir");

  $('#form_save_pers_juridica').validate({
    rules:
    {
      ruc:
      {
        required:true,
        number: true,
        rangelength:[11,11],
        remote: {
          url: $('base').attr('href') + 'allempresa/validar_ruc',
          type: "post",
          data: {
            ruc: function() { return $( "#ruc" ).val(); },
            id_empresa: function() { return $('#form_save_pers_juridica .id_empresa').val(); }
          }
        }
      },
      razon_social:{ required:true },
      direccion_fiscal:{ required:true },
      id_departamento:{ required:true },
      id_provincia:{ required:true },
      id_distrito:{ required:true },
      email:{email: true }
    },
    messages: 
    {
      ruc:
      {
        required:"Ingrese RUC",
        number: "Solo #s",
        rangelength:"RUC Incorrecto"
      },
      razon_social:{ required: "Razón Social" },
      direccion_fiscal:{ required: "Dirrección F" },
      id_departamento:{ required:"Seleccione" },
      id_provincia:{ required:"Seleccione" },
      id_distrito:{ required:"Seleccione" }
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
        else if(element.parent('.col-md-6').length) { error.insertAfter(element.parent());}
        else {}
      }
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'allempresa/save_empresa',
        type: 'POST',
        data: $('#form_save_pers_juridica').serialize(),
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          if (response.code==1) {
            $('#editempresa').modal('hide');
            limp_pj('form_save_pers_juridica');
            buscarempresa(0);
          }
        },
        complete: function() {
          alerta('Ok!','Guardo Con exito','success');
        }
      });/**/
    }
  });

  $('#form_save_pers_natural').validate({
      rules:
      {
        dni:
        {
          required:true,
          forni: true,
          remote: {
            url: $('base').attr('href') + 'allempresa/validar_dni',
            type: "post",
            data: {
              dni: function() { return $( "#dni" ).val(); },
              id_empresa: function() { return $('#form_save_pers_natural input.id_empresa').val(); },
              id_documentoidentidad: function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); }             
            }
          }
        },
        nombres:{required:true},
        apellidos:{required:true},
        sexo:{required:true },
        fecha_nacimiento:{formespn:true},
        direccion:{ required:true },
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
        direccion:{ required:"" },
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
          url: $('base').attr('href') + 'allempresa/save_empresa',
          type: 'POST',
          data: $('#form_save_pers_natural').serialize(),
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
            if (response.code==1) {
              $('#editempresa').modal('hide');
              limp_pn('form_save_pers_natural')
              buscarempresa(0);
            }
          },
          complete: function() {
            alerta('Ok!','Guardo Con exito','success');
          }
      });/**/
    }
  });

});

$(function () {

  $( "#ruc" ).autocomplete({
    //appendTo: autondni,
    type:'POST',
    serviceUrl: $('base').attr('href')+"personajuridica/get_ruc",
    onSelect: function (suggestion) 
    {
      $('#id_persona_juridica').val(suggestion.id_persona_juridica);
      $('#nombre_comercial').val(suggestion.nombre_comercial);
      $('#razon_social').val(suggestion.razon_social);
      $('#direccion_fiscal').val(suggestion.direccion_fiscal);
      $('#id_departamento').val(suggestion.id_departamento);
      $('#id_provincia').val(suggestion.id_provincia);
      $('#id_distrito').val(suggestion.id_distrito);
      $('#pagina_web').val(suggestion.pagina_web);
      $('#ruc').val(suggestion.ruc);
    }
  });

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

      $('#email').val(suggestion.email);
      $('#dni').val(suggestion.dni);

      $('#gender label').removeClass('active');
      $('#gender input').prop('checked', false);

      var num = suggestion.sexo;
      $('#gender #sexo_'+num).prop('checked', true);
      $('#gender #sexo_'+num).parent('label').addClass('active');
    }
  });
});

function limp_pj(form)
{
  limp_todo(form);
  $('#'+form+' select.provincia').html('');
  $('#'+form+' select.distrito').html('');

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);

  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');
  $('#'+form+' input.tipo_persona').val(1);
}

function limp_pn(form)
{
  limp_todo(form);
  $('#'+form+' select.provincia').html('');
  $('#'+form+' select.distrito').html('');

  $('#estadosn label').removeClass('active');
  $('#estadosn input').prop('checked', false);

  $('#estadon #estadosn_1').prop('checked', true);
  $('#estadon #estadosn_1').parent('label').addClass('active');

  $('#gender label').removeClass('active');
  $('#gender input').prop('checked', false);

  $('#gender #sexo_m').prop('checked', true);
  $('#gender #sexo_m').parent('label').addClass('active');
  $('#'+form+' input.tipo_persona').val(2);
}

$(document).on('change', '.departamento', function (e)
{
  var id = parseInt($(this).val());
  var padre = $(this).closest('form.form-horizontal');
  padre.find('.provincia').html("<option value=''>PROVINCIA</option>");
  padre.find('.distrito').html("<option value=''>DISTRITO</option>");

  if(id>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'ubigeo/combox_prov',
      type: 'POST',
      data: 'id_departamento='+id,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          padre.find('.provincia').html(response.data);          
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '.provincia', function (e)
{
  var id = parseInt($(this).val());
  var padre = $(this).parents('form');
  if(id>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'ubigeo/combox_dist',
      type: 'POST',
      data: 'id_provincia='+id,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          padre.find('.distrito').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscarempresa(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscarempresa(page);
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '#datatable-buttons .buscarempresa', function (e) {
  var page = 0;  
  buscarempresa(page);
});

function buscarempresa(page)
{
  var codigo = $('#codigo').val();
  var nombres_com = $('#nombres_com').val(); 
  var razon_soc = $('#razon_soc').val();
  var ruc_dni = $('#ruc_dni').val();
  var fecha_nac_aniv = $('#fecha_nac_aniv').val();
  var temp = "page="+page;
  
  if(codigo.trim().length)
  {
    temp=temp+'&codigo='+codigo;
  }

  if(nombres_com.trim().length)
  {
    temp=temp+'&nombres_com='+nombres_com;
  }

  if(razon_soc.trim().length)
  {
    temp=temp+'&razon_soc='+razon_soc;
  }

  if(ruc_dni.trim().length)
  {
    temp=temp+'&ruc_dni='+ruc_dni;
  }

  if(fecha_nac_aniv.trim().length)
  {
    temp=temp+'&fecha_nac_aniv='+fecha_nac_aniv;
  }
  
  $.ajax({
      url: $('base').attr('href') + 'allempresa/buscar_empresas',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
          $('#paginacion_data').html(response.data.paginacion);
        }
      },
      complete: function() {
          //hideLoader();
      }
  });
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

$(document).on('click', '.addempresa', function (e)
{
  $("a#pj-tabs").click();
  limp_pj('form_save_pers_juridica');
  limp_pn('form_save_pers_natural');
});

$(document).on('click', '.edit_empresa', function (e)
{
  var idempresa = $(this).parents('tr').attr('idempresa');
  var tipo_persona = "";
  var form = "";
  var tb = "";
  $.ajax({
    url: $('base').attr('href') + 'allempresa/get_one_empresa',
    type: 'POST',
    data: 'id_empresa='+idempresa,
    dataType: "json",
    success: function(response) {
      if (response.code == "1") {
        tipo_persona = response.data.tipo_persona;

        switch(tipo_persona) {
          case '1':
            form = "juridica";
            $('#ruc').val(response.data.ruc);
            $('#razon_social').val(response.data.razon_social);
            $('#direccion_fiscal').val(response.data.direccion_fiscal);
            $('#nombre_comercial').val(response.data.nombre_comercial);
            $('#id_persona_juridica').val(response.data.id_persona_juridica);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            tb = "pj";
              break;

          case '2':
            form = "natural";
            $('#dni').val(response.data.dni);
            $('#nombres').val(response.data.nombres);
            $('#apellidos').val(response.data.apellidos);
            $('#direccion').val(response.data.direccion);
            $('#fecha_nacimiento').val(response.data.fecha_nacimiento);
            $('#email').val(response.data.email);
            $('#id_persona_natural').val(response.data.id_persona);

            $('#estadosn label').removeClass('active');
            $('#estadosn input').prop('checked', false);

            var num = response.data.estado;
            $('#estadosn #estadosn_'+num).prop('checked', true);
            $('#estadosn #estadosn_'+num).parent('label').addClass('active');

            $('#gender label').removeClass('active');
            $('#gender input').prop('checked', false);

            num = response.data.sexo;
            $('#gender #sexo_'+num).prop('checked', true);
            $('#gender #sexo_'+num).parent('label').addClass('active');

            tb = "pn";
              break;

          default:
            break;
        }

        $("a#"+tb+"-tabs").click();
        $('#form_save_pers_'+form+' input.id_empresa').val(response.data.id_empresa);
        $('#form_save_pers_'+form+' select.departamento').val(response.data.id_departamento);
        $('#form_save_pers_'+form+' select.provincia').html(response.data.provincia);
        $('#form_save_pers_'+form+' select.distrito').html(response.data.distrito);
      }
    },
    complete: function() {
        //hideLoader();
    }
  });    
});

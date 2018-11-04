$( document ).ready(function() {
  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return true;
  }, "Ingrese est Formato dd-mm-yyyy");
  
  $('#form_save_familiares').validate({
    rules: 
    {
      dni: { required:true},
      nombres: {required:true},
      apellidos: {required:true},
      sexo: {required:true},
      fecha_nacimiento:{formespn:true} 
    },
    messages: 
    {
      dni: { required:"Ingresar" },
      nombres: { required:"Nombres" },
      apellidos: { required:"Apellidos" },
      sexo: { required:"Sexo" }
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
      if(element.parent('.col-md-6').length) { error.insertAfter(element.parent()); }
      else {}
    },
    submitHandler: function() {
      var form = "form_save_familiares";
      edit_familiar(form);        
    }
  });

  $('#form_save_personapadres').validate({
    rules: 
    {
      nombres: {required:true},
      apellidos: {required:true},
      sexo: {required:true},
      id_parentesco: {required:true}
    },
    messages: 
    {
      nombres: { required:"Nombres" },
      apellidos: { required:"Apellidos" },
      sexo: { required:"Sexo" },
      id_parentesco: { required:"Parentesco" }
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
      if(element.parent('.col-md-6').length) { error.insertAfter(element.parent()); }
      else {}
    },
    submitHandler: function() {
      var form = "form_save_personapadres";

      edit_familiar(form);      
    }
  });

  $('#fecha_nac').datetimepicker({
    viewMode: 'years',
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#fecha_nac2').datetimepicker({
    viewMode: 'years',
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });
});

$(function () {
  $( "#dni" ).autocomplete({
    params: { 
      'tipo_familiar': function() { return $('#editfamiliares .tipo_familiar').val(); },
      'id_personapadre': function() { return $('#id_personapadre').val(); },
      'va': function() { return 'dni';}
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"personal/get_infopersonl",
    onSelect: function (suggestion) 
    {
      var padre = $('#editfamiliares');
      padre.find('.id_persona').val(suggestion.id_persona);
      padre.find('.apellidos').val(suggestion.apellidos);
      padre.find('.nombres').val(suggestion.nombres);
      padre.find('.dni').val(suggestion.dni);
      padre.find('.sexo').val(suggestion.sexo);
      padre.find('.fecha_nacimiento').val(suggestion.fecha_nacimiento);
      padre.find('.id_ocupacion').val(suggestion.id_ocupacion);
    }
  });

  $( "#dni2" ).autocomplete({
    params: { 
      'tipo_familiar': function() { return $('#editpersonapadres .tipo_familiar').val(); },
      'id_personapadre': function() { return $('#id_personapadre').val(); },
      'va': function() { return 'dni';}
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"personal/get_infopersonl",
    onSelect: function (suggestion) 
    {
      var padre = $('#editpersonapadres');
      padre.find('.id_persona').val(suggestion.id_persona);
      padre.find('.apellidos').val(suggestion.apellidos);
      padre.find('.nombres').val(suggestion.nombres);
      padre.find('.dni').val(suggestion.dni);
      padre.find('.sexo').val(suggestion.sexo);
      padre.find('.fecha_nacimiento').val(suggestion.fecha_nacimiento);
      padre.find('.id_ocupacion').val(suggestion.id_ocupacion);
    }
  });

  $( "#nombres" ).autocomplete({
      params: { 
        'tipo_familiar': function() { return $('#editfamiliares .tipo_familiar').val(); },
        'id_personapadre': function() { return $('#id_personapadre').val(); },
        'va': function() { return 'nombres';}
    },
      //appendTo: autondni,
      type:'POST',
      serviceUrl: $('base').attr('href')+"personal/get_infopersonl",
      onSelect: function (suggestion) 
      {
        $('#id_persona').val(suggestion.id_persona);
        $('#apellidos').val(suggestion.apellidos);
        $('#nombres').val(suggestion.nombres);
        $('#dni').val(suggestion.dni);
        $('#sexo').val(suggestion.sexo);
        $('#fecha_nacimiento').val(suggestion.fecha_nacimiento);
        $('#id_ocupacion').val(suggestion.id_ocupacion);
      }
  });

  $( "#apellidos" ).autocomplete({
      params: { 
        'tipo_familiar': function() { return $('#editfamiliares .tipo_familiar').val(); },
        'id_personapadre': function() { return $('#id_personapadre').val(); },
        'va': function() { return 'apellidos';}
    },
      //appendTo: autondni,
      type:'POST',
      serviceUrl: $('base').attr('href')+"personal/get_infopersonl",
      onSelect: function (suggestion) 
      {
        var padre = $('#editfamiliares');
        padre.find('.id_persona').val(suggestion.id_persona);
        padre.find('.apellidos').val(suggestion.apellidos);
        padre.find('.nombres').val(suggestion.nombres);
        padre.find('.dni').val(suggestion.dni);
        padre.find('.sexo').val(suggestion.sexo);
        padre.find('.fecha_nacimiento').val(suggestion.fecha_nacimiento);
        padre.find('.id_ocupacion').val(suggestion.id_ocupacion);
      }
  });
});

function edit_familiar(form)
{
  if((form.trim().length)>0)
  {
    var temp = $('#'+form).serialize()+'&id_personapadre='+$('#id_personapadre').val();
    var id = parseInt($('#'+form+' .id_familiar').val());
    var text = (id>0) ? ("Edito") : ("Agregó");
    var tipo = $('#'+form+' .tipo_familiar').val();

    $.ajax({
      url: $('base').attr('href') + 'personal/save_familiar',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {          
          $('table#'+tipo+' tbody').html(response.data.tr);
          var id_personal = $('#id_personal').val();
          $('#edit'+form).modal('hide');
          var go = " ";
          switch(tipo) {
          case 'conyuge':
            go = go+"Conyuge";
            break;

          case 'padres':
            go = go+"Familiares";
            break;

          case 'hijos':
            go = go+"Hijos";
            break;

          default:
              break;
          }
          
          $('#editpersonal').modal('hide');
          alerta(text+' Ok!', 'Se '+text+go+'.', 'success');
          var tipo = $('#myTab li.active').attr('tabs');
          var url = "";

          if($('#url_modulo').length)
          {
            direccionar();
          }
          else
          {
            url = $('base').attr('href') +'personal/edit/'+id_personal+'/'+tipo;
            window.location.href = url;
          }
        }
      }
    });
  }    
}

$(document).on('click', '.add_fam', function (e) {
  var padre = $(this);
  var tipo = padre.closest('table').attr('id');  
  var va = "Agregar";
  var go = "";
  //var form = "familiares";
  switch(tipo) {
    case 'conyuge':
      go = "Conyuge";
      break;

    case 'padres':
      go = "Familiares";
      //form = "personapadres";
      break;

    case 'hijos':
      go = "Hijos";
      break;

    default:
        break;
  }
  var form = padre.closest('table').attr('tipo');
  var papi = $('#edit'+form);
  papi.find('.va').html(va);
  papi.find('.go').html(go);
  papi.find('.tipo_familiar').val(tipo);

  html_operador('tipo=add_operadortel&orden=0', 'edit'+form+" .div_tel");
  html_operador('tipo=add_operadorcel&orden=0', 'edit'+form+' .div_celu');
});

$(document).on('hidden.bs.modal', '#editfamiliares', function (e)
{
  limp_todo('form_save_familiares');
});

$(document).on('change', '#id_estadocivil', function (e)
{
  var idcivil = parseInt($(this).val());
  var idpers = parseInt($('#id_personapadre').val());
  var idperl = parseInt($('#id_personal').val());
  if(idcivil>0 && idpers>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'personal/save_educacion',
      type: 'POST',
      data: 'id_estadocivil='+idcivil+'&id_persona='+idpers+'&id_personal='+idperl,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          
        }
      },
      complete: function() {
      }
    });
  }
});

$(document).on('click', '.delete_prnal', function (e) {
  e.preventDefault();

  var padre = $(this);
  var tipo = padre.closest('table').attr('id');
  var idfamiliar = $(this).parents('tr').attr('idfamiliar');
  var id_personal = $('#id_personal').val();
  
  var go = "";

  switch(tipo) {
    case 'conyuge':
      go = "Conyuge";
      break;

    case 'padres':
      go = "Familiares";
      break;

    case 'hijos':
      go = "Hijos";
      break;

    default:
        break;
  }

  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este "+go,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'personal/delete_personal',
        type: 'POST',
        data: 'id_familiar='+idfamiliar+'&tipo='+tipo,
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            var tipo = $('#myTab li.active').attr('tabs');
            var url = "";

            if($('#url_modulo').length)
            {
              direccionar();
            }
            else
            {
              url = $('base').attr('href') +'personal/edit/'+id_personal+'/'+tipo;
              window.location.href = url;
            }
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+go+' se '+text+'.', 'success');          
        }
      });
    }
  });

});

$(document).on('click', '.edit_prnal', function (e) {
  var papi = $(this);
  var tipo = papi.closest('table').attr('id');  
  var va = "Agregar";
  var go = "";

  var form = papi.closest('table').attr('tipo');
  var padre = $('#edit'+form);
  console.log("formEnvio->"+form);
  switch(tipo) {
    case 'conyuge':
      go = "Conyuge";
      break;

    case 'padres':
      go = "Familiares";
      break;

    case 'hijos':
      go = "Hijos";
      break;

    default:
        break;
  }

  padre.find('.va').html(va);
  padre.find('.go').html(go);
  padre.find('.tipo_familiar').val(tipo);

  var id_familiar = parseInt(papi.closest('tr').attr('idfamiliar'));         
  id_familiar = (id_familiar>0) ? (id_familiar) : (0);
  var padre = $('#form_save_'+form);
  if(id_familiar>0) {
    $.ajax({
      url: $('base').attr('href') + 'personal/edit_prnal',
      type: 'POST',
      data: 'id_familiar='+id_familiar+'&tipo='+tipo,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          //$('#id_personal').val(response.data.id_personal);
          padre.find('.id_familiar').val(response.data.id_familiar);
          padre.find('.id_persona').val(response.data.id_persona);
          padre.find('.dni').val(response.data.dni);
          padre.find('.nombres').val(response.data.nombres);
          padre.find('.apellidos').val(response.data.apellidos);
          padre.find('.sexo').val(response.data.sexo);
          padre.find('.id_ocupacion').val(response.data.id_ocupacion);
          padre.find('.fecha_nacimiento').val(response.data.fecha_nacimiento);
          if(tipo=="padres")
          {
            padre.find('.id_parentesco').val(response.data.id_parentesco);
            padre.find('.id_personapadres').val(response.data.id_personapadres);
          }
          padre.find('.div_celu').html(response.data.cell);
          padre.find('.div_tel').html(response.data.tele);
        }
      },
      complete: function() {
      }
    });
  }

});

/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/
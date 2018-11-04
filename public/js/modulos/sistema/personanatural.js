$( document ).ready(function() {

    var path_url = ($(location).attr('href')).split("/");
    if(path_url[6]=="crear_nuevo")
    {
      $('#editpersona').modal('show');
    }
    
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

    $('#fechanac').datetimepicker({
      format: 'DD-MM-YYYY',
      locale: moment.locale("es")
    });

    $('#fecha_nac').datetimepicker({
      viewMode: 'years',
      format: 'DD-MM-YYYY',
      locale: moment.locale("es")
    });

    $('#form_save_persona').validate({
        rules:
        {
          nombres:
          {
            required:true,
            minlength: 2
          },
          apellidos:
          {
            required:true,
            minlength: 2
          },
          dni:
          {
            required:true   
          },
          fecha_nacimiento:{formespn:true} 
        },
        messages:
        {
          nombres:
          {
            required:"Ingresar Nombres",
            minlength: "Más de 2 Letras"
          },
          apellidos:
          {
            required:"Ingresar Apellidos",
            minlength: "Más de 2 Letras"
          },
          dni:
          {
            required:"Ingresar DNI"
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
            if(element.parent('.col-md-6').length) 
            {
              error.insertAfter(element.parent()); 
            }
        },
        submitHandler: function() {
          var pasa = true;
          if($('#es_juridica').is(':checked') && ($('#ruc').val()=='' || $('#nombre_comercial').val()==''))
          {
            pasa = false;
            swal('Si es P.Natural con Negocio','llene el campo RUC y Razón Social','error');
          }

          if(pasa)
          {
            $.ajax({
                url: $('base').attr('href') + 'personanatural/save_personanatural',
                type: 'POST',
                data: $('#form_save_persona').serialize(),
                dataType: "json",
                beforeSend: function() {
                  $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    var sss = 'success';
                    var txt = 'Guardo Correctamente';
                    if (response.code==1) {                      
                      var page = 0;
                      if($('#paginacion_data ul.pagination li.active a').length>0)
                      {
                        page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                      }                   

                      $('#editpersona').modal('hide');
                      buscar_personanaturals(page);                      
                    }
                    else
                    {
                      sss = 'error',
                      txt = 'Error al Guardar';
                    }
                    var text = (id_persona=="0") ? ("Guardo!") : ("Edito!");
                    alerta(text, 'Esta nombres se '+text+'.', sss);
                },
                complete: function() {
                  limpio();
                  $.LoadingOverlay("hide");
                }
            });/**/
          }
        }
    });
});

$(function () {

  $( "#dnibusc" ).autocomplete({
    params: { 
      'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); }
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"persona/get_dni",
    onSelect: function (suggestion) 
    {
      $('#id_persona').val(suggestion.id_persona);
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#fecha_nacimientoo').val(suggestion.fecha_nacimiento);
      $('#dnibusc').val(suggestion.dni);

      var sexo = suggestion.sexo;

      $('#gender label').removeClass('active');
      $('#gender input').prop('checked', false);

      $('#gender #sexo_'+sexo).prop('checked', true);
      $('#gender #sexo_'+sexo).parent('label').addClass('active');

      $.ajax({
        url: $('base').attr('href') + 'personanatural/get_all_modulos',
        type: 'POST',
        data: 'id_persona='+suggestion.id_persona,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            var tuid = response.data.tuid;
            var ids = response.data.ids;
            var check = response.data.check;
            var i_d = "";
            var tu_id = "";
            var chec_k = "";
            for (var x in tuid) {
              tu_id = tuid[x];
              i_d = ids[x];
              chec_k = parseInt(check[x]);
              chec_k = (chec_k > 0) ? true : false;
              document.getElementById(tu_id).name = "chekmod["+tu_id+"]["+i_d+"]";
              document.getElementById(tu_id).value = check[x];
              document.getElementById(tu_id).checked = chec_k;

              document.getElementById('es_'+tu_id).name = "losids["+tu_id+"]";
              document.getElementById('es_'+tu_id).value = i_d;
            }
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });

});

$(document).on('change', '#form_save_persona input:radio[name=id_documentoidentidad]', function (e)
{
  var id = parseInt($(this).val());
  $('#dnibusc').val('');
  $('#dnibusc').prop( "disabled", false );
  $('#divdocu input').prop('checked', false);
  $('input#nodocu').prop('checked', true);
  if(id>0)
  {
    var autoge = $('#autoge').val();
    var nombr = autoge+$('input.doc_'+id).val();
    var padre = $('#dnibusc').closest('.form-group');
    padre.find('label.control-label span').html(nombr+' *');
    $('#dnibusc').attr({'placeholder':nombr});
  }    
});

$(document).on('change', '#form_save_persona input:radio[name=genera]', function (e)
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
          $('#dnibusc').val(response.data);
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
  else
  {
    $('#dnibusc').val('');
  }
  $('#dnibusc').prop( "disabled", va );
});

function limpio()
{
  //$('#form_save_persona input').attr({'name', 'chekmod[]'});
  var idss = "";
  $('#form_save_persona #div_docu input.chekmod').each(function (index, value){
    idss = $(this).attr('id');
    document.getElementById(idss).name = "chekmod["+idss+"][0]";
    document.getElementById(idss).value = 0;
    document.getElementById(idss).checked = false;

    document.getElementById('es_'+idss).name = "losids["+idss+"]";
    document.getElementById('es_'+idss).value = 0;
  });

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);

  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  $('#gender label').removeClass('active');
  $('#gender input').prop('checked', false);

  $('#gender #sexo_m').prop('checked', true);
  $('#gender #sexo_m').parent('label').addClass('active');

  $('#form_save_persona input').each(function (index, value){
    if($(this).attr('type')=="checkbox")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
      $(this).prop('checked', false);
    }

    if($(this).attr('type')=="text")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      $(this).val('');

      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
    }    
  });

}

$(document).on('click', '.add_pn', function (e) {
  limpio();
  limpiarform();
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_personanaturals(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_personanaturals(page);
});
$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_personanaturals(page);
});
$(document).on('change', '#solo_clientes', function (e) {
  var page = 0;
  buscar_personanaturals(page);
});
$(document).on('change', '#solo_conductores', function (e) {
  var page = 0;
  buscar_personanaturals(page);
});
$(document).on('change', '#solo_inventario', function (e) {
  var page = 0;
  buscar_personanaturals(page);
});
$(document).on('change', '#solo_personal', function (e) {
  var page = 0;
  buscar_personanaturals(page);
});
$(document).on('change', '#solo_proveedor', function (e) {
  var page = 0;
  buscar_personanaturals(page);
});

function buscar_personanaturals(page)
{
  var nombres_busc = $('#nombres_busc').val();
  var apellido_busc = $('#apellido_busc').val();
  var dni_busc = $('#dni_busc').val();
  var sexo_busc = $('#sexo_busc').val();
  var ruc = $('#ruc_busc').val();
  var nombre_comercial = $('#nomcom_busc').val();
  var temp = "page="+page;

  if($('#solo_clientes')[0].checked)
  {
    temp=temp+'&solo_clientes=1';
  }
  if($('#solo_conductores')[0].checked)
  {
    temp=temp+'&solo_conductores=1';
  }
  if($('#solo_inventario')[0].checked)
  {
    temp=temp+'&solo_inventario=1';
  }
  if($('#solo_proveedor')[0].checked)
  {
    temp=temp+'&solo_proveedor=1';
  }
  if($('#solo_personal')[0].checked)
  {
    temp=temp+'&solo_personal=1';
  }
  if(nombres_busc.trim().length)
  {
    temp=temp+'&nombres_busc='+nombres_busc;
  }

  if(apellido_busc.trim().length)
  {
    temp=temp+'&apellido='+apellido_busc;
  }

  if(dni_busc.trim().length)
  {
    temp=temp+'&busc_dni='+dni_busc;
  }

  if(sexo_busc.trim().length)
  {
    temp=temp+'&busc_sexo='+sexo_busc;
  }

  if (ruc.trim().length) {
    temp = temp + '&ruc=' + ruc;
  }

  if (nombre_comercial.trim().length) {
    temp = temp + '&nombre_comercial=' + nombre_comercial;
  }

  $.ajax({
      url: $('base').attr('href') + 'personanatural/buscar_personanaturals',
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

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_personanaturals(0);
});

$(document).on('hidden.bs.modal', '#edinombres', function (e)
{
  limpiarform();
});

$(document).on('click', '.add_nombres', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editnombres').modal('hide');
});

function limpiarform()
{
  $('#id_persona').val('0');
  $('#nombres').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#nombres').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#nombres').parents('.form-group').removeClass('has-error');
  }

  if($('#nombres-error').length>0)
  {
    $('#nombres-error').html('');
  }
  var validatore = $( "#form_save_nombres" ).validate();
  validatore.resetForm();
  $('input#es_visible').prop('checked', true);
}

$(document).on('click', '.edit', function (e) {
  var idpersona = $(this).parents('tr').attr('idpersona');
  $.ajax({
      url: $('base').attr('href') + 'personanatural/edit',
      type: 'POST',
      data: 'id_persona='+idpersona,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_persona').val(response.data.id_persona);
          $('#dnibusc').val(response.data.dni);
          $('#nombres').val(response.data.nombres);
          $('#apellidos').val(response.data.apellidos);
          $('#fecha_nacimientoo').val(response.data.fecha_nacimiento);
          var esjud = response.data.es_juridica;
          $('#nombre_comercial').val(response.data.nombre_comercial);
          $('#ruc').val(response.data.ruc);
          if(esjud==2)
          {
            $('#es_juridica').prop('checked',true);
            $('#nombre_comercial').closest('.form-group').removeClass('hidden');
            $('#ruc').closest('.form-group').removeClass('hidden');
          }
          else
          {
            $('#es_juridica').prop('checked',false);
            $('#nombre_comercial').closest('.form-group').addClass('hidden');
            $('#ruc').closest('.form-group').addClass('hidden');
          }
          var docu = parseInt(response.data.id_documentoidentidad);
          if(docu > 0) {
            $('input.doc_'+docu).parents('label.checkbox-inline').find('input[name="id_documentoidentidad"]').prop('checked',true);
          }
          $('#estado label').removeClass('active');
          $('#estado input').prop('checked', false);

          var num = response.data.estado;
          $('#estado #estado_'+num).prop('checked', true);
          $('#estado #estado_'+num).parent('label').addClass('active');

          var tuid = response.data.tuid;
          var ids = response.data.ids;
          var check = response.data.check;
          var i_d = "";
          var tu_id = "";
          var chec_k = "";

          for (var x in tuid) {
            tu_id = tuid[x];
            i_d = ids[x];
            chec_k = parseInt(check[x]);
            chec_k = (chec_k > 0) ? true : false;
            document.getElementById(tu_id).name = "chekmod["+tu_id+"]["+i_d+"]";
            document.getElementById(tu_id).value = check[x];
            document.getElementById(tu_id).checked = chec_k;

            document.getElementById('es_'+tu_id).name = "losids["+tu_id+"]";
            document.getElementById('es_'+tu_id).value = i_d;
          }          
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idnombres = $(this).parents('tr').attr('idnombres');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "nombres";
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
        url: $('base').attr('href') + 'personanatural/save_nombres',
        type: 'POST',
        data: 'id_persona='+idnombres+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {
              buscar_personanaturals(temp);
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpiarform();
          $.LoadingOverlay("hide");
        }
      });
    }
  });    
});

$('#div_docu input[type="checkbox"]').on('change', function() {
  var check = ($(this).is(":checked")) ? 1 : 0;
  $(this).val(check);
});

$('#es_juridica').on('change', function() {
    if($(this).is(":checked"))
    {
      $('#ruc').closest('.form-group').removeClass('hidden');
      $('#nombre_comercial').closest('.form-group').removeClass('hidden');
    }
    else
    {
      $('#ruc').closest('.form-group').addClass('hidden');
      $('#nombre_comercial').closest('.form-group').addClass('hidden');
    }
});

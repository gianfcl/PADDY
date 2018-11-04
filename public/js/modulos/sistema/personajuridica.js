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

    $('#form_save_personajuridica').validate({
        rules:
        {
          nombre_comercial:
          {
            required:true,
            minlength: 2
          },
          razon_social:
          {
            required:true,
            minlength: 2
          },
          ruc:
          {
            required:true,
            remote: {
              url: $('base').attr('href') + 'personajuridica/validar',
              type: "post",
              data: {
                tipo: function() { return 'ruc'; },
                idpj: function() { return $('#id_persona_juridica').val(); }
              }
            }  
          },
        },
        messages:
        {
          nombre_comercial:
          {
            required:"Ingresar Nombre",
            minlength: "Más de 2 Letras"
          },
          razon_social:
          {
            required:"Razon Social",
            minlength: "Más de 2 Letras"
          },
          ruc:
          {
            required:"Ingresar Ruc",
            remote:"Ya Existe"
          },
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
          $.ajax({
            url: $('base').attr('href') + 'personajuridica/save_personajuridica',
            type: 'POST',
            data: $('#form_save_personajuridica').serialize(),
            dataType: "json",
            beforeSend: function() {
                //showLoader();
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
                buscar_personajuridicas(page);                      
              }
              else
              {
                sss = 'error',
                txt = 'Error al Guardar';
              }
              var text = (parseInt($('#id_personajuridica').val()) >0 ) ? ("Edito!") : ("Guardo!");
              alerta(text, 'Esta nombres se '+text+'.', sss);
            },
            complete: function() {
              limpio();
            }
          });/**/
        }
    });
});

function armarmodulos(idperj)
{
  $.ajax({
    url: $('base').attr('href') + 'personajuridica/get_all_modulos',
    type: 'POST',
    data: 'id_persona_juridica='+suggestion.idperj,
    dataType: "json",
    beforeSend: function() {
      
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
        $('#id_provincia').val(data.id_provincia);
        $('#id_distrito').val(data.id_distrito);
      }
    },
    complete: function() {
    }
  });
}

$(function () {

  /*$( "#rucbusc" ).autocomplete({
    type:'POST',
    serviceUrl: $('base').attr('href')+"personajuridica/get_ruc",
    onSelect: function (suggestion) 
    {
      $('#id_personajuridica').val(suggestion.id_persona_juridica);
      $('#razon_social').val(suggestion.razon_social);
      $('#direccion_fiscal').val(suggestion.direccion_fiscal);
      $('#id_departamento').val(suggestion.id_departamento);
      $('#rucbusc').val(suggestion.ruc);
      armarmodulos(suggestion.id_persona_juridica);
    }
  });*/

  /*$( "#razon_social" ).autocomplete({
    //appendTo: autondni,
    type:'POST',
    serviceUrl: $('base').attr('href')+"personajuridica/get_rsocial",
    onSelect: function (suggestion) 
    {
      $('#id_persona_juridica').val(suggestion.id_persona_juridica);
      $('#razon_social').val(suggestion.razon_social);
      $('#direccion_fiscal').val(suggestion.direccion_fiscal);
      $('#id_departamento').val(suggestion.id_departamento);

      $('#rucbusc').val(suggestion.ruc);
      armarmodulos(suggestion.id_persona_juridica);
    }
  });*/

});

function limpio()
{
  //$('#form_save_persona input').attr({'name', 'chekmod[]'});
  var idss = "";
  $('#form_save_personajuridica #div_docu input.chekmod').each(function (index, value){
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

  limp_todo('form_save_personajuridica', '');
}

$(document).on('click', '.add_pn', function (e) {
  limpio();
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_personajuridicas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_personajuridicas(page);
});
$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_personajuridicas(page);
});

function buscar_personajuridicas(page)
{
  var razon_soc = $('#razon_soc').val();
  var nombres_com = $('#nombres_com').val();
  var ruc_dni = $('#ruc_dni').val();

  var temp = "page="+page;

  if(razon_soc.trim().length)
  {
    temp=temp+'&razon_social='+razon_soc;
  }

  if(nombres_com.trim().length)
  {
    temp=temp+'&nombres_com='+nombres_com;
  }

  if(ruc_dni.trim().length)
  {
    temp=temp+'&ruc_dni='+ruc_dni;
  }

  $.ajax({
      url: $('base').attr('href') + 'personajuridica/buscar_personajuridicas',
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

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_personajuridicas(0);
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
  var id_personajuridica = $(this).parents('tr').attr('idpersonajuridica');
  $.ajax({
      url: $('base').attr('href') + 'personajuridica/edit',
      type: 'POST',
      data: 'id_persona_juridica='+id_personajuridica,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_persona_juridica').val(response.data.id_persona_juridica);
          $('#rucbusc').val(response.data.ruc);
          $('#razon_social').val(response.data.razon_social);
          $('#nombre_comercial').val(response.data.nombre_comercial);
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
          //hideLoader();
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
        url: $('base').attr('href') + 'personajuridica/save_nombres',
        type: 'POST',
        data: 'id_persona_juridica='+idnombres+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_personajuridicas(temp);
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpiarform();
        }
      });
    }
  });    
});

$('#div_docu input[type="checkbox"]').on('change', function() {
  var check = ($(this).is(":checked")) ? 1 : 0;
  $(this).val(check);
});

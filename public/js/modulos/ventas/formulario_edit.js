$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });
    
    $('#form_save_etiqueta').validate({
        rules: 
        {
          etiqueta: { 
            required:true,
            remote: {
              url: $('base').attr('href') + 'formulario/validar_etiqueta',
              type: "post",
              data: {
                id_formulario: function() { return $( "#id_formulario" ).val(); },
                tipo: function() { return $( "#tipo_etiqueta" ).val(); },
                etiqueta: function() { return $('#etiqueta').val(); }
              }
            }
          }
        },
        messages: 
        {
          etiqueta:{ required:"Ingresar", remote: "Ya Existe" }
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
          var temp = $('#form_save_etiqueta').serialize()+'&id_formulario='+$('#id_formulario').val();
          var tipo = $('#tipo_etiqueta').val();
          edit_etiquetas(temp, tipo, "Agregó!");      
        }
    });

    $('#form_save_campo').validate({
        rules: 
        {
          campo: { 
            required:true,
            remote: {
              url: $('base').attr('href') + 'formulario/validar_campo',
              type: "post",
              data: {
                id_form_campo: function() { return $( "#id_form_campo" ).val(); },
                id_formulario: function() { return $( "#id_formulario" ).val(); },
                tipo: function() { return $( "#tipo_campo" ).val(); },
                campo: function() { return $('#campo').val(); }
              }
            }
          }
        },
        messages: 
        {
          campo:{ required:"Ingresar", remote: "Ya Existe" }
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
          var tipo = $('#tipo_campo').val();
          var tb = (tipo==1) ? ("camp_cabecera") : ("camp_pie_pagina");
          var orden = 0;

          $('table#'+tb+' td.detcampo').each(function (index, value){
            orden++;
          });

          var temp = $('#form_save_campo').serialize()+'&id_formulario='+$('#id_formulario').val()+'&orden='+orden;          
          
          edit_campos(temp, tb, tipo, orden);      
        }
    });

});

$(document).on('hidden.bs.modal', '#editetiqueta', function (e)
{
  limpiarform('editetiqueta', 'Etiqueta', 'etiq_cabecera');
});

$(document).on('click', '.btn_limpeti', function (e) {
  limpiarform('editetiqueta', 'Etiqueta', 'etiq_cabecera');
  $('#editetiqueta').modal('hide');
});

$(document).on('hidden.bs.modal', '#editcampo', function (e)
{
  limpiarform('editcampo', 'Campo', 'camp');
});

$(document).on('click', '.btn_limpcamp', function (e) {
  limpiarform('editcampo', 'Campo', 'camp');
  $('#editcampo').modal('hide');
});

function limpiarform(form, text, abr)
{  
  limpform(form);
  var lbl = text+" Cabecera";
  var desc = text.toLowerCase();
  $('#form_save_'+desc+' label').html(lbl);
  $('#'+desc).attr({'placeholder':lbl});
  $('#tipo_'+desc).val(abr);
}

$(document).on('change', '.addclma', function (e) {
  var div = 'div_maestros';
  var ids = get_joinids(div);
  edit_form('&colum_maestros='+ids);
});

$(document).on('change', '.addclxs', function (e) {
  var div = 'div_xsucursal';
  var ids = get_joinids(div);
  edit_form('&colum_xsucursal='+ids);
});

$(document).on('change', '.addclxa', function (e) {
  var div = 'div_xadicionales';
  var ids = get_joinids(div);
  edit_form('&colum_xadicional='+ids);
});

function get_joinids(div)
{
  var ids =  new Array();
  var i = 0;
  $('#'+div+' input[type=checkbox]:checked').each(function (index, value){
    ids[i] = $(this).val();
    i++;
  });
  return ids.join(',');
}

function edit_form(param)
{
  var temp = "id_formulario="+$('#id_formulario').val()+param;
  if((temp.trim().length)>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'formulario/save_formulario',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
        }
      }
    });
  }    
}


$(document).on('click', '.add_camp', function (e) {
  var text = 'Campo';
  var minu = text.toLowerCase();  
  var lbl = "Cabecera";

  tipo = $(this).attr('tipo'); console.log(text+' ->'+minu+' tipo->'+tipo);
  limpiarform('editcampo', text, tipo);
  if(tipo=="2")
  {
    lbl = "Pie Página";
  }
  $('#form_save_'+minu+' label').html(lbl);
  $('#'+minu).attr({'placeholder':text+' '+lbl});
  $('#tipo_'+minu).val(tipo);
});


$(document).on('click', '.add_etiq', function (e) {
  var tipo = $(this).attr('tipo');  
  limpiarform('editetiqueta', 'Etiqueta', tipo);
  var lbl = "Cabecera"
  if(tipo=="etiq_pie_pagina")
  {
    lbl = "Pie Página";
  }
  $('#form_save_etiqueta label').html(lbl);
  $('#etiqueta').attr({'placeholder':"Etiquetas "+lbl});
  $('#tipo_etiqueta').val(tipo);
});

function edit_etiquetas(temp, tipo, text)
{
  if((temp.trim().length)>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'formulario/save_etiqueta',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {          
          $('table#'+tipo+' tbody').html(response.data.tr);
          $('#editetiqueta').modal('hide');
          limpform('form_save_etiqueta','Etiqueta','etq');
          alerta(text, 'Esta Etiqueta se '+text+'.', 'success');  
        }
      }
    });
  }    
}

$(document).on('click', '.delete_etiqueta', function (e) {
  e.preventDefault();
  var tipo = $(this).parents('table').attr('id');
  var lbl = (tipo=="etiq_pie_pagina") ? ("Pie Página") : ("Cabecera");

  var id_formulario = $('#id_formulario').val();
  var etiqueta = $(this).parents('tr').find('td.detetiqueta').html();
  etiqueta = etiqueta.trim();
  var accion = '&accion=delete';

  var temp = 'tipo='+tipo+'&id_formulario='+id_formulario+'&etiqueta='+etiqueta+accion;

  var nomb = "Etiqueta!";

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
      edit_etiquetas(temp, tipo, "Elimino!");
    }
  });
  
});

function edit_campos(temp, tb, tipo, orden)
{
  if((temp.trim().length)>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'formulario/save_campo',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          orden = parseInt(orden);
          
          if(orden>0)
          {
            $('table#'+tb+' tbody').append(response.data.tr);
          }
          else
          {
            $('table#'+tb+' tbody').html(response.data.tr);
          }   
          
          $('#editcampo').modal('hide');
          limpform('form_save_campo', 'Campo', tipo);
          alerta("Agregó", 'Este Campo se Guardo.', 'success');  
        }
      }
    });
  }    
}

$(document).on('click', '.delete_campo', function (e) {
  e.preventDefault();
  var padre = $(this);
  var tipo = padre.attr('tipo');
  padre = padre.parents('tr');

  var lbl = (tipo=="2") ? ("Pie Página") : ("Cabecera");

  var id_form_campo = padre.attr('idfc');

  var temp = 'id_form_campo='+id_form_campo;

  var nomb = "Campo! de "+lbl;

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
      url: $('base').attr('href') + 'formulario/delete_campo',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          padre.remove();
          text = "Elimino Ok"
          $('#editcampo').modal('hide');
          limpform('form_save_campo', 'Campo', tipo);
          alerta(text, 'Este Campo se Elimino.', 'success');  
        }
      }
    });
    }
  });
  
});
$( document ).ready(function() {

    $('#tipo_persona').selectpicker();

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_tipodocumento').validate({
      rules:
      {
        tipodocumento: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'tipodocumento/validar_tipodocumento',
            type: "post",
            data: {
              tipodocumento: function() { return $( "#tipodocumento" ).val(); },
              id_tipodocumento: function() { return $('#id_tipodocumento').val(); }
            }
          },
        },
        tipo_persona: { required:true},
        chekmod: {required: true}
      },
      messages: 
      {
        tipodocumento: {required:"Almacén", minlength: "Más de 2 Letras", remote: "Ya existe" },
        chekmod: {required: "Seleccionar un Módulo"},
        tipo_persona: {required: "Seleccione un Tipo"}
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
        else
        {
          if (element.attr("type") == "checkbox") 
          {
              error.insertAfter(element.closest('.col-md6').children('.error_check') );
          } 
          else 
          {
              error.insertAfter(element.parent());
          }
        }
      },
      submitHandler: function() {
        var tipo_persona = ($('#tipo_persona').val()).join();

        $.ajax({
          url: $('base').attr('href') + 'tipodocumento/save_tipodocumento',
          type: 'POST',
          data: $('#form_save_tipodocumento').serialize()+'&tipo_personam='+tipo_persona,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if(response.code==1)
            {
              $('#edittipodocumento').modal('hide');
              buscar_tipodocumentos(0);
              var id_tipodocumento = parseInt($('#id_tipodocumento').val());
              id_tipodocumento = (id_tipodocumento>0) ? (id_tipodocumento) : ("0");
              var text = (id_tipodocumento=="0") ? ("Guardo!") : ("Edito!");
              alerta(text, 'Este Tipo de documento se '+text+'.', 'success');
              limpform('form_save_tipodocumento');
            }
          },
          complete: function(response) {
            $.LoadingOverlay("hide");
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#estado_busc').val(-1);
  buscar_tipodocumentos(0);
});

$(document).on('click', '.add_tipodocumento', function (e)
{
  limpform('form_save_tipodocumento');
  limpcheckform('form_save_tipodocumento', 'chekmod-error');
  $('#desc_sunat').val('');
  $('#tipo_persona').val('');
  $('#tipo_persona').selectpicker('refresh');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpform('form_save_tipodocumento');
  limpcheckform('form_save_tipodocumento', 'chekmod-error');
  $('#edittipodocumento').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_tipodocumentos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tipodocumentos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0; alert(page)
  buscar_tipodocumentos(page);
});

function buscar_tipodocumentos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  var cod_sunat_busc = $('#cod_sunat_busc').val();
  var desc_sunat = $('#desc_sunat_busc').val();
  
  var estado = $('#estado_busc').val();
  
  if(estado > -1)
  {
    temp=temp+'&estado_busc='+estado;
  }

  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }

  if(cod_sunat_busc.trim().length)
  {
    temp=temp+'&cod_sunat='+cod_sunat_busc;
  }

  if(desc_sunat.trim().length)
  {
    temp=temp+'&desc_sunat='+desc_sunat;
  }

  $.ajax({
    url: $('base').attr('href') + 'tipodocumento/buscar_tipodocumentos',
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

$('#div_docu input[type="checkbox"]').on('change', function() {
    if($(this).is(":checked"))  {
        $('#form_save_tipodocumento #check_docu').append("<input id='modulo"+$(this).val()+"' type='hidden' value='"+$(this).val()+"' name='modulos["+$(this).val()+"]' />");
    } else {
        $("#modulo"+$(this).val()).remove();
    }  
});

$(document).on('change','.cbxpad',function () {
  var tis = $(this);
  var idpad = parseInt(tis.val()); 
  var idtipodoc = parseInt(tis.parents('tr').attr('idtipodocumento'));

  if(idpad > 0 && idtipodoc>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'tipodocumento/upda',
      type: 'POST',
      data: 'idpad='+idpad+'&idtipodoc='+idtipodoc,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {              
          
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }

});

$(document).on('click','.add_docu',function () {
  var tis = $(this);
  var id = parseInt(tis.parents('tr').attr('idtipodocumentomaestro'));
  var des = tis.parents('tr').find('td.docu').html();
  id = (id > 0) ? id : 0;
  var page = parseInt($('#paginacion_data ul.pagination li.active a').attr('tabindex'));
  if(id > 0)
  {
    swal({
      title: 'Esta Seguro de Agregar?',
      text: "Tipo Documento: "+des,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!',
      allowOutsideClick:false
    }).then(function(isConfirm) {
      if (isConfirm) { 
        $.ajax({
          url: $('base').attr('href') + 'tipodocumento/add_docu',
          type: 'POST',
          data: 'id_tipodocumentomaestro='+id,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) {              
              buscar_tipodocumentos(page);
            }
          },
          complete: function() {
            $.LoadingOverlay("hide");
          }
        });
      }
    });
  }
    
});

$(document).on('click', '.edit', function (e) {
  $('#div_docu .checkbox').addClass('collapse');
  var idtipodocumento = $(this).parents('tr').attr('idtipodocumento');
  var idtipodocumentomaestro = $(this).parents('tr').attr('idtipodocumentomaestro');
  $.ajax({
    url: $('base').attr('href') + 'tipodocumento/edit',
    type: 'POST',
    data: 'id_tipodocumento='+idtipodocumento,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      
      limpcheckform('form_save_tipodocumentomaestro', 'chekmod-error');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_tipodocumento').val(response.data.id_tipodocumento);
        $('#id_tipodocumentomaestro').val(idtipodocumentomaestro);
        $('#tipodocumento').val(response.data.tipodocumentomaestro);
        $('#abreviatura').val(response.data.abreviatura);
        $('#chekmod input').prop('checked', false);

        var canma = parseInt(response.data.canma);
        canma = (canma > 0) ? canma : 0;

        if(canma > 0)
        {
          $.each( response.data.menq, function( index, value ){
            $('#chekmod'+index).parents('div.checkbox').removeClass('collapse');
          });

          var cantz = parseInt(response.data.cantz);
          cantz = (cantz > 0) ? cantz : 0;
          
          if(cantz > 0)
          {
            $.each( response.data.chekmod, function( index, value ){
              $('#chekmod'+index).prop('checked', true);
            });
          }
        }
          
        $('#check_docu').html(response.data.hidden);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

/*$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idtipodocumentomaestro = $(this).parents('tr').attr('idtipodocumentomaestro');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Almacén";

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
        url: $('base').attr('href') + 'tipodocumento/delete',
        type: 'POST',
        data: 'id_tipodocumentomaestro='+idtipodocumentomaestro+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_tipodocumentos(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpform('form_save_tipodocumentomaestro');
          limpcheckform('form_save_tipodocumentomaestro', 'chekmod-error');
        }
      });
    }
  });    
});*/

function eliminar(temp, txt)
{
  var page = parseInt($('#paginacion_data ul.pagination li.active a').attr('tabindex'));
  page = page > 0 ? page : 0;
  $.ajax({
    url: $('base').attr('href') + 'tipodocumento/editadd',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        buscar_tipodocumentos(page);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
      var txt = txt+"!";
      alerta(txt, 'Esta Modulo se '+text+'.', 'success');
    }
  });
}

$(document).on('click', '#div_docu input', function (e) {
  var tis = $(this);
  var idtipodoc= parseInt($('#id_tipodocumento').val());
  var idtipodocma = parseInt($('#id_tipodocumentomaestro').val());
  var idmenu = parseInt(tis.val());
  var estado = 0;
  var txt = 'Quitar';
  if(tis.is(":checked"))  {
    estado = 1;
    txt = 'Agregar';
  }

  idtipodoc = (idtipodoc > 0) ? idtipodoc : 0;
  idmenu = (idmenu > 0) ? idmenu : 0;

  var temp = "id_tipodocumentomaestro="+idtipodocma;

  if(idmenu > 0 && idtipodoc > 0)
  {
    temp = temp+'&id_tipodocumento='+idtipodoc+'&id_menu='+idmenu+'&estado='+estado;
    swal({
      title: 'Estas Seguro?',
      text: "De "+txt+' este Modulo',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
      if (isConfirm) {     
        eliminar(temp, txt);
      }
    }); 
  }

});

$(document).on('click', '.delete', function (e) {
  var tis = $(this);
  var idtipodoc = $(this).parents('tr').attr('idtipodocumento');
  var idtipodocma = $(this).parents('tr').attr('idtipodocumentomaestro');

  var estado = 0;
  var txt = 'Quitar Todo los';

  var temp = "id_tipodocumentomaestro="+idtipodocma;

  if(idtipodoc > 0)
  {
    temp = temp+'&id_tipodocumento='+idtipodoc+'&estado='+estado;
    swal({
      title: 'Estas Seguro?',
      text: "De "+txt+' Modulos',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
      if (isConfirm) {     
        eliminar(temp, txt);
      }
    }); 
  }
});
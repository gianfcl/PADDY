$( document ).ready(function() {
  $('#fecha_busc').daterangepicker({
    singleDatePicker: true,
    format: 'YYYY-MM-DD',
    calender_style: "picker_4"
    }, 
    function(start, end, label) {}
  );

  $('#fecha_ingreso2').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
    }, 
    function(start, end, label) {}
  );
  
  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "");


  $("#user").autocomplete({
    type:'POST',
    serviceUrl: $('base').attr('href')+"usuarios/get_usuario",
    onSelect: function (suggestion) 
    {
      $('#id_usuario').val(suggestion.id_usuario);
    }
  });


  $('#form_save_cabdocu').validate({
      rules:
      {
        id_tipodocumento:
        {
          required:true
        },
        fecha_ingreso:
        {
          required: true
        }       
      },
      messages: 
      {
        id_tipodocumento:
        {
          required:"Escoger un tipo",
        },
        fecha_ingreso:
        {
          required: "Ingrese Fecha"
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
        error.insertAfter(element.parent()); 
      },
      submitHandler: function() {
          $.ajax({
              url: $('base').attr('href') + 'ingresoxcompra/save_cabecera',
              type: 'POST',
              data: $('#form_save_cabdocu').serialize(),
              dataType: "json",
              beforeSend: function() {
                $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
              },
              success: function(response) {
                  if (response.data==1) {
                    buscar_documentos(0);
                    alerta('¡¡¡Datos actualizados','correctamente!!!','success');
                  }
               },
              complete: function() {
                $('#editcabecera').modal('hide');
                $.LoadingOverlay("hide");
              }
          });/**/
      }
  });
});

$('#fecha_ingreso2').on('show.daterangepicker', function(ev, picker) {
  $('.daterangepicker').css('z-index',999999);
});

$(document).on('focusout', '#user', function (e) {
  var user = $('#user').val();
  var id = parseInt($('#id_usuario').val());
  id = (id >0) ? (id) : (0);

  if(user.trim().length && id>0) {}
  else
  {
    $('#user').val('');
    $('#id_usuario').val('');
  }
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input').val('');
  $('#'+id).find('select').val('');
  buscar_documentos(0);
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_documentos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_documentos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_documentos(page);
});

function buscar_documentos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var serie_busc = $('#serie_busc').val();
  var numero_busc = $('#numero_busc').val();
  var tipodoc_busc = $('#tipodoc_busc').val();
  var fecha_busc = $('#fecha_busc').val();
  var id_proveedor = $('#id_provr').val();
  var id = parseInt($('#id_usuario').val());
  id = (id >0) ? (id) : (0);
  var estado = parseInt($('#estado').val());
  estado = (estado >0) ? (estado) : (0);
  var estado_impu = $('#estadoimpu').val();
  //var estado_busc = $('#estado_busc').val();

  var temp = "page="+page+'&id_tipomovimiento=1';
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(numero_busc.trim().length)
  {
    temp=temp+'&numero_busc='+numero_busc;
  }
  if(serie_busc.trim().length)
  {
    temp=temp+'&serie_busc='+serie_busc;
  }
  if(tipodoc_busc)
  {
    temp=temp+'&tipodoc_busc='+tipodoc_busc;
  }  
  if(fecha_busc.trim().length)
  {
    temp=temp+'&fecha_busc='+fecha_busc;
  }
  if(id>0)
  {
    temp=temp+'&id_user='+id;
  }
  if(estado>0)
  {
    temp=temp+'&estado='+estado;
  }
  if(estado_impu)
  {
    temp=temp+'&estado_impu='+estado_impu;
  }
  if(id_proveedor)
  {
    temp=temp+'&id_proveedor='+id_proveedor;
  }

  $.ajax({
    url: $('base').attr('href') + 'ingresoxcompra/buscar_documentos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
        $('#fecha_busc').daterangepicker({
          singleDatePicker: true,
          format: 'YYYY-MM-DD',
          calender_style: "picker_4"
        }, function(start, end, label) {
          console.log(start.toISOString(), end.toISOString(), label);
        });
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");     
    }
  });
}

$(document).on('click','.edit_cab',function(){
  var id = $(this).parents('tr').attr('iddocumento');
  if(id)
  {
    $.ajax({
    url: $('base').attr('href') + 'ingresoxcompra/edit_cab',
    type: 'POST',
    data: 'id_documento='+id,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_documento').val(id);
        $('#id_tipodocumento').val(response.data.id_tipodocumento);
        $('#serie').val(response.data.serie);
        $('#numero_correlativo').val(response.data.numero_correlativo); 
        $('#glosa').val(response.data.glosa);
        $('#fecha_ingreso2').val(response.data.fecha_ingreso); 
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");     
    }
  });
  }
});

$("#nombres_com").autocomplete({
  type:'POST',
  serviceUrl: $('base').attr('href')+"proveedor/buscar_proveaut",
  dataType : 'JSON',
  noCache:true,
  onSelect: function (suggestion)
  {
    var id_pr = suggestion.id_proveedor;
    console.log(id_pr);
    $('#id_provr').val(id_pr);
  }    
});
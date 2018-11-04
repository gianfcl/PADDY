$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_documentoidentidad').validate({
        rules:
        {
          documentoidentidad:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'documentoidentidad/validar_cc',
              type: "post",
              data: {
                documentoidentidad: function() { return $( "#documentoidentidad" ).val(); },
                id_documentoidentidad: function() { return $('#id_documentoidentidad').val(); }
              }
            }
          }      
        },
        messages: 
        {
          documentoidentidad:
          {
            required:"Documento de Identidad",
            minlength: "Más de 2 Letras",
            remote: 'Ya Existe'
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
            $.ajax({
                url: $('base').attr('href') + 'documentoidentidad/save_documentoidentidad',
                type: 'POST',
                data: $('#form_save_documentoidentidad').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var page = 0;
                      if($('#paginacion_data ul.pagination li.active a').length>0)
                      {
                        page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                      }                   

                      $('#editdocumentoidentidad').modal('hide');

                      buscar_documentoidentidads(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_documentoidentidad = parseInt($('#id_documentoidentidad').val());
                  id_documentoidentidad = (id_documentoidentidad>0) ? (id_documentoidentidad) : ("0");
                  var text = (id_documentoidentidad=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Documento de Identidad se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_documentoidentidad', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editdocumentoidentidad').modal('hide');
});

function limpiarform()
{
  $('#id_documentoidentidad').val('0');
  $('#documentoidentidad').val('');
  $('#codigo').val('');
  $('#descripcion').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#documentoidentidad').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#documentoidentidad').parents('.form-group').removeClass('has-error');
  }

  if($('#documentoidentidad-error').length>0)
  {
    $('#documentoidentidad-error').html('');
  }
  var validatore = $( "#form_save_documentoidentidad" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_documentoidentidads(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_documentoidentidads(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_documentoidentidads(page);
});

function buscar_documentoidentidads(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'documentoidentidad/buscar_documentoidentidads',
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

$(document).on('click', '.edit', function (e) {
  var iddocumentoidentidad = $(this).parents('tr').attr('iddocumentoidentidad');
  $.ajax({
      url: $('base').attr('href') + 'documentoidentidad/edit',
      type: 'POST',
      data: 'id_documentoidentidad='+iddocumentoidentidad,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_documentoidentidad').val(response.data.id_documentoidentidad);
            $('#documentoidentidad').val(response.data.documentoidentidad);
            $('#descripcion').val(response.data.descripcion);
            $('#codigo').val(response.data.codigo);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#documentoidentidad').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#documentoidentidad').parents('.col-md-8').removeClass('has-error');
            }

            if($('#documentoidentidad-error').length>0)
            {
              $('#documentoidentidad-error').html('');
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
  var iddocumentoidentidad = $(this).parents('tr').attr('iddocumentoidentidad');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "documentoidentidad";
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
        url: $('base').attr('href') + 'documentoidentidad/save_documentoidentidad',
        type: 'POST',
        data: 'id_documentoidentidad='+iddocumentoidentidad+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_documentoidentidads(temp);
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
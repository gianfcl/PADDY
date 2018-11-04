$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_instgrupo').validate({
        rules:
        {
          instgrupo:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'instgrupo/validar',
              type: "post",
              data: {
                instgrupo: function() { return $( "#instgrupo" ).val(); },
                id_instgrupo: function() { return $('#id_instgrupo').val(); }
              }
            }
          }       
        },
        messages: 
        {
          instgrupo:
          {
            required:"Campo Obligatorio",
            minlength: "Más de 2 Letras",
            remote: "Ya Existe"
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
                url: $('base').attr('href') + 'instgrupo/save_instgrupo',
                type: 'POST',
                data: $('#form_save_instgrupo').serialize(),
                dataType: "json",
                beforeSend: function() {
                  $.LoadingOverlay("Show",{image : "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    if (response.code==1) {
                      var page = 0;
                      if($('#paginacion_data ul.pagination li.active a').length>0)
                      {
                        page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                      }                   

                      $('#editinstgrupo').modal('hide');

                      buscar_instgrupos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  $.LoadingOverlay("hide"); 
                  var id_instgrupo = parseInt($('#id_instgrupo').val());
                  id_instgrupo = (id_instgrupo>0) ? (id_instgrupo) : ("0");
                  var text = (id_instgrupo=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este grupo se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_instgrupos(0);
});

$(document).on('click', '.add_instgrupo', function (e)
{
  $('#myModalLabel').text('Crear Grupo');
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editinstgrupo').modal('hide');
});

function limpiarform()
{
  $('#id_instgrupo').val('0');
  $('#instgrupo').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#instgrupo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#instgrupo').parents('.form-group').removeClass('has-error');
  }

  if($('#instgrupo-error').length>0)
  {
    $('#instgrupo-error').html('');
  }
  var validatore = $( "#form_save_instgrupo" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_instgrupos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_instgrupos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_instgrupos(page);
});

function buscar_instgrupos(page)
{
  var instgrupo_busc = $('#instgrupo_busc').val();
  var temp = "page="+page;
  if(instgrupo_busc.trim().length)
  {
    temp=temp+'&instgrupo_busc='+instgrupo_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'instgrupo/buscar_instgrupos',
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
  $('#myModalLabel').text('Editar Grupo');
  var idinstgrupo = $(this).parents('tr').attr('idinstgrupo');
  $.ajax({
      url: $('base').attr('href') + 'instgrupo/edit',
      type: 'POST',
      data: 'id_instgrupo='+idinstgrupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_instgrupo').val(response.data.id_instgrupo);
            $('#instgrupo').val(response.data.instgrupo);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#instgrupo').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#instgrupo').parents('.col-md-8').removeClass('has-error');
            }

            if($('#instgrupo-error').length>0)
            {
              $('#instgrupo-error').html('');
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
  var idinstgrupo = $(this).parents('tr').attr('idinstgrupo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var instgrupo_busc = $('#instgrupo_busc').val();
  var temp = "page="+page;
  if(instgrupo_busc.trim().length)
  {
    temp=temp+'&instgrupo_busc='+instgrupo_busc;
  }
  var nomb = "grupo";
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
        url: $('base').attr('href') + 'instgrupo/save_instgrupo',
        type: 'POST',
        data: 'id_instgrupo='+idinstgrupo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_instgrupos(temp);
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

$('#editinstgrupo').on('hidden.bs.modal', function (e) {
  $('body.nav-md').css('padding-right','0px');
})

$('#editinstgrupo').on('shown.bs.modal', function (e) {
  $('body.nav-md').css('padding-right','0px');
})
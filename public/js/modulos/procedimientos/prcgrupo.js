$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_prcgrupo').validate({
        rules:
        {
          prcgrupo:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'prcgrupo/validar',
              type: "post",
              data: {
                prcgrupo: function() { return $( "#prcgrupo" ).val(); },
                id_prcgrupo: function() { return $('#id_prcgrupo').val(); }
              }
            }
          }       
        },
        messages: 
        {
          prcgrupo:
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
                url: $('base').attr('href') + 'prcgrupo/save_prcgrupo',
                type: 'POST',
                data: $('#form_save_prcgrupo').serialize(),
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

                      $('#editprcgrupo').modal('hide');

                      buscar_prcgrupos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  $.LoadingOverlay("hide"); 
                  var id_prcgrupo = parseInt($('#id_prcgrupo').val());
                  id_prcgrupo = (id_prcgrupo>0) ? (id_prcgrupo) : ("0");
                  var text = (id_prcgrupo=="0") ? ("Guardo!") : ("Edito!");
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
  buscar_prcgrupos(0);
});

$(document).on('click', '.add_prcgrupo', function (e)
{
  $('#myModalLabel').text('Crear Grupo');
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editprcgrupo').modal('hide');
});

function limpiarform()
{
  $('#id_prcgrupo').val('0');
  $('#prcgrupo').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#prcgrupo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#prcgrupo').parents('.form-group').removeClass('has-error');
  }

  if($('#prcgrupo-error').length>0)
  {
    $('#prcgrupo-error').html('');
  }
  var validatore = $( "#form_save_prcgrupo" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_prcgrupos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_prcgrupos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_prcgrupos(page);
});

function buscar_prcgrupos(page)
{
  var prcgrupo_busc = $('#prcgrupo_busc').val();
  var temp = "page="+page;
  if(prcgrupo_busc.trim().length)
  {
    temp=temp+'&prcgrupo_busc='+prcgrupo_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'prcgrupo/buscar_prcgrupos',
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
  var idprcgrupo = $(this).parents('tr').attr('idprcgrupo');
  $.ajax({
      url: $('base').attr('href') + 'prcgrupo/edit',
      type: 'POST',
      data: 'id_prcgrupo='+idprcgrupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_prcgrupo').val(response.data.id_prcgrupo);
            $('#prcgrupo').val(response.data.prcgrupo);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#prcgrupo').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#prcgrupo').parents('.col-md-8').removeClass('has-error');
            }

            if($('#prcgrupo-error').length>0)
            {
              $('#prcgrupo-error').html('');
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
  var idprcgrupo = $(this).parents('tr').attr('idprcgrupo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var prcgrupo_busc = $('#prcgrupo_busc').val();
  var temp = "page="+page;
  if(prcgrupo_busc.trim().length)
  {
    temp=temp+'&prcgrupo_busc='+prcgrupo_busc;
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
        url: $('base').attr('href') + 'prcgrupo/save_prcgrupo',
        type: 'POST',
        data: 'id_prcgrupo='+idprcgrupo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_prcgrupos(temp);
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

$('#editprcgrupo').on('hidden.bs.modal', function (e) {
  $('body.nav-md').css('padding-right','0px');
})

$('#editprcgrupo').on('shown.bs.modal', function (e) {
  $('body.nav-md').css('padding-right','0px');
})
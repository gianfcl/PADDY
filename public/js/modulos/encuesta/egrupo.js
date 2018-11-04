$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_egrupo').validate({
        rules:
        {
          egrupo:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'egrupo/validar',
              type: "post",
              data: {
                egrupo: function() { return $( "#egrupo" ).val(); },
                id_egrupo: function() { return $('#id_egrupo').val(); }
              }
            }
          }       
        },
        messages: 
        {
          egrupo:
          {
            required:"Ingresar egrupo",
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
                url: $('base').attr('href') + 'egrupo/save_egrupo',
                type: 'POST',
                data: $('#form_save_egrupo').serialize(),
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

                      $('#editegrupo').modal('hide');

                      buscar_egrupos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_egrupo = parseInt($('#id_egrupo').val());
                  id_egrupo = (id_egrupo>0) ? (id_egrupo) : ("0");
                  var text = (id_egrupo=="0") ? ("Guardo!") : ("Edito!");
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
  buscar_egrupos(0);
});

$(document).on('click', '.add_egrupo', function (e)
{
  $('#myModalLabel').text('Crear Grupo');
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editegrupo').modal('hide');
});

function limpiarform()
{
  $('#id_egrupo').val('0');
  $('#egrupo').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#egrupo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#egrupo').parents('.form-group').removeClass('has-error');
  }

  if($('#egrupo-error').length>0)
  {
    $('#egrupo-error').html('');
  }
  var validatore = $( "#form_save_egrupo" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_egrupos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_egrupos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_egrupos(page);
});

function buscar_egrupos(page)
{
  var egrupo_busc = $('#egrupo_busc').val();
  var temp = "page="+page;
  if(egrupo_busc.trim().length)
  {
    temp=temp+'&egrupo_busc='+egrupo_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'egrupo/buscar_egrupos',
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
  var idegrupo = $(this).parents('tr').attr('idegrupo');
  $.ajax({
      url: $('base').attr('href') + 'egrupo/edit',
      type: 'POST',
      data: 'id_egrupo='+idegrupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_egrupo').val(response.data.id_egrupo);
            $('#egrupo').val(response.data.egrupo);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#egrupo').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#egrupo').parents('.col-md-8').removeClass('has-error');
            }

            if($('#egrupo-error').length>0)
            {
              $('#egrupo-error').html('');
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
  var idegrupo = $(this).parents('tr').attr('idegrupo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var egrupo_busc = $('#egrupo_busc').val();
  var temp = "page="+page;
  if(egrupo_busc.trim().length)
  {
    temp=temp+'&egrupo_busc='+egrupo_busc;
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
        url: $('base').attr('href') + 'egrupo/save_egrupo',
        type: 'POST',
        data: 'id_egrupo='+idegrupo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_egrupos(temp);
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
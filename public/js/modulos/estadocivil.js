$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_estadocivil').validate({
        rules:
        {
          estadocivil:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'estadocivil/validar_cc',
              type: "post",
              data: {
                estadocivil: function() { return $( "#estadocivil" ).val(); },
                id_estadocivil: function() { return $('#id_estadocivil').val(); }
              }
            }
          }       
        },
        messages: 
        {
          estadocivil:
          {
            required:"Estado Civil",
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
                url: $('base').attr('href') + 'estadocivil/save_estadocivil',
                type: 'POST',
                data: $('#form_save_estadocivil').serialize(),
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

                      $('#editestadocivil').modal('hide');

                      buscar_estadocivils(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_estadocivil = parseInt($('#id_estadocivil').val());
                  id_estadocivil = (id_estadocivil>0) ? (id_estadocivil) : ("0");
                  var text = (id_estadocivil=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Estado Civil se '+text+'.', 'success');
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

$(document).on('click', '.add_estadocivil', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editestadocivil').modal('hide');
});

function limpiarform()
{
  $('#id_estadocivil').val('0');
  $('#estadocivil').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#estadocivil').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#estadocivil').parents('.form-group').removeClass('has-error');
  }

  if($('#estadocivil-error').length>0)
  {
    $('#estadocivil-error').html('');
  }
  var validatore = $( "#form_save_estadocivil" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_estadocivils(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_estadocivils(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_estadocivils(page);
});

function buscar_estadocivils(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'estadocivil/buscar_estadocivils',
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
  var idestadocivil = $(this).parents('tr').attr('idestadocivil');
  $.ajax({
      url: $('base').attr('href') + 'estadocivil/edit',
      type: 'POST',
      data: 'id_estadocivil='+idestadocivil,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_estadocivil').val(response.data.id_estadocivil);
            $('#estadocivil').val(response.data.estadocivil);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#estadocivil').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#estadocivil').parents('.col-md-8').removeClass('has-error');
            }

            if($('#estadocivil-error').length>0)
            {
              $('#estadocivil-error').html('');
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
  var idestadocivil = $(this).parents('tr').attr('idestadocivil');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "estadocivil";
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
        url: $('base').attr('href') + 'estadocivil/save_estadocivil',
        type: 'POST',
        data: 'id_estadocivil='+idestadocivil+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_estadocivils(temp);
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
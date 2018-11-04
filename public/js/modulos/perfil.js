$(document).on('click', '#edit_perfilusuario', function (e)
{
    li_eff();
});

function li_eff()
{
  $('#div_cambiar_clave').addClass('collapse');
  $('#password_new').val('1234');
  $('#password_confi').val('1234');
}

$(document).on('click', '.btn_eff', function (e) {
    li_eff();
    $('#editfamilia').modal('editperfilusuario');
});

$(document).on('hidden.bs.modal', '#editperfilusuario', function (e)
{
  li_eff();
});

function car_eff()
{
  $('#div_cambiar_clave').removeClass('collapse');
  $('#password_new').val('');
  $('#password_confi').val('');
}
$(document).on('change', '#cambiar_clave', function (e) {
  var camb = ($(this).is(':checked')) ? ("1"): ("0");
  if(camb == "1")
  {    
    car_eff();
  }
  else
  {
    li_eff();
  }
});

$(document).on('change', 'button.savetucleve', function (e) {
  var camb = ($('#cambiar_clave').is(':checked')) ? ("1"): ("0");

  var nuev = $('#password_new').val();
  var conf = $('#password_confi').val();
  if(camb==1)
  {
    if(nuev == conf && nuev.trim().length)
    {
      $.ajax({
        url: $('base').attr('href') + 'usuarios/cambiar_clave',
        type: 'POST',
        data: $('#form_saveperfilusuario').serialize(),
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              alerta('Clave', 'Su Clave fue Edida', 'success');
              li_eff();
              $('#cambiar_clave').prop('checked', false);
              window.location.href = $('base').attr('href') + 'login';
            }
        },
        complete: function() {
            //hideLoader();
        }
      });
    }
    else
    {
      alerta('Error','No Coincide password','error')
    }
      
  }
});
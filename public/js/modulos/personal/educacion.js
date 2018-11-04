$( document ).ready(function() {

  $('#form_save_personal').validate({
        rules:
        {
          id_niveleducativo: { required:true }   
        },
        messages: 
        {
          id_niveleducativo: { required:"Nivel Educativo" }
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
                url: $('base').attr('href') + 'personal/save_educacion',
                type: 'POST',
                data: $('#form_save_personal').serialize(),
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

                      $('#editpersonal').modal('hide');

                      //buscar_personal(page);
                    }
                    else
                    {
                      limp_todo('form_save_personal');
                    }
                },
                complete: function() {
                  var id_personal = parseInt($('#id_personal').val());
                  id_personal = (id_personal>0) ? (id_personal) : ("0");
                  var text = (id_personal=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'El Personal se '+text+'.', 'success');
                  //limp_todo('form_save_personal');
                }
            });/**/
        }
    });
});

$(document).on('click','#id_niveleducativo',function(){
  var id_nivel = $(this).val();
  var tieneprof = $(this).find('option[value="'+id_nivel+'"]').attr('tiene_prof');
  console.log(tieneprof);
  if(tieneprof==1)
  {
    $('#id_profesion').parents('div.form-group').removeClass('hidden');
    $.ajax({
      url: $('base').attr('href') + 'profesion/cbx_profesion',
      type: 'POST',
      data: $('#form_save_personal').serialize(),
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_profesion').html(response.data);
          }
      },
      complete: function() {

      }
    });
  }
  else
  {
    $('#id_profesion').parents('div.form-group').addClass('hidden');
    $('#id_profesion').html('');
  }
});
/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/
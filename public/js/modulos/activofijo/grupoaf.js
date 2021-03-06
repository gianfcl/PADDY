$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_grupoaf').validate({
        rules:
        {
          grupoaf:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'grupoaf/validar',
              type: "post",
              data: {
                grupoaf: function() { return $( "#grupoaf" ).val(); },
                id_grupoaf: function() { return $('#id_grupoaf').val(); }
              }
            }
          }       
        },
        messages: 
        {
          grupoaf:
          {
            required:"Ingresar grupoaf",
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
                url: $('base').attr('href') + 'grupoaf/save_grupoaf',
                type: 'POST',
                data: $('#form_save_grupoaf').serialize(),
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

                      $('#editgrupoaf').modal('hide');

                      buscar_grupoafs(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_grupoaf = parseInt($('#id_grupoaf').val());
                  id_grupoaf = (id_grupoaf>0) ? (id_grupoaf) : ("0");
                  var text = (id_grupoaf=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este grupoaf se '+text+'.', 'success');
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

$(document).on('click', '.add_grupoaf', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editgrupoaf').modal('hide');
});

function limpiarform()
{
  $('#id_grupoaf').val('0');
  $('#grupoaf').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#grupoaf').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#grupoaf').parents('.form-group').removeClass('has-error');
  }

  if($('#grupoaf-error').length>0)
  {
    $('#grupoaf-error').html('');
  }
  var validatore = $( "#form_save_grupoaf" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_grupoafs(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_grupoafs(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_grupoafs(page);
});

function buscar_grupoafs(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'grupoaf/buscar_grupoafs',
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
  var idgrupoaf = $(this).parents('tr').attr('idgrupoaf');
  $.ajax({
      url: $('base').attr('href') + 'grupoaf/edit',
      type: 'POST',
      data: 'id_grupoaf='+idgrupoaf,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_grupoaf').val(response.data.id_grupoaf);
            $('#grupoaf').val(response.data.grupoaf);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#grupoaf').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#grupoaf').parents('.col-md-8').removeClass('has-error');
            }

            if($('#grupoaf-error').length>0)
            {
              $('#grupoaf-error').html('');
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
  var idgrupoaf = $(this).parents('tr').attr('idgrupoaf');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "grupoaf";
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
        url: $('base').attr('href') + 'grupoaf/save_grupoaf',
        type: 'POST',
        data: 'id_grupoaf='+idgrupoaf+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_grupoafs(temp);
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
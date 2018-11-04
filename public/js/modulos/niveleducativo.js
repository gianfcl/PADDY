$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_niveleducativo').validate({
        rules:
        {
          niveleducativo:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'niveleducativo/validar',
              type: "post",
              data: {
                niveleducativo: function() { return $( "#niveleducativo" ).val(); },
                id_niveleducativo: function() { return $('#id_niveleducativo').val(); }
              }
            }
          }       
        },
        messages: 
        {
          niveleducativo:
          {
            required:"Ingresar niveleducativo",
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
                url: $('base').attr('href') + 'niveleducativo/save_niveleducativo',
                type: 'POST',
                data: $('#form_save_niveleducativo').serialize(),
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

                      $('#editniveleducativo').modal('hide');

                      buscar_niveleducativos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_niveleducativo = parseInt($('#id_niveleducativo').val());
                  id_niveleducativo = (id_niveleducativo>0) ? (id_niveleducativo) : ("0");
                  var text = (id_niveleducativo=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Nivel Educativo'+text+'.', 'success');
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

$(document).on('click', '.add_niveleducativo', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editniveleducativo').modal('hide');
});

function limpiarform()
{
  $('#id_niveleducativo').val('0');
  $('#niveleducativo').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#niveleducativo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#niveleducativo').parents('.form-group').removeClass('has-error');
  }

  if($('#niveleducativo-error').length>0)
  {
    $('#niveleducativo-error').html('');
  }
  var validatore = $( "#form_save_niveleducativo" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_niveleducativos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_niveleducativos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_niveleducativos(page);
});

function buscar_niveleducativos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'niveleducativo/buscar_niveleducativos',
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
  var idniveleducativo = $(this).parents('tr').attr('idniveleducativo');
  $.ajax({
      url: $('base').attr('href') + 'niveleducativo/edit',
      type: 'POST',
      data: 'id_niveleducativo='+idniveleducativo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_niveleducativo').val(response.data.id_niveleducativo);
            $('#niveleducativo').val(response.data.niveleducativo);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#niveleducativo').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#niveleducativo').parents('.col-md-8').removeClass('has-error');
            }

            if($('#niveleducativo-error').length>0)
            {
              $('#niveleducativo-error').html('');
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
  var idniveleducativo = $(this).parents('tr').attr('idniveleducativo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "niveleducativo";
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
        url: $('base').attr('href') + 'niveleducativo/save_niveleducativo',
        type: 'POST',
        data: 'id_niveleducativo='+idniveleducativo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_niveleducativos(temp);
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
$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_parentesco').validate({
        rules:
        {
          parentesco:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'parentesco/validar_cc',
              type: "post",
              data: {
                parentesco: function() { return $( "#parentesco" ).val(); },
                id_parentesco: function() { return $('#id_parentesco').val(); }
              }
            }
          }       
        },
        messages: 
        {
          parentesco:
          {
            required:"Parentesco",
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
                url: $('base').attr('href') + 'parentesco/save_parentesco',
                type: 'POST',
                data: $('#form_save_parentesco').serialize(),
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

                      $('#editparentesco').modal('hide');

                      buscar_parentescos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_parentesco = parseInt($('#id_parentesco').val());
                  id_parentesco = (id_parentesco>0) ? (id_parentesco) : ("0");
                  var text = (id_parentesco=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Parentesco se '+text+'.', 'success');
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

$(document).on('click', '.add_parentesco', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editparentesco').modal('hide');
});

function limpiarform()
{
  $('#id_parentesco').val('0');
  $('#parentesco').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#parentesco').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#parentesco').parents('.form-group').removeClass('has-error');
  }

  if($('#parentesco-error').length>0)
  {
    $('#parentesco-error').html('');
  }
  var validatore = $( "#form_save_parentesco" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_parentescos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_parentescos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_parentescos(page);
});

function buscar_parentescos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'parentesco/buscar_parentescos',
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
  var idparentesco = $(this).parents('tr').attr('idparentesco');
  $.ajax({
      url: $('base').attr('href') + 'parentesco/edit',
      type: 'POST',
      data: 'id_parentesco='+idparentesco,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_parentesco').val(response.data.id_parentesco);
            $('#parentesco').val(response.data.parentesco);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#parentesco').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#parentesco').parents('.col-md-8').removeClass('has-error');
            }

            if($('#parentesco-error').length>0)
            {
              $('#parentesco-error').html('');
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
  var idparentesco = $(this).parents('tr').attr('idparentesco');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "parentesco";
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
        url: $('base').attr('href') + 'parentesco/save_parentesco',
        type: 'POST',
        data: 'id_parentesco='+idparentesco+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_parentescos(temp);
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
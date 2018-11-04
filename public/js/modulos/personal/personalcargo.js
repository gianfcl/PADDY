$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_personalcargo').validate({
        rules:
        {
          personalcargo:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'personalcargo/validar',
              type: "post",
              data: {
                personalcargo: function() { return $( "#personalcargo" ).val(); },
                id_personalcargo: function() { return $('#id_personalcargo').val(); }
              }
            }
          }       
        },
        messages: 
        {
          personalcargo:
          {
            required:"Ingresar personalcargo",
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
                url: $('base').attr('href') + 'personalcargo/save_personalcargo',
                type: 'POST',
                data: $('#form_save_personalcargo').serialize(),
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

                      $('#editpersonalcargo').modal('hide');
                      buscar_personalcargos(page);                      
                    }
                    else
                    {
                      if($('#personalcargo').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
                      {
                        $('#personalcargo').parents('.col-md-6').addClass('has-error');
                      }
                      
                      if($('#personalcargo-error').length>0)
                      {
                        $('#personalcargo-error').html(response.message);
                      }
                      else
                      {
                        $('#personalcargo').parents('.col-md-6').append("<span id='personalcargo-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                  var id_personalcargo = parseInt($('#id_personalcargo').val());
                  id_personalcargo = (id_personalcargo>0) ? (id_personalcargo) : ("0");
                  var text = (id_personalcargo=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta personalcargo se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_personalcargos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_personalcargos(page);
});
$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_personalcargos(page);
});

function buscar_personalcargos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'personalcargo/buscar_personalcargos',
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

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_personalcargos(0);
});

$(document).on('hidden.bs.modal', '#edipersonalcargo', function (e)
{
  limpiarform();
});

$(document).on('click', '.add_personalcargo', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editpersonalcargo').modal('hide');
});

function limpiarform()
{
  $('#id_personalcargo').val('0');
  $('#personalcargo').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#personalcargo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#personalcargo').parents('.form-group').removeClass('has-error');
  }

  if($('#personalcargo-error').length>0)
  {
    $('#personalcargo-error').html('');
  }
  var validatore = $( "#form_save_personalcargo" ).validate();
  validatore.resetForm();
  $('input#tipo_cargo').prop('checked', true);
}

$(document).on('click', '.edit', function (e) {
  var idpersonalcargo = $(this).parents('tr').attr('idpersonalcargo');
  $.ajax({
    url: $('base').attr('href') + 'personalcargo/edit',
    type: 'POST',
    data: 'id_personalcargo='+idpersonalcargo,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_personalcargo').val(response.data.id_personalcargo);
        $('#personalcargo').val(response.data.personalcargo);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        var vlu = parseInt(response.data.tipo_cargo);
        var exp = (vlu==2) ? (true) : (false);
        $('input#tipo_cargo').prop('checked', exp);

        if($('#personalcargo').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
        {
          $('#personalcargo').parents('.col-md-6').removeClass('has-error');
        }

        if($('#personalcargo-error').length>0)
        {
          $('#personalcargo-error').html('');
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
  var idpersonalcargo = $(this).parents('tr').attr('idpersonalcargo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "personalcargo";
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
        url: $('base').attr('href') + 'personalcargo/save_personalcargo',
        type: 'POST',
        data: 'id_personalcargo='+idpersonalcargo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_personalcargos(temp);
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
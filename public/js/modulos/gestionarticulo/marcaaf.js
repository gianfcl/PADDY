$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_marcaaf').validate({
        rules:
        {
          marcaaf:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'marcaaf/validar',
              type: "post",
              data: {
                marcaaf: function() { return $( "#marcaaf" ).val(); },
                id_marcaaf: function() { return $('#id_marcaaf').val(); }
              }
            }
          }       
        },
        messages: 
        {
          marcaaf:
          {
            required:"Ingresar marcaaf",
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
                url: $('base').attr('href') + 'marcaaf/save_marcaaf',
                type: 'POST',
                data: $('#form_save_marcaaf').serialize(),
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

                      $('#editmarcaaf').modal('hide');
                      buscar_marcaafs(page);                      
                    }
                    else
                    {
                      if($('#marcaaf').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
                      {
                        $('#marcaaf').parents('.col-md-6').addClass('has-error');
                      }
                      
                      if($('#marcaaf-error').length>0)
                      {
                        $('#marcaaf-error').html(response.message);
                      }
                      else
                      {
                        $('#marcaaf').parents('.col-md-6').append("<span id='marcaaf-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                  var id_marcaaf = parseInt($('#id_marcaaf').val());
                  id_marcaaf = (id_marcaaf>0) ? (id_marcaaf) : ("0");
                  var text = (id_marcaaf=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta marcaaf se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_marcaafs(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_marcaafs(page);
});
$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_marcaafs(page);
});

function buscar_marcaafs(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'marcaaf/buscar_marcaafs',
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
  buscar_marcaafs(0);
});

$(document).on('hidden.bs.modal', '#edimarcaaf', function (e)
{
  limpiarform();
});

$(document).on('click', '.add_marcaaf', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editmarcaaf').modal('hide');
});

function limpiarform()
{
  $('#id_marcaaf').val('0');
  $('#marcaaf').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#marcaaf').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#marcaaf').parents('.form-group').removeClass('has-error');
  }

  if($('#marcaaf-error').length>0)
  {
    $('#marcaaf-error').html('');
  }
  var validatore = $( "#form_save_marcaaf" ).validate();
  validatore.resetForm();
  $('input#es_visible').prop('checked', true);
}



$(document).on('click', '.edit', function (e) {
  var idmarcaaf = $(this).parents('tr').attr('idmarcaaf');
  $.ajax({
      url: $('base').attr('href') + 'marcaaf/edit',
      type: 'POST',
      data: 'id_marcaaf='+idmarcaaf,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_marcaaf').val(response.data.id_marcaaf);
            $('#marcaaf').val(response.data.marcaaf);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            var vlu = parseInt(response.data.es_visible);
            var exp = (vlu==1) ? (true) : (false);
            $('input#es_visible').prop('checked', exp);

            if($('#marcaaf').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
            {
              $('#marcaaf').parents('.col-md-6').removeClass('has-error');
            }

            if($('#marcaaf-error').length>0)
            {
              $('#marcaaf-error').html('');
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
  var idmarcaaf = $(this).parents('tr').attr('idmarcaaf');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "marcaaf";
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
        url: $('base').attr('href') + 'marcaaf/save_marcaaf',
        type: 'POST',
        data: 'id_marcaaf='+idmarcaaf+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_marcaafs(temp);
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
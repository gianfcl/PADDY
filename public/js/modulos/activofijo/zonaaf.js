$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_zonaaf').validate({
        rules:
        {
          zonaaf:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'zonaaf/validar',
              type: "post",
              data: {
                zonaaf: function() { return $( "#zonaaf" ).val(); },
                id_zonaaf: function() { return $('#id_zonaaf').val(); }
              }
            }
          }       
        },
        messages: 
        {
          zonaaf:
          {
            required:"Ingresar zonaaf",
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
                url: $('base').attr('href') + 'zonaaf/save_zonaaf',
                type: 'POST',
                data: $('#form_save_zonaaf').serialize(),
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

                      $('#editzonaaf').modal('hide');
                      buscar_zonaafs(page);                      
                    }
                    else
                    {
                      if($('#zonaaf').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
                      {
                        $('#zonaaf').parents('.col-md-6').addClass('has-error');
                      }
                      
                      if($('#zonaaf-error').length>0)
                      {
                        $('#zonaaf-error').html(response.message);
                      }
                      else
                      {
                        $('#zonaaf').parents('.col-md-6').append("<span id='zonaaf-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                  var id_zonaaf = parseInt($('#id_zonaaf').val());
                  id_zonaaf = (id_zonaaf>0) ? (id_zonaaf) : ("0");
                  var text = (id_zonaaf=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta zona se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_zonaafs(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_zonaafs(page);
});
$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_zonaafs(page);
});

function buscar_zonaafs(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'zonaaf/buscar_zonaafs',
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
  buscar_zonaafs(0);
});

$(document).on('hidden.bs.modal', '#edizonaaf', function (e)
{
  limpiarform();
});

$(document).on('click', '.add_zonaaf', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editzonaaf').modal('hide');
});

function limpiarform()
{
  $('#id_zonaaf').val('0');
  $('#zonaaf').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#zonaaf').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#zonaaf').parents('.form-group').removeClass('has-error');
  }

  if($('#zonaaf-error').length>0)
  {
    $('#zonaaf-error').html('');
  }
  var validatore = $( "#form_save_zonaaf" ).validate();
  validatore.resetForm();
  $('input#es_visible').prop('checked', true);
}



$(document).on('click', '.edit', function (e) {
  var idzonaaf = $(this).parents('tr').attr('idzonaaf');
  $.ajax({
      url: $('base').attr('href') + 'zonaaf/edit',
      type: 'POST',
      data: 'id_zonaaf='+idzonaaf,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_zonaaf').val(response.data.id_zonaaf);
            $('#zonaaf').val(response.data.zonaaf);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            var vlu = parseInt(response.data.es_visible);
            var exp = (vlu==1) ? (true) : (false);
            $('input#es_visible').prop('checked', exp);

            if($('#zonaaf').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
            {
              $('#zonaaf').parents('.col-md-6').removeClass('has-error');
            }

            if($('#zonaaf-error').length>0)
            {
              $('#zonaaf-error').html('');
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
  var idzonaaf = $(this).parents('tr').attr('idzonaaf');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "zonaaf";
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
        url: $('base').attr('href') + 'zonaaf/save_zonaaf',
        type: 'POST',
        data: 'id_zonaaf='+idzonaaf+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_zonaafs(temp);
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
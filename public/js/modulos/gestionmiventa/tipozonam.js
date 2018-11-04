$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_tipozonam').validate({
        rules:
        {
          tipozonam:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'tipozonam/validar',
              type: "post",
              data: {
                tipozonam: function() { return $( "#tipozonam" ).val(); },
                id_tipozonam: function() { return $('#id_tipozonam').val(); }
              }
            }
          }       
        },
        messages: 
        {
          tipozonam:
          {
            required:"Ingresar el tipo de zona",
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
                url: $('base').attr('href') + 'tipozonam/save_tipozonam',
                type: 'POST',
                data: $('#form_save_tipozonam').serialize(),
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

                      $('#edittipozonam').modal('hide');

                      buscar_tipozonams(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_tipozonam = parseInt($('#id_tipozonam').val());
                  id_tipozonam = (id_tipozonam>0) ? (id_tipozonam) : ("0");
                  var text = (id_tipozonam=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este tipozonam se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_tipozonams(0);
});

$(document).on('click', '.add_tipozonam', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#edittipozonam').modal('hide');
});

function limpiarform()
{
  $('#id_tipozonam').val('0');
  $('#tipozonam').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#tipozonam').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#tipozonam').parents('.form-group').removeClass('has-error');
  }

  if($('#tipozonam-error').length>0)
  {
    $('#tipozonam-error').html('');
  }
  var validatore = $( "#form_save_tipozonam" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_tipozonams(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tipozonams(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_tipozonams(page);
});

function buscar_tipozonams(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'tipozonam/buscar_tipozonams',
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
  var idtipozonam = $(this).parents('tr').attr('idtipozonam');
  $.ajax({
      url: $('base').attr('href') + 'tipozonam/edit',
      type: 'POST',
      data: 'id_tipozonam='+idtipozonam,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_tipozonam').val(response.data.id_tipozonam);
            $('#tipozonam').val(response.data.tipozonam);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#tipozonam').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#tipozonam').parents('.col-md-8').removeClass('has-error');
            }

            if($('#tipozonam-error').length>0)
            {
              $('#tipozonam-error').html('');
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
  var idtipozonam = $(this).parents('tr').attr('idtipozonam');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "tipozonam";
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
        url: $('base').attr('href') + 'tipozonam/save_tipozonam',
        type: 'POST',
        data: 'id_tipozonam='+idtipozonam+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_tipozonams(temp);
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
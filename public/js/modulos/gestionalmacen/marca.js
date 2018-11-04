$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_marca').validate({
        rules:
        {
          marca:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'marca/validar',
              type: "post",
              data: {
                marca: function() { return $( "#marca" ).val(); },
                id_marca: function() { return $('#id_marca').val(); }
              }
            }
          }       
        },
        messages: 
        {
          marca:
          {
            required:"Ingresar Marca",
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
                url: $('base').attr('href') + 'marca/save_marca',
                type: 'POST',
                data: $('#form_save_marca').serialize(),
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

                      $('#editmarca').modal('hide');
                      buscar_marcas(page);                      
                    }
                    else
                    {
                      if($('#marca').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
                      {
                        $('#marca').parents('.col-md-6').addClass('has-error');
                      }
                      
                      if($('#marca-error').length>0)
                      {
                        $('#marca-error').html(response.message);
                      }
                      else
                      {
                        $('#marca').parents('.col-md-6').append("<span id='marca-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                  var id_marca = parseInt($('#id_marca').val());
                  id_marca = (id_marca>0) ? (id_marca) : ("0");
                  var text = (id_marca=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Marca se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_marcas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_marcas(page);
});
$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_marcas(page);
});

function buscar_marcas(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'marca/buscar_marcas',
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
  buscar_marcas(0);
});

$(document).on('hidden.bs.modal', '#edimarca', function (e)
{
  limpiarform();
});

$(document).on('click', '.add_marca', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editmarca').modal('hide');
});

function limpiarform()
{
  $('#id_marca').val('0');
  $('#marca').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#marca').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#marca').parents('.form-group').removeClass('has-error');
  }

  if($('#marca-error').length>0)
  {
    $('#marca-error').html('');
  }
  var validatore = $( "#form_save_marca" ).validate();
  validatore.resetForm();
  $('input#es_visible').prop('checked', true);
}



$(document).on('click', '.edit', function (e) {
  var idmarca = $(this).parents('tr').attr('idmarca');
  $.ajax({
      url: $('base').attr('href') + 'marca/edit',
      type: 'POST',
      data: 'id_marca='+idmarca,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_marca').val(response.data.id_marca);
            $('#marca').val(response.data.marca);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            var vlu = parseInt(response.data.es_visible);
            var exp = (vlu==1) ? (true) : (false);
            $('input#es_visible').prop('checked', exp);

            if($('#marca').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
            {
              $('#marca').parents('.col-md-6').removeClass('has-error');
            }

            if($('#marca-error').length>0)
            {
              $('#marca-error').html('');
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
  var idmarca = $(this).parents('tr').attr('idmarca');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "Marca";
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
        url: $('base').attr('href') + 'marca/save_marca',
        type: 'POST',
        data: 'id_marca='+idmarca+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_marcas(temp);
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
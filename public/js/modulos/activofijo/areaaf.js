$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_areaaf').validate({
        rules:
        {
          id_zonaaf:{ required:true },
          areaaf:{ 
            remote: {
              url: $('base').attr('href') + 'areaaf/validar',
              type: "post",
              data: {
                id_zonaaf: function() { return $( "#id_zonaaf" ).val(); },
                areaaf: function() { return $('#areaaf').val(); },
                id_areaaf: function() { return $('#id_areaaf').val(); }
              }
            },            
            required:true,
            minlength: 2
          },       
        },
        messages: 
        {
          id_zonaaf:{required:"Seleccione Zona (A.F.)" },
          areaaf:{ required:"Ingresar areaaf", minlength: "Más de 2 Letras", remote:"Ya Existe" }
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
                url: $('base').attr('href') + 'areaaf/save_areaaf',
                type: 'POST',
                data: $('#form_save_areaaf').serialize(),
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
                      
                      buscar_areaafs(page);
                      $('#editareaaf').modal('hide');
                    }
                    limpiarform();
                },
                complete: function() {
                  var id_areaaf = parseInt($('#id_areaaf').val());
                  id_areaaf = (id_areaaf>0) ? (id_areaaf) : ("0");
                  var text = (id_areaaf=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta area se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });


});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#id_zonaaf_busc').val('');
  buscar_areaafs(0);
});

$(document).on('click', '.add_areaaf', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarform();
    $('#editareaaf').modal('hide');
});

function limpiarform()
{
  $('#id_areaaf').val('0');
  $('#id_zonaaf').val('');
  $('#areaaf').val('');

  if($('#areaaf').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#areaaf').parents('.form-group').removeClass('has-error');
  }
  
  if($('#areaaf-error').length>0)
  {
    $('#areaaf-error').html("");    
    $('#areaaf-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_zonaaf').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_zonaaf').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_zonaaf-error').length>0)
  {
    $('#id_zonaaf-error').html("");
    $('#id_zonaaf-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_areaaf" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_areaafs(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_areaafs(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_areaafs(page);
});

function buscar_areaafs(page)
{
  var id_zonaaf_busc = $('#id_zonaaf_busc').val();
  var um_busc = $('#um_busc').val();
  
  var temp = "page="+page;
  if(id_zonaaf_busc.trim().length)
  {
    temp=temp+'&id_zonaaf_busc='+id_zonaaf_busc;
  }

  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  
  $.ajax({
      url: $('base').attr('href') + 'areaaf/buscar_areaafs',
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
            limpiarform();
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
}

$(document).on('click', '.edit', function (e) {
  var idareaaf = $(this).parents('tr').attr('idareaaf');
  $.ajax({
    url: $('base').attr('href') + 'areaaf/edit',
    type: 'POST',
    data: 'id_areaaf='+idareaaf,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_areaaf').val(response.data.id_areaaf);
        $('#areaaf').val(response.data.areaaf);
        $('#id_zonaaf').val(response.data.id_zonaaf);
        $('select#id_zonaaf').val(response.data.id_zonaaf);


        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#areaaf').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#areaaf').parents('.form-group').removeClass('has-error');
        }

        if($('#areaaf-error').length>0)
        {
          $('#areaaf-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idareaaf = $(this).parents('tr').attr('idareaaf');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "area (A.F.)";
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
        url: $('base').attr('href') + 'areaaf/delete',
        type: 'POST',
        data: 'id_areaaf='+idareaaf,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_areaafs(page);
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
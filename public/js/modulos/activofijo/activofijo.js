$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

  $('#pest-2').hide();
    $('#form_save_activofijo').validate({
        rules:
        {
          descripcion:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'activofijo/validar',
              type: "post",
              data: {
                descripcion: function() { return $( "#descripcion" ).val(); },
                id_activofijo: function() { return $('#id_activofijo').val(); }
              }
            }
          },
          id_grupoaf: {required:true},
          id_familiaaf: {required:true},
          id_subfamiliaaf: {required:true}
        },
        messages: 
        {
          descripcion:
          {
            required:"Ingresar Activo Fijo",
            minlength: "Más de 2 Letras",
            remote: "Ya Existe"
          },
          id_grupoaf: {required:"Seleccionar Grupo"},
          id_familiaaf: {required:"Seleccionar Familia"},
          id_subfamiliaaf: {required:"Seleccionar Subfamilia"}
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
                url: $('base').attr('href') + 'activofijo/save_activofijo',
                type: 'POST',
                data: $('#form_save_activofijo').serialize(),
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

                      $('#editactivofijo').modal('hide');

                      buscar_activofijos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_activofijo = parseInt($('#id_activofijo').val());
                  id_activofijo = (id_activofijo>0) ? (id_activofijo) : ("0");
                  var text = (id_activofijo=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Activo Fijo se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('input[type=hidden]').val('');
  $('#idgrupoaf').val('');
  $('#idfamil').html('');
  $('#idsubfa').html('');
  buscar_activofijos(0);
 });

$(document).on('click', '.add_activofijo', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editactivofijo').modal('hide');
});

function limpiarform()
{
  $('#id_activofijo').val('0');
  $('#descripcion').val('');
  $('#id_grupoaf').val('');
  $('#id_familiaaf').html('');
  $('#id_subfamiliaaf').html('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');
  
  if($('#descripcion').parents('.form-group').attr('class')=="form-group has-error")
  {
  
    $('#descripcion').parents('.form-group').removeClass('has-error');
  }

  if($('#descripcion-error').length>0)
  {
    $('#descripcion-error').html('');
  }
  var validatore = $( "#form_save_activofijo" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_activofijos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_activofijos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_activofijos(page);
});

function buscar_activofijos(page)
{
  //Descripcion : 
  var um_busc = $('#descripcion_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&buscar_busc='+um_busc;
  }
  //Grupoaf: 
  var grupoaf = $('#idgrupoaf').val();

  if(grupoaf.trim().length)
  {
    temp=temp+'&grupoaf='+grupoaf;
  }

  //Familiaaf: 
  var familiaaf_busc = parseInt($('#idfamil').val());

  if(familiaaf_busc>0)
  {
    temp=temp+'&familiaaf_busc='+familiaaf_busc;
  }

  //SubFamiliaaf: 
  var subfamiliaaf_busc = parseInt($('#idsubfa').val());

  if(subfamiliaaf_busc>0)
  {
    temp=temp+'&subfamiliaaf_busc='+subfamiliaaf_busc;
  }

  $.ajax({
      url: $('base').attr('href') + 'activofijo/buscar_activofijos',
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
  var idactivofijo = $(this).parents('tr').attr('idactivofijo');
  $.ajax({
      url: $('base').attr('href') + 'activofijo/edit',
      type: 'POST',
      data: 'id_activofijo='+idactivofijo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_activofijo').val(response.data.id_activofijo);
            $('#descripcion').val(response.data.descripcion);
            $('#id_grupoaf').val(response.data.id_grupoaf);
            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);
            $('#id_familiaaf').html(response.data.familiaaf);
            $('#id_subfamiliaaf').html(response.data.subfamiliaaf);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#activofijo').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#activofijo').parents('.col-md-8').removeClass('has-error');
            }

            if($('#activofijo-error').length>0)
            {
              $('#activofijo-error').html('');
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
  var idactivofijo = $(this).parents('tr').attr('idactivofijo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');

  var temp = "page="+page;

  var nomb = "activofijo";
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
        url: $('base').attr('href') + 'activofijo/delete',
        type: 'POST',
        data: 'id_activofijo='+idactivofijo,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_activofijos(temp);
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


$(document).on('change', '#idgrupoaf', function (e) {
  
  var idgrupo = parseInt($(this).val());
  idgrupo = (idgrupo>0) ? (idgrupo) : (0);
  
  $('#idfamil').html('');
  $('#idsubfa').html('');
  if(idgrupo>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'familiaaf/cbox_familiaaf',
      type: 'POST',
      data: 'id_grupoaf='+idgrupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('select#idfamil').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '#id_grupoaf', function (e) {
  
  var idgrupo = parseInt($(this).val());
  idgrupo = (idgrupo>0) ? (idgrupo) : (0);
  
  $('#id_familiaaf').html('');
  $('#id_subfamiliaaf').html('');
  if(idgrupo>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'familiaaf/cbox_familiaaf',
      type: 'POST',
      data: 'id_grupoaf='+idgrupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('select#id_familiaaf').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});


$(document).on('change', '#id_zonaaf_ubi', function (e) {
  //alert('xs');
  
  var id_zonaaf_ubi = parseInt($(this).val());
  id_zonaaf_ubi = (id_zonaaf_ubi>0) ? (id_zonaaf_ubi) : (0);
  
  $('#id_areaaf_ubi').html('');

  if(id_zonaaf_ubi>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'areaaf/cbx_areaaf_tab ',
      type: 'POST',
      data: 'gr.id_zonaaf='+id_zonaaf_ubi,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('select#id_areaaf_ubi').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '#idfamil', function (e) {
  var idfamiliaaf = parseInt($(this).val());
  idfamiliaaf = (idfamiliaaf>0) ? (idfamiliaaf) : (0);
  
  $('#idsubfa').html('');
  if(idfamiliaaf>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamiliaaf/cbox_subfamiliaaf',
      type: 'POST',
      data: 'id_familiaaf='+idfamiliaaf,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#idsubfa').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '#id_familiaaf', function (e) {
  var idfamiliaaf = parseInt($(this).val());
  idfamiliaaf = (idfamiliaaf>0) ? (idfamiliaaf) : (0);
  
  //$('#idsubfa').html('');
  if(idfamiliaaf>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamiliaaf/cbox_subfamiliaaf',
      type: 'POST',
      data: 'id_familiaaf='+idfamiliaaf,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_subfamiliaaf').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});



$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

  $('#pest-2').hide();
    $('#form_save_ubicacion').validate({
        rules:
        {
          id_zonaaf_ubi: {required:true},
          id_areaaf_ubi: {required:true},

        },
        messages: 
        {
          id_zonaaf_ubi: {required:"Seleccionar Zona"},
          id_areaaf_ubi: {required:"Seleccionar Área"},
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
            if(element.parent('.col-md-4').length) 
            {
              error.insertAfter(element.parent()); 
            }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'activofijo/save_activofijo_ubi',
                type: 'POST',
                data: $('#form_save_ubicacion').serialize(),
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

                     }
                    else
                    {
                      limpiarform2();
                    }
                },
                complete: function() {
                  var id_activofijo = parseInt($('#id_activofijo').val());
                  id_activofijo = (id_activofijo>0) ? (id_activofijo) : ("0");
                  var text = (id_activofijo=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Activo Fijo se '+text+'.', 'success');
                  limpiarform2();
                }
            });/**/
        }
    });
});

function limpiarform2()
{
  $('#id_zonaaf_ubi').val('');
  $('#id_areaaf_ubi').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');
  
  if($('#descripcion-error').length>0)
  {
    $('#descripcion-error').html('');
  }
  var validatore = $( "#form_save_ubicacion" ).validate();
  validatore.resetForm();
}






  
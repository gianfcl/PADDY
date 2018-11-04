$( document ).ready(function() {
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_almacen').validate({
      rules:
      {          
        id_area: { required:true},
        id_ubicacion: { required:true}
      },
      messages: 
      {          
        id_area: { required:"Seleccionar Área" },
        id_ubicacion: { required:"Seleccionar Ubicación" }
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
          if(element.parent('.col-md-8').length) { error.insertAfter(element.parent()); }
      },
      submitHandler: function() {
        $.ajax({
          url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
          type: 'POST',
          data: $('#form_save_almacen').serialize(),
          dataType: "json",
          beforeSend: function() {
            //showLoader();
          },
          success: function(response) {
            if (response.code==1) {
              var tipo = $('#myTab li.active').attr('tabs');
              window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
            }                    
          },
          complete: function() {
              //hideLoader();
          }
        });/**/
      }
    });
});

$(document).on('change', '.id_zona', function (e) {
  var idzona = parseInt($(this).val());
  idzona = (idzona>0) ? (idzona) : (0);
  var padre = $(this).closest('.ve_ubicacion');
  padre.find('.id_area').html('');
  if(idzona>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'area/cbox_area',
      type: 'POST',
      data: 'id_zona='+idzona,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) { console.log(response.data)
          padre.find('select.id_area').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '.id_area', function (e) {
  var idarea = parseInt($(this).val());
  idarea = (idarea>0) ? (idarea) : (0);

  var padre = $(this).closest('.ve_ubicacion');
  padre.find('.id_ubicacion').html('');
  if(idarea>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'ubicacion/cbox_ubi',
      type: 'POST',
      data: 'id_area='+idarea,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          padre.find('.id_ubicacion').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '.id_ubicacion', function (e) {
  var idubi = parseInt($(this).val());
  idubi = (idubi>0) ? (idubi) : (0);
  var padre = $(this).closest('.contenedor');
  var idartalm = parseInt(padre.find('input.id_arti_almacen').val());
console.log(idubi+' <--> '+idartalm);
  if(idubi>0 && idartalm>0) {
    $.ajax({
      url: $('base').attr('href') + 'articuloxsucursal/save_ubialma',
      type: 'POST',
      data: 'id_ubicacion='+idubi+'&id_arti_almacen='+idartalm,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          /*var tipo = $('#myTab li.active').attr('tabs');
          window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;*/
        }                    
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});

$(document).on('change', '.existpa', function (e) {
    var padre = $(this);
    var estado = ($(this).is(':checked')) ? (1): (0);

    var id_art_sucursal = $('#id_art_sucursal').val();

    var papi = padre.closest('.contenedor');
    var id_almacen = parseInt(papi.find('input.id_almacen').val());
    var id_arti_almacen = parseInt(papi.find('input.id_arti_almacen').val());
    id_arti_almacen = (id_arti_almacen>0) ? (id_arti_almacen) : (0);

    if(estado==1)
    {
      papi.find('.ve_ubicacion').removeClass('collapse');
    }
    else
    {
      papi.find('.ve_ubicacion').addClass('collapse');
    }
    var temp = 'id_almacen='+id_almacen+'&id_arti_almacen='+id_arti_almacen+'&id_art_sucursal='+id_art_sucursal+'&estado='+estado;
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_arti_almacen',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          var tipo = $('#myTab li.active').attr('tabs');
          window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
        },
        complete: function() {
            //hideLoader();
        }
    });/**/
});

$(document).on('change', '.activopa', function (e) {
  var padre = $(this);
  var checked = (padre.is(':checked')) ? ("1"): ("0");
  
  var papi = padre.closest('.contenedor');
  var id_almacen = parseInt(papi.find('input.id_almacen').val());
  var id_arti_almacen = parseInt(papi.find('input.id_arti_almacen').val());

  var id_art_sucursal = $('#id_art_sucursal').val();

  var temp = 'id_arti_almacen='+id_arti_almacen+'&id_art_sucursal='+id_art_sucursal+'&checked='+checked;

  $.ajax({
      url: $('base').attr('href') + 'articuloxsucursal/save_arti_check',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $( ".activopa" ).each(function( index ) {
            $(this).prop('checked', false);
          });
          if(checked==1)
          {
            padre.prop('checked', true);
          }
        }                    
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('change', '#esinventariado', function (e) {
    var esinventariado = ($(this).is(':checked')) ? ("1"): ("2");
    $('#es_inventariado').val(esinventariado);
    if(esinventariado==1)
    {
        $('#div_inventariado').removeClass('collapse');
    }
    else
    {
        $('#div_inventariado').addClass('collapse');
    }

    var id_art_sucursal = parseInt($('#id_art_sucursal').val());
    id_art_sucursal = (id_art_sucursal>0) ? (id_art_sucursal) : (0);
    if(id_art_sucursal>0)
    {
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
            type: 'POST',
            data: 'id_art_sucursal='+id_art_sucursal+'&es_inventariado='+esinventariado,
            dataType: "json",
        beforeSend: function() {
        //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
            var tipo = $('#myTab li.active').attr('tabs');
            //window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
            }                    
        },
        complete: function() {
            //hideLoader();
            }
        });
    }   
});
/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/
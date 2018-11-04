$( document ).ready(function() {
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });
});

/*Es adicional*/
$(document).on('change', '#paraadicionar', function (e) {
  var para_adicionar = ($(this).is(':checked')) ? (1): (0);
  var id = parseInt($('#id_art_sucursal').val());
  var temp = "id_art_sucursal="+id+'&para_adicionar='+para_adicionar;
  $.ajax({
    url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
          
      }                    
    },
    complete: function() {
        //hideLoader();
    }
  });

});

$(document).on('change', '#esadicional', function (e) {
  var es_adicional = ($(this).is(':checked')) ? ("1"): ("0");
  var id_art_sucursal = $('#id_art_sucursal').val();
  if(es_adicional==1)
  {
    $('#div_es_adicional').removeClass('collapse');
  }
  else
  {
    $('#div_es_adicional').addClass('collapse');
  }
});


$(document).on('focusout', '.idartisucuadicionalescant', function (e)
{    
    e.preventDefault();
    var idpartesadicional = parseInt($(this).attr('idpartesadicional'));
    var idartsucursal = parseInt($('#id_art_sucursal').val());
    var cant = $(this).val();
    //alert(idpartesadicional+' '+idartsucursal);
    if(idpartesadicional>0 && idartsucursal>0)
    {
        var temp = "id_art_sucursal_padre="+idartsucursal+"&id_partesadicional="+idpartesadicional+'&cantidad='+cant;      
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/save_cant_adicional',
            type: 'POST',
            data: temp,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                   
                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
});

$(document).on('click', '.add_partesadicional', function (e)
{
    e.preventDefault();
    var idpartesadicional = parseInt($(this).parents('table').attr('idpartesadicional'));
    if(idpartesadicional>0)
    {
        $('#buscar_arti').attr({'idpartesadicional':idpartesadicional});
    }
    buscar_articulos_venta(0);
});

function get_joinids()
{
  var ids =  new Array();
  ids[0] = $('#id_art_sucursal').val();
  var i = 1;
  $('#tb_tipoadicional  tbody tr.ordenes').each(function (index, value){
    ids[i] = $(this).attr('idarticulosucursal');
    i++;
  });
  return ids.join(',');
}

$(document).on('click', '#pagina_data_bus_arti li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_articulos_venta(page);
});

$(document).on('click', '#pagina_data_bus_arti a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_articulos_venta(page);
});

$(document).on('click', '#buscar_arti a.buscar', function (e) {
  buscar_articulos_venta(0);
});

$(document).on('click', '#buscar_arti a.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  buscar_articulos_venta(0);
});

function buscar_articulos_venta(page)
{
    var ids = get_joinids();

    var temp = "page="+page+'&ids='+ids+'&para_adicionar=1';
    var cod_busc = $('#cod_busc').val();
    var descri_busc = $('#descri_busc').val();
    //var id_vent = $('#inid_med_venta_busc').val();
    var idgrupo = parseInt($('#idgrupo').val());
    var idfamil = parseInt($('#idfamil').val());
    var idsubfa = parseInt($('#idsubfa').val());

    if(cod_busc.trim().length)
    {
      temp=temp+'&codigo_busc='+cod_busc;
    }

    if(descri_busc.trim().length)
    {
      temp=temp+'&descripcion_busc='+descri_busc;
    }

    if(idgrupo>0)
    {
        temp=temp+'&id_grupo='+idgrupo; //console.log(descri_busc);
    }
    if(idfamil>0)
    {
        temp=temp+'&id_familia='+idfamil; //console.log(descri_busc);
    }
    if(idsubfa>0)
    {
        temp=temp+'&id_subfamilia='+idsubfa; //console.log(descri_busc);
    }

    $.ajax({
      url: $('base').attr('href') + 'articuloxsucursal/buscar_articulos_venta1',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#buscar_arti tbody').html(response.data.rta);
            $('#pagina_data_bus_arti').html(response.data.paginacion);
          }
      },
      complete: function() {
          //hideLoader();
      }
    });      
}

$(document).on('click', '#buscar_arti a.saveorden', function (e) {
  var tis = $(this);
  var idartsucursal = parseInt(tis.parents('tr').attr('idartsucursal'));
  var idartsucursalpadre = parseInt($('#id_art_sucursal').val());

  if(idartsucursal>0 && idartsucursalpadre>0)
  {
    var orden = parseInt($('table#tb_tipoadicional tr.ordenes').length);
    var temp = "id_art_sucursal_padre="+idartsucursalpadre+"&id_art_sucursal_adicional="+idartsucursal+'&orden='+orden;

    swal({
        title: 'Esta Seguro de Agregar',
        text: "El adicional de: ",
        type: 'question',
        showCancelButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, estoy seguro!',
        cancelButtonText: 'No, cancelar!',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
        allowOutsideClick: false
    }).then(function () {
        save_adicionales(temp,'save',tis);
    }, function (dismiss) {
    if (dismiss === 'cancel') {
      alerta('Cancelado', "El adicional de: ",'error');
    }
    });
  }
});

function save_adicionales(temp,topo, tis = '')
{
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/'+topo+'_adicional',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          if (response.code==1) {
            var dele = parseInt(response.data.dele);
            var htm = response.data.html;

            var ord = parseInt(response.data.orden);
            if(dele>0)
            {
              if(ord==0)
              {
                  $('table#tb_tipoadicional tbody').html('');
              }
              $('table#tb_tipoadicional tbody').append(htm);
              tis.parents('tr').remove();
            }
            else
            {
              tis.parents('tr').remove();
              num_orden();
//alert('table#tb_tipoadicional_'+tip+' tr#tr_'+dele);
              if(ord==1)
              {
                 $('table#tb_tipoadicional tbody').append(htm); 
              }
            }
                  
          }                    
        },
        complete: function() {
           
        }
    });
}

function num_orden()
{
  var i = 0;
  var num = parseInt($('table#tb_tipoadicional tbody tr.ordenes td.orden').length);
  if(num>0)
  {
    $('table#tb_tipoadicional tbody tr.ordenes td.orden').each(function (index, value){
      i++;
      $(this).html(i);
    });
  }    
}

$(document).on('click', '.delete_adicionales', function (e)
{
    e.preventDefault();
    var tis = $(this);
    var idartsucursal = parseInt(tis.parents('tr').attr('idarticulosucursal'));
    var idartsucursalpadre = parseInt($('#id_art_sucursal').val());

    var orden = parseInt($('table#tb_tipoadicional tr.ordenes').length);
    if(idartsucursal>0 && idartsucursalpadre>0)
    {
        var temp = "id_art_sucursal_padre="+idartsucursalpadre+"&id_art_sucursal_adicional="+idartsucursal+'&orden='+orden;
        var va = tis.parents('div.col-md-12').find('fieldset legend span').html();
        swal({
            title: 'Estad Seguro?',
            text: "Eliminar este adicional de "+va,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, estoy seguro!'
        }).then(function(isConfirm) {
            if (isConfirm) {     
                save_adicionales(temp,'delete',tis);
            }
        });          
    }
});

$(".modal-wide").on("show.bs.modal", function() {
  var height = $(window).height() - 200;
  $(this).find(".modal-body").css("max-height", height);
});

$(document).on('change', '#idgrupo', function (e) {
  var idgrupo = parseInt($(this).val());
  idgrupo = (idgrupo>0) ? (idgrupo) : (0);
  
  $('#idfamil').html('');
  $('#idsubfa').html('');
  if(idgrupo>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'familia/cbox_familia',
      type: 'POST',
      data: 'id_grupo='+idgrupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) { console.log(response.data)
          $('select#idfamil').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '#idfamil', function (e) {
  var idfamilia = parseInt($(this).val());
  idfamilia = (idfamilia>0) ? (idfamilia) : (0);
  
  $('#idsubfa').html('');
  if(idfamilia>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_familia='+idfamilia,
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
/*Validar Al Salir del Formulario*/
function validar_tabs(tipo)
{
    var esadicional = ($('#esadicional').is(':checked')) ? ("1"): ("0");
    var valor = true;
    var cantpro = parseInt($('table#tb_proveedor tbody tr td.orden').length);
    //console.log(tipo+' esadicional->'+esadicional+' cantpro->'+cantpro+' valor->'+valor);
    if(esadicional== "1")
    {
        var valor = false;

        if(cantpro >1)
        {
            var valor = true;
            salidajax(tipo);
        }
    }
    else
    {
        salidajax(tipo);
    }
    return (valor) ? ('') : ('Ingresar un Proveedor');
}

function salidajax(tipo)
{
    var id_art_sucursal = parseInt($('#id_art_sucursal').val()); //console.log(id_art_sucursal);
    if(id_art_sucursal>0)
    {
        var para_ventas_val = $('#para_adicional_val').val(); 
        var esadicional = ($('#esadicional').is(':checked')) ? ("1"): ("0");
        if(esadicional==1)
        {
            var cantpro = parseInt($('div#div_es_adicional table tbody tr td.orden').length);
            if(cantpro == 0)
            {
                esadicional = 0;
            }
        }

        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
            type: 'POST',
            data: 'id_art_sucursal='+id_art_sucursal+'&es_adicional='+esadicional,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
                }                    
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
}

function salidaformulario(validar, tipo)
{
    swal({
        title: 'Esta Seguro de Salir?',
        text: "No olvide "+validar,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, estoy seguro!',
        allowOutsideClick:false
    }).then(function(isConfirm) {
        if (isConfirm) {     
            salidajax(tipo)
        }
    });               
}
/*<---->*/
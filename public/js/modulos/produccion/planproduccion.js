$( document ).ready(function() {

  $('#fecha_ingreso').datetimepicker({
    format: 'DD-MM-YYYY',
    minDate: moment(),
    locale: moment.locale("es")
  });


  $(".select2_multiple").select2({
    maximumSelectionLength: 6,
    placeholder: "Maximo 6",
    allowClear: true
  });
});

function limp_ando()
{
  var id = "";
  $('#buscar_arti').find('input[type=text]').val('');
  $('#buscar_arti select').val('');

  var pend = $('#datatable-buttons').attr('pendiente');
  $('#estadplan').val(pend);
  $('#tipodplan').val('');
  $('#idartsucursal').val('');
  $('#id_planproduccion').val('');
  $('#divestados').html('');
  $('#buscar_arti tbody tr td a.saveorden').removeClass( "disabled" );
  $('#buscar_arti tbody').html("<tr><td colspan='9'><h2 class='text-center text-success'>No hay Ordenes de Producción</h2></td></tr>"); 
}

$(document).on('click', 'a.add_planproduccion', function (e) {
  limp_ando();
});

$(document).on('click', '#buscar_arti a.saveorden', function (e) {
  var padre = $(this).parents('tr');
  var id_art = padre.attr('idartsucursal');
  var tipo = padre.attr('tipo');

  $('#tipodplan').val(tipo);
  $('#idartsucursal').val(id_art);

  $('#buscarart').modal('hide');
  crear_ordenproduccion();
});

function crear_ordenproduccion()
{
  var id = parseInt($('#id_planproduccion').val());
  var estado = $('#estadplan').val();
  var id_art = $('#idartsucursal').val();
  var tipo = $('#tipodplan').val();

  var temp = 'id_art='+id_art+'&tipo='+tipo+'&id='+id+'&estado='+estado;

  var txt = (tipo==1) ? ("Producción con receta") : ("Producción de sub producto");
  $.ajax({
    url: $('base').attr('href') + 'planproduccion/crear_ordenproduccion',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      var code = parseInt(response.code);
      if (code == 1) {
        buscar_documentos(0);
        alerta('Guardo', 'Con éxito '+txt+'.', 'success');
      }                    
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('click', '#pagina_data_bus_arti li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_artiproduccion(page);
});

$(document).on('click', '#pagina_data_bus_arti a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_artiproduccion(page);
});

$(document).on('click', '#buscar_arti a.buscar', function (e) {
  buscar_artiproduccion(0);
});

$(document).on('click', '#buscar_arti a.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  buscar_artiproduccion(0);
});

function buscar_artiproduccion(page)
{
  var cod_busc = $('#cod_busc').val();
  var descri_busc = $('#descri_busc').val();
  var idgrupo = parseInt($('#idgrupo').val());
  var idfamil = parseInt($('#idfamil').val());
  var idsubfa = parseInt($('#idsubfa').val());
  var temp = "page="+page;

  if(cod_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+cod_busc; //console.log(cod_busc);
  }

  if(descri_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descri_busc; //console.log(descri_busc);
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

  var ides = parseInt($('#idartsucursal').val());

  $.ajax({
    url: $('base').attr('href') + 'ordenenproduccion/buscar_artiproduccion',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#buscar_arti tbody').html(response.data.rta);
        $('#pagina_data_bus_arti').html(response.data.paginacion);
        if(ides>0)
        {
          $('#buscar_arti tbody tr#idarti_'+ides+' td a.saveorden').removeClass( "disabled" );
          $('#buscar_arti tbody tr#idarti_'+ides+' td a.saveorden').addClass( "disabled" );
        }
          
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

function openmodal(val)
{
  if(val)
  {
    $('#buscarmodal').modal({show: "'"+val+"'", backdrop: 'static'});
  }
  else
  {
    $('button.close').click();
  }  
}

/*$(".modal-wide").on("show.bs.modal", function() {
  var height = $(window).height() - 200;
  $(this).find(".modal-body").css("max-height", height);
});*/

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

$(document).on('click', '.btn_limpiar', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('select').val('');
  buscar_documentos(0);
});

$(document).on('hidden.bs.modal', '#buscarart', function (e)
{
  limp_ando();
});

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {
  var padre = $(this).find('a');
  var page = padre.attr('tabindex');
  buscar_documentos(page);
});

$(document).on('click', '#paginacion_data a.paginate_button', function (e) {
  var padre = $(this);
  buscar_documentos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_documentos(page);
});

function buscar_documentos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var fechadocu_busc = $('#fechadocu_busc').val();
  var descripcion_busc = $('#descripcion_busc').val();

  var temp = "page="+page+'&id_tipomovimiento='+$('#id_tipomovimiento').val();

  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }

  if(fechadocu_busc.trim().length)
  {
    temp=temp+'&fecha_busc='+fechadocu_busc;
  }

  if(descripcion_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descripcion_busc;
  }

  var idform = ifrome();
  if(idform != "-")
  {
    temp=temp+'&idestados='+idform;
  }

  $.ajax({
    url: $('base').attr('href') + 'planproduccion/buscar_documentos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
               
      }
    },
    complete: function() {     
    }
  });
}

$(document).on('click', 'a.edit', function (e) {
  var id = parseInt($(this).parents('tr').attr('idplanproduccion'));
  var idarti = parseInt($(this).parents('tr').attr('idarti'));
  if(id>0 && idarti>0)
  {
    $('#id_planproduccion').val(id);
    $('#cod_busc').val(idarti);
    $('#idartsucursal').val(idarti);
    
    buscar_artiproduccion(0);
    var html = "";

    $.ajax({
    url: $('base').attr('href') + 'planproduccion/adjuntarbotones',
    type: 'POST',
    data: 'id='+id,
    dataType: "json",
    beforeSend: function() {
      
    },
    success: function(response) {
      if (response.code==1) {
        var id = response.data.id;
        var no = response.data.no;
        var es = parseInt(response.data.estado);
        var ides = parseInt(response.data.ides)

        var tipo = response.data.tipo;
        var id_art = response.data.id_art;

        $('#estadoplan').val(es);
        for (var x in id) {
          clas = (id[x] == es) ? ('primary') : ('default');
          html += "<button estado='"+id[x]+"' type='button' class='btn btn-"+clas+"'>"+no[x]+"</button>";
        }
        $('div#divestados').html(html);
        $('#id_planproduccion').val(ides);
        $('#tipodplan').val(tipo);
        $('#idartsucursal').val(id_art);
        $('#estadplan').val(es)
      }
    },
    complete: function() {    
    }
  });
  }
});

$(document).on('click', 'div#divestados button', function (e) {
  $('div#divestados button').removeClass('btn-primary');
  $('div#divestados button').removeClass('btn-default');
  $('div#divestados button').addClass('btn-default');
  $(this).removeClass('btn-default');
  $(this).addClass('btn-primary');
  var estadopla = parseInt($(this).attr('estado')); //alert(estadopla)
  $('#estadplan').val(estadopla);
  $('#buscarart').modal('hide');
  crear_ordenproduccion();
});

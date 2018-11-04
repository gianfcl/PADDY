$(document).on('change', '#id_areaposicion', function (e)
{
  var idarea = parseInt($(this).val());
  idarea = (idarea>0) ? (idarea) : ("");
  $('#id_posicion').html('');
  if(idarea>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'posicion/cbx_posicion',
      type: 'POST',
      data: 'id_areaposicion='+idarea,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_posicion').html(response.data);
        }                    
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('change', '#id_posicion', function (e)
{
  var idposicion = parseInt($('#id_posicion').val());
  if(idposicion>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'misactividades/all_actiposicion',
      type: 'POST',
      data: 'id_posicion='+idposicion,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#allactiv').html(response.data.activi);
          $('#actprod').html(response.data.actprod);
        }
        else
        {
          $('#allactiv').html(response.data.activi);
          $('#actprod').html(response.data.actprod);
        }                    
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('click', '.horario', function (e)
{
  var idposicion = parseInt($('#id_posicion').val());
  var idposicionactividad = parseInt($(this).attr('posiacti'));
  var idmis = $('#allactiv').attr('idacti');
  var caso = $(this).attr('case');
  var temp = 'id_posicionactividad='+idposicionactividad+'&id_posicion='+idposicion+'&case='+caso+'&id_misactividades='+idmis;
  
  if(idposicion>0 && idposicionactividad>0)
  {
    if($('#'+idposicionactividad+'_id').size())
    {
      openmodal(true);
      buscar_ordenprod(0,'mi');
      buscar_ordenprod(0);
      buscar_artiproduccion(0);
      $('#buscarmodal').attr({'caso':caso,'idposicionactividad':idposicionactividad,'idposicion':idposicion});
    }
    else
    {
      save_misactisinprod(temp);
    }
  }
});

function save_misactisinprod(temp)
{  
  $.ajax({
    url: $('base').attr('href') + 'misactividades/save_misactividades',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        window.location.href = $('base').attr('href') + $('#allactiv').attr('url');
      }
      else
      {
        $('#allactiv').html(response.data);
      }                    
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('click', '.horario2', function (e)
{
  var idposicionactividad = parseInt($(this).attr('posiacti'));
  var iddet = parseInt($(this).attr('iddet'));
  var idmis = parseInt($(this).attr('idmis'));
  var caso = parseInt($(this).attr('case'));
  var idposicion = parseInt($('#id_posicion').val());
  
  var temp = 'id_posicionactividad='+idposicionactividad+'&iddet='+iddet+'&case='+caso+'&id_misactividades='+idmis+'&id_posicion='+idposicion;

  if(idposicion>0 && idposicionactividad>0)
  {
    if($('#'+idposicionactividad+'_id').size())
    {
      openmodal(true);
      buscar_ordenprod(0);
      buscar_artiproduccion(0);
      $('#buscarmodal').attr({'caso':caso,'idposicionactividad':idposicionactividad,'idposicion':idposicion,'iddet':iddet});
    }
    else
    {
      save_misactisinprod(temp);
    }
  }
});

$(document).on('click', '.save', function (e)
{
  var caso = parseInt($(this).attr('case'));
 
  if(caso>0)
  {
    var i = 0;
    var vau = "";
    var ids =  new Array();
    var valor = parseInt($('select#cbx').val());

    if(valor>0)
    {
      $('#idposicionactividad').attr({'caso':caso});
      var dirc = ($('#'+valor+'_id').size()) ? ("") : ("e");
      var idmis = $('#allactiv').attr('idacti'); //alert('&id_misactividades='+idmis+'&case='+caso+' --'+dirc)
      save_actividad('&id_misactividades='+idmis+'&case='+caso, dirc);
    }
    else
    {
      alerta('Seleccionar Actividad');
    }
  }

});

$(document).on('click', '#buscar_arti a.saveorden', function (e) {
  var padre = $(this).parents('tr');
  var idartsucursal = padre.attr('idartsucursal');
  var id_umb = padre.attr('idumb');
  var tipo = padre.attr('tipo');
  var cantp = padre.attr('cantprod');

  var caso = $('div#buscarmodal').attr('caso');
  var idposicion = $('div#buscarmodal').attr('idposicion');
  var idposicionactividad = $('div#buscarmodal').attr('idposicionactividad');  
  var idmis = $('#allactiv').attr('idacti');

  var temp = 'id_art='+idartsucursal+'&tipo='+tipo+'&id_umb='+id_umb+'&cantidad='+cantp+'&id_posicionactividad='+idposicionactividad+'&id_posicion='+idposicion+'&case='+caso+'&id_misactividades='+idmis;
  openmodal(false);
  crear_ordenproduccion(temp, tipo);
});

function crear_ordenproduccion(temp, tipo)
{
  var url = "";
  var txt = (tipo==1) ? ("el Lote") : ("Cantidad");
  $.ajax({
    url: $('base').attr('href') + 'ordenenproduccion/crear_ordenproduccion',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        window.location.href = $('base').attr('href') + $('#allactiv').attr('url');          
      }                    
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

function crear_ordenproducciones(temp, tipo, descrip, unidadm)
{
  var url = "";
  var txt = (tipo==1) ? ("el Lote") : ("Cantidad");
  swal({
    title: 'OP '+descrip,
    text: unidadm+' '+txt,
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    showLoaderOnConfirm: true,
    cancelButtonText: 'Cancelar',
    preConfirm: function (cati) {
      return new Promise(function (resolve, reject) {
        setTimeout(function() {
          if (parseFloat(cati)>0) {
            resolve()
          } else {
            reject('Ingresar un # Mayor a 0.')
          }
        }, 2000)          
      })
    },
    allowOutsideClick: false
  }).then(function (cati) {
    $.ajax({
      url: $('base').attr('href') + 'ordenenproduccion/crear_ordenproduccion',
      type: 'POST',
      data: temp+'&cantidad='+cati,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          direccionar(response.data.url);          
        }                    
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }, function (dismiss) {
    if (dismiss === 'cancel') {
      swal(
        'Cancelado',
        "No se Guardo "+txt,
        'error'
      )
      //openmodal(true);
    }
  });
}

function direccionar(url)
{
  swal({
    title: 'Ha Finalizado',
    text: 'La Producción',
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'SI',
    cancelButtonText: 'NO',
    allowOutsideClick: false,
  }).then(function() { //alert($('base').attr('href') + url);
    alerta('Esta Direccionado','Mi Producción','info');
    window.location.href = $('base').attr('href') + url;
  }, function (dismiss) {
    if (dismiss === 'cancel') {
      window.location.href = $('base').attr('href') + $('#allactiv').attr('url');
    }
  });
}

$(document).on('click', 'a.add_op', function (e) {
  var padre = $(this).parents('tr');
  var iddocu = padre.attr('idordendeproduccion');
  var caso = $('div#buscarmodal').attr('caso');
  var idposicionactividad = $('div#buscarmodal').attr('idposicionactividad');
  var idtipomov = padre.attr('idtipomov');
  var idmis = $('#allactiv').attr('idacti');
  var tipo = padre.attr('tipo');
  var idarti = padre.attr('idartsucursal');
  var iddet = $('div#buscarmodal').attr('iddet');
  var temp = '&id_posicionactividad='+idposicionactividad+'&id_art_sucursal='+idarti+'&id_misactividades='+idmis+'&case='+caso+'&id_tipomovimiento='+idtipomov+'&id_ordendeproduccion='+iddocu+'&tipo='+tipo+'&estado=4&iddet='+iddet;

  var oprod = padre.find('.oprod').html();
  swal({
    title: 'Esta Seguro de Agregar',
    text: "Esta Orden de Producción: "+oprod,
    type: 'question',
    showCancelButton: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'SI',
    cancelButtonText: 'NO',
    confirmButtonClass: 'btn btn-primary',
    cancelButtonClass: 'btn btn-danger',
    buttonsStyling: false,
    allowOutsideClick: false
  }).then(function () {
    save_misactisinprod(temp);
  }, function (dismiss) {
    if (dismiss === 'cancel') {
      alerta('Cancelado', "Esta Orden de Producción: "+oprod,'error');
      openmodal(false);
    }
  });
});

function save_actividad(temp, e = '')
{
  $.ajax({
    url: $('base').attr('href') + 'misactividades/save_misactividades',
    type: 'POST',
    data: $('#form_horario').serialize()+temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        if(e=="")
        {
          //alert(response.data.url);
          direccionar(response.data.url);
        }
        else
        {
          //alert('aki')
          window.location.href = $('base').attr('href') + $('#allactiv').attr('url');
        }        
      }                   
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

/*$(document).on('change', 'select#cbx', function (e)
{
  var id = parseInt($(this).val()); //alert(id);
  $('#pausaracti').addClass("hidden");
  if(id>0)
  {
    if($('#'+id+'_id').size()>0)
    {
      $('#pausaracti').removeClass("hidden");
    }
  }
});*/
$(document).on('click', '#pagina_data_buscarmi li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_ordenprod(page,'mi');
});

$(document).on('click', '#pagina_data_buscarmi a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_ordenprod(page,'mi');
});

$(document).on('click', '#buscar_ordenmi a.buscar', function (e) {  
  buscar_ordenprod(0,'mi');
});

$(document).on('click', '#buscar_ordenmi a.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  buscar_ordenprod(0,'mi');
});



$(document).on('click', '#pagina_data_buscar li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_ordenprod(page);
});

$(document).on('click', '#pagina_data_buscar a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_ordenprod(page);
});

$(document).on('click', '#buscar_orden a.buscar', function (e) {  
  buscar_ordenprod(0);
});

$(document).on('click', '#buscar_orden a.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  buscar_ordenprod(0);
});

function buscar_ordenprod(page,mi="")
{
  var codigo_busc = $('#codigo_busc').val();
  var descripcion_busc = $('#descripcion_busc').val();
  
  var temp = "page="+page+'&id_tipomovimiento='+$('#id_tipomovimiento').val();

  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc; //console.log(codigo_busc);
  }
  if(descripcion_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descripcion_busc; //console.log(descripcion_busc);
  }
  if(mi.trim().length)
  {
    temp=temp+'&idpersonal=1'; //console.log(descripcion_busc);
  }
  
  var contr = $('#controller').val();
  $.ajax({
    url: $('base').attr('href') + 'ordendeproduccionop/buscar_ordenprod',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#buscar_orden'+mi+' tbody').html(response.data.rta);
        $('#pagina_data_buscar'+mi).html(response.data.paginacion);
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
  
  /*$.ajax({
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
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });*/   
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

$(document).on('change', '#cbx_op', function (e) {
  var iddoc = $(this).val();
  var op = "";
  var ca = "0.00";

  if(iddoc.trim().length)
  {
    var myarr = iddoc.split("~");
    op = "OP_"+myarr[0];
    ca = parseFloat(myarr[1]);
    ca = (ca>0) ? (ca.toFixed(2)) : (ca);
  }

  $(this).parents('tr').find('td.op').html(op);
  $(this).parents('tr').find('td.cant_prod').html(ca);
});

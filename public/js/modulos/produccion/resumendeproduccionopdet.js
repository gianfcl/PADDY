$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "");

  $('#buscarfech').validate({
    rules:
    {
      fecha_inicio:{ formespn: true }
    },
    messages: 
    {
      fecha_inicio:{ date: "Fecha Invalida" }
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
      var fechi = $('#fecha_inicio').val();
      var tittle = fechi;

      if(fechi.trim().length)
      {
        var div = "divsemanas";
         
        var temp = "fechai="+datetoing(fechi);
        var fechf = $('#fecha_fin').val();

        var num = parseInt($('#'+div).attr('canti'));

        if(fechf.trim().length)
        {
          temp = temp+"&fechaf="+datetoing(fechf);
          tittle = tittle+' '.fechf;          
        }

        $('#'+div+'_'+num).attr({'dia2':fechf});
        $('#'+div+'_'+num).attr({'dia1':fechi});
        
        var idart = parseInt($('#'+div).attr('idart'));
        idart = idart>0 ? idart : 0;
        if(idart>0)
        {
          temp = temp+"&id_art_sucursal="+idart;
        }
        var idtipomov = parseInt($('#'+div).attr('idtipomov'));
        idtipomov = idtipomov>0 ? idtipomov : 0;
        if(idtipomov>0)
        {
          temp = temp+"&id_tipomovimiento="+idtipomov;
          tittle = idtipomov == 4 ? tittle+" - "+"Receta" : temp+" - "+"Sub Producto";
        }

        var fechakardex = $('#'+div).attr('fechakardex');
        if(fechakardex.trim().length)
        {
          temp = temp+"&fech_crea="+fechakardex;
          tittle = tittle+' - '+fechakardex;
        }
        
        if(num>0)
        {
          $('#'+div+'_'+num).attr({'dia':temp}); //alert(div+' - '+num)
          $('#'+div+'_'+num).attr({'title':tittle});
          cambiacolor(div, num);
        }
        temp = temp+'&page=0';

        buscar_resumen(temp);
        $('#buscarfechas').modal('hide');
      }    
    }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#datetimepicker7').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"), 
    useCurrent: false //Important! See issue #1075
  });

  $("#datetimepicker6").on("dp.change", function (e) {
    $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
  });

  $("#datetimepicker6").on("dp.show", function (e) {
    $('#datetimepicker7 input').prop( "disabled", false );
  });
  

  $("#datetimepicker7").on("dp.change", function (e) {
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
  });

});

$(document).on('focusout', '#datetimepicker6 input', function (e) {
  var fechi = $(this).val();
  if(fechi.trim().length) {}
  else { $('#datetimepicker7 input').prop( "disabled", true );}
});

$(document).on('click', 'li.paginate_button', function (e) {  
  var temp = "page="+$(this).find('a').attr('tabindex');
  var div = "divsemanas";

  var idart = $('#divsemanas').attr('idart');
  idart = idart>0 ? idart : 0;    
  if(idart>0)
  {
    temp = temp+"&id_art_sucursal="+idart;
  }

  var idtipomov = parseInt($('#divsemanas').attr('idtipomov'));
  idtipomov = idtipomov>0 ? idtipomov : 0;
  if(idtipomov>0)
  {
    temp = temp+"&id_tipomovimiento="+idtipomov;
  }

  var fech = $('div#'+div+' button.btn-primary').attr('dia');
  var id = $('div#'+div+' button.btn-primary').attr('id');
  var num = parseInt($('div#'+div).attr('canti'));

  colum = "semanas=";
  var ky = parseInt($('div#'+div+' button.btn-primary').attr('ky'));
  var fechakardex = $('#'+div).attr('fechakardex');
  temp = temp+'&fechakardex='+fechakardex;

  if(fech.trim().length)
  {
    if(ky == 4)
    {
      colum = fech;
      fech = '';
    }
    buscar_resumen(temp+"&"+colum+fech);
    limp_todo('buscarfechas');
    var num = parseInt($('#'+id).attr('canti'));
    if(num>0)
    $('#'+id+'_'+num).attr({'title':''})
  }  
});

$(document).on('click', 'a.paginate_button', function (e) {  
  var temp = 'page='+$(this).attr('tabindex');
  var div = "divsemanas";
  
  var fechakardex = $('div#'+div).attr('fechakardex');
  temp = temp+'&fechakardex='+fechakardex;

  var idart = $('div#'+div).attr('idart');
  idart = idart>0 ? idart : 0;    
  if(idart>0)
  {
    temp = temp+"&id_art_sucursal="+idart;
  }
//alert(temp)
  var idtipomov = parseInt($('div#'+div).attr('idtipomov'));
  idtipomov = idtipomov>0 ? idtipomov : 0;
  if(idtipomov>0)
  {
    temp = temp+"&id_tipomovimiento="+idtipomov;
  }

  
  var id = $('div#'+div+' button.btn-primary').attr('id');
  colum = 'semanas=';
  var ky = parseInt($('div#'+div+' button.btn-primary').attr('ky'));
  var num = parseInt($('div#'+div).attr('canti'));

  if($('div#'+div+' button.btn-primary').length)
  {
    var fech = $('div#'+div+' button.btn-primary').attr('dia');
    if(fech.trim().length)
    {
      if(ky == 4)
      {
        colum = fech;
        fech = '';
      }
      buscar_resumen(temp+"&"+colum+fech);
      limp_todo('buscarfechas','');
      var num = parseInt($('#'+id).attr('canti'));
      if(num>0)
      $('#'+id+'_'+num).attr({'title':''})
    }
  }
});

function buscar_resumen(temp)
{
  var pag = "data";
  var tb = "datatable-buttons";
  $('#graph_line').html('');
  $('.tituh3').addClass('collpase');
  $('#graph_line').html('');
  $('#graph_barra').html('');
  $.ajax({
    url: $('base').attr('href') + 'resumendeproduccionop/buscar_semanas',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
        tb = "buscar_artix";
        pag = "arti";
        
        $('h3.tituh3').removeClass('collpase');
        $('#rangfechas').html(response.data.rangfechas);
        creargrafica(response.data.graf);
        creargraficabarra(response.data.nuegra);
        $('#'+tb+' tbody').html(response.data.rta);
        $('#paginacion_'+pag).html(response.data.paginacion);
      }
    },
    complete: function(response) { $.LoadingOverlay("hide"); }
  });
}
function mes(a) {
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
return month[a];
}

function creargrafica(info)
{
  
  new Morris.Line({
    element: 'graph_line',
    data: info,
    xkey: ['date'],
    ykeys: ['costo'],
    xLabels:'date',
    labels: ['Costo'],
    xLabelFormat: function(d) { var IndexToMonth = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]; return d.getDate()+' '+IndexToMonth[ d.getMonth() ]; },
    lineColors: ['#26B99A'],
    lineWidth: 2,
    resize: true
  });
}

function creargraficabarra(info)
{
  var barra = new Morris.Bar({
      element: 'graph_barra',
      data: info,
      xkey: 'op',
      ykeys: ['csmat','csact'],
      xLabels:'OP',
      labels: ['CMOD Unitario','CMD Unitario'],
      hideHover: 'auto',
      resize: true,
      stacked:true
    });
}

  

$(document).on('click', '.limpiarform', function (e) {
  lip_busqueda('form_busc_kardex');
});

function cambiacolor(id,ky)
{
  $('div#'+id+' button').removeClass('btn-primary');
  $('div#'+id+' button').removeClass('btn-default');
  $('div#'+id+' button').addClass('btn-default');
  var z = parseInt(ky);
  z = (z>0 ) ? (z) : (0);
  if(z>0)
  {
    $('#'+id+'_'+ky).removeClass('btn-default');
    $('#'+id+'_'+ky).addClass('btn-primary');
  }
    
}

$(document).on('click', 'button.busc', function (e) {
  var id = $(this).parents('div.col-md-6').attr('id');
  var ky = $(this).attr('ky'); 

  cambiacolor(id,ky);
  var temp = "page=0";
  var fech = $(this).attr('dia');
  
  var colum = "fechai";

  colum = "semanas";
  var fechakardex = $('#divsemanas').attr('fechakardex');
  temp = temp+'&fechakardex='+fechakardex;

  var idart = $('#divsemanas').attr('idart');
  idart = idart>0 ? idart : 0;    
  if(idart>0)
  {
    temp = temp+"&id_art_sucursal="+idart;
  }

  var idtipomov = parseInt($('#divsemanas').attr('idtipomov'));
  idtipomov = idtipomov>0 ? idtipomov : 0;
  if(idtipomov>0)
  {
    temp = temp+"&id_tipomovimiento="+idtipomov;
  }

  if(fech.trim().length)
  {
    buscar_resumen(temp+"&"+colum+'='+fech, id);
    //limp_todo('buscarfechas');
    var num = parseInt($('#'+id).attr('canti'));
    if(num>0)
    $('#'+id+'_'+num).attr({'title':''})
  }
});

$(document).on('click', 'button.muestr', function (e) {
  var id = $(this).parents('div.col-md-6').attr('id');
  $('#tipobusq').val(id);
  var fechi = $(this).attr('dia1');
  var fechf = $(this).attr('dia2');
  $('#fecha_inicio').val(fechi);
  $('#fecha_fin').val(fechf);
});

$(document).on('click', 'button.ocultamodal', function (e) {
  $('#buscarart button.close').click();
  /*$('#fecha_inicio').val('');
  $('#fecha_fin').val('');*/
});

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
    url: $('base').attr('href') + 'ordenenproduccion/buscar_artiproducciongenera',
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

$(document).on('click', '#buscar_arti a.saveorden', function (e) {
  var padre = $(this).parents('tr');
  var id_art = padre.attr('idartsucursal');
  var tipo = parseInt(padre.attr('tipo'));
  var desc = padre.find('td.descrip').html();
  var tip = $('#divsemanas');
  tipo = tipo==1 ? 4 : 13;

  tip.attr({'idart':id_art});
  tip.attr({'idtipomov':tipo});
  $('.x_title .col-md-6 h3 small').html(desc);
    
  if($('#divsemanas button.btn-primary').length)
  {
    var temp = 'page=0';
    var div = "divsemanas";
    
    var fechakardex = $('div#'+div).attr('fechakardex');
    temp = temp+'&fechakardex='+fechakardex;

    var idart = $('div#'+div).attr('idart');
    idart = idart>0 ? idart : 0;    
    if(idart>0)
    {
      temp = temp+"&id_art_sucursal="+idart;
    }
  //alert(temp)
    var idtipomov = parseInt($('div#'+div).attr('idtipomov'));
    idtipomov = idtipomov>0 ? idtipomov : 0;
    if(idtipomov>0)
    {
      temp = temp+"&id_tipomovimiento="+idtipomov;
    }

    var fech = $('div#'+div+' button.btn-primary').attr('dia'); //alert(fech)
    var id = $('div#'+div+' button.btn-primary').attr('id');
    colum = 'semanas=';
    var ky = parseInt($('div#'+div+' button.btn-primary').attr('ky'));
    var num = parseInt($('div#'+div).attr('canti'));

    
    if(fech.trim().length)
    {
      if(ky == 4)
      {
        colum = fech;
        fech = '';
      }
      buscar_resumen(temp+"&"+colum+fech);
      //limp_todo('buscarfechas','');
      var num = parseInt($('#'+id).attr('canti'));
      if(num>0)
      $('#'+id+'_'+num).attr({'title':''})
    }
  }

  $('#buscarart').modal('hide');
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

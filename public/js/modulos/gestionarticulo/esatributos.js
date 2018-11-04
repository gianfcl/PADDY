$( document ).ready(function() {
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });
});

/*Es atributos*/
$(document).on('change', '#esatributos', function (e) {
  var es_atributos = ($(this).is(':checked')) ? ("1"): ("0");
  var id_art_sucursal = $('#id_art_sucursal').val();
  if(es_atributos==1)
  {
    $('#div_es_atributos').removeClass('collapse');
  }
  else
  {
    $('#div_es_atributos').addClass('collapse');
  }
});

$(document).on('click', '.addatrib', function (e)
{
  e.preventDefault();
  var tis = $(this);
  var tabla = (tis.parents('table').attr('id'));
  var idpadre = 0;
  var ids = "";
  var idpadre2 = 0;

  if(tabla == 'tb_atributo')
  {
    idpadre = parseInt(tis.parents('tr').attr('idarticulosucuatributos'));
  }
  else
  {
    idpadre = parseInt($('table#'+tabla).attr('idpadre'));
    var idpadre2 = parseInt($('table#'+tabla).attr('idpadre2'));
    tabla = 'tb_atributo_'+idpadre2;
  }

  $('table#buscar_atrib').attr({'idpadre':idpadre,'idpadre2':idpadre2});
  buscar_atributoscartas(tabla,0);
      
});

function get_joinids(tb)
{
  var ids =  new Array();
  var i = 0;
  var or = (tb=="tb_atributo") ? (1) : ("");
  var idbody = "_trib";
  idbody = (tb=="tb_atributo") ? ("a"+idbody) : ("sub"+idbody);

  $('#'+tb+' tbody.'+idbody+' tr.ordenes'+or).each(function (index, value){
    ids[i] = $(this).attr('idatributo');
    i++;
  });
  return ids.join(',');
}

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  var idpadre = parseInt($('table#buscar_atrib').attr('idpadre2'));
  var tabla = (idpadre>0) ? ('tb_atributo_'+idpadre) : ('tb_atributo');
  buscar_atributoscartas(tabla,page);
});

$(document).on('click', '#paginacion_data a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  var idpadre = parseInt($('table#buscar_atrib').attr('idpadre2'));
  var tabla = (idpadre>0) ? ('tb_atributo_'+idpadre) : ('tb_atributo');
  buscar_atributoscartas(tabla,page);
});

$(document).on('click', '#buscar_atrib a.buscar', function (e) {
  var idpadre = parseInt($('table#buscar_atrib').attr('idpadre2'));
  var tabla = (idpadre>0) ? ('tb_atributo_'+idpadre) : ('tb_atributo');
  buscar_atributoscartas(tabla,0);
});

$(document).on('click', '#buscar_atrib a.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  var idpadre = parseInt($('table#buscar_atrib').attr('idpadre2'));
  var tabla = (idpadre>0) ? ('tb_atributo_'+idpadre) : ('tb_atributo');
  buscar_atributoscartas(tabla,0);
});

function buscar_atributoscartas(tb, page)
{
  var ids = get_joinids(tb);
  var idpadre = parseInt($('table#buscar_atrib').attr('idpadre')); //alert(idpadre)
  var temp = "page="+page+'&ids='+ids+'&idpadre='+idpadre+'&estado=1';

  var atributo_busc = $('#atributo_busc').val();
  var abrev = $('#abrev').val();

  if(atributo_busc.trim().length)
  {
    temp=temp+'&atributo_busc='+atributo_busc;
  }

  if(abrev.trim().length)
  {
    temp=temp+'&abrev='+abrev;
  }

  $.ajax({
    url: $('base').attr('href') + 'atributoscarta/buscar_atributoscartas',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('table#buscar_atrib tbody').html(response.data.rta);
        $('div#paginacion_data').html(response.data.paginacion);
      }
    },
    complete: function() {
      //hideLoader();
    }
  });      
}

$(document).on('click', 'table#buscar_atrib a.addatributos, .addsubatributos', function (e) {
  var idatributoscarta = parseInt($(this).parents('tr').attr('idatributoscarta'));
  var tipo = $(this).attr('tipo');
  var idpadre2 = 0;

  if(tipo == "addsubatributos")
  {
    idpadre2 = parseInt($('table#buscar_atrib').attr('idpadre2'));
  }

  var idartsucursal = parseInt($('#id_art_sucursal').val());
  var epan = $(this).parents('tr').find('td.atributoscarta').html();

  if(idatributoscarta>0 && idartsucursal>0)
  {
    //alert(idatributoscarta+' && idpadre->'+idpadre+' idsu->'+idartsucursal);
    var temp = "id_atributo="+idatributoscarta+'&id_art_sucursal_padre='+idartsucursal;
    if(idpadre2>0)
    {
      temp = temp+'&id_atributo_padre='+idpadre2;
    }
    
    swal({
      title: 'Esta Seguro de Agregar',
      text: "El atributos: "+epan,
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
      $('table#buscar_atrib tbody tr#tr_'+idatributoscarta).remove();
      num_orden('buscar_atrib');
      save_atributoss(temp,idpadre2);
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        alerta('Cancelado', "El atributos de: "+epan,'error');
      }
    });
  }
});

function save_atributoss(temp,idpadre)
{
  var idpad = parseInt(idpadre);
  var tb = (idpad>0) ? ("tb_atributo_"+idpad) : ("tb_atributo");
  var or = (tb=="tb_atributo") ? (1) : ("");
  var idbody = "_trib";
  idbody = (tb=="tb_atributo") ? ("a"+idbody) : ("sub"+idbody);
  var orden = parseInt($('table#'+tb+' tbody.'+idbody+' tr.ordenes'+or).length);
  $.ajax({
    url: $('base').attr('href') + 'articuloxsucursal/save_atributos',
    type: 'POST',
    data: temp+'&orden='+orden,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        if(orden>0)
        {
          $('table#'+tb+' tbody.'+idbody).append(response.data);
        }
        else
        {
          $('table#'+tb+' tbody.'+idbody).html(response.data);
        }
      }                    
    },
    complete: function() {
    }
  });

}

function num_orden(tb)
{
  var i = 0;
  var or = (tb=="tb_atributo") ? (1) : ("");
  var num = parseInt($('table#'+tb+' tbody tr.ordenes'+or+' td.orden').length);
  if(num>0)
  {
    $('table#'+tb+' tbody tr.ordenes'+or+' td.orden').each(function (index, value){
      i++;
      $(this).html(i);
    });
  }
  else
  {
    num = parseInt($('table#'+tb+' thead tr td').length);
    $('table#'+tb+' tbody').html("<tr><td colspan='"+num+"'><h2 class='text-center text-success'>No se hay registro</h2></td></tr>");
  }    
}

$(document).on('click', '.delete_atrib', function (e)
{
  e.preventDefault();
  var idarticulosucuatributos = parseInt($(this).parents('tr').attr('idarticulosucuatributos'));
  var atributos = $(this).parents('tr').find('td.atributos').html();
  var tabla = ($(this).parents('table').attr('id'));
  //alert('table#'+tabla+' tbody tr_'+idarticulosucuatributos)
  if(idarticulosucuatributos>0)
  {
    var temp = "id_articulo_sucu_atributos="+idarticulosucuatributos;
    swal({
      title: 'Estad Seguro?',
      text: "Eliminar este atributos "+atributos,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
      if (isConfirm) {     
        $.ajax({
          url: $('base').attr('href') + 'articuloxsucursal/delete_atributos',
          type: 'POST',
          data: temp,
          dataType: "json",
          beforeSend: function() {
            //showLoader();
          },
          success: function(response) {
            if (response.code==1) {
              $('table#'+tabla+' tbody tr#tr_'+idarticulosucuatributos).remove();
              num_orden(tabla);
            }                    
          },
          complete: function() {
          }
        });
      }
    });          
  }
});

function editar_atributo(temp = '')
{
  if(temp != '')
  {
    $.ajax({
      url: $('base').attr('href') + 'articuloxsucursal/editar_atributo',
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
}

$(document).on('change', '.es_obligatorio', function (e) {
  var tis = $(this);
  var es_obligatorio = (tis.is(':checked')) ? ("1"): ("0");
  var id = parseInt(tis.parents('tr').attr('idarticulosucuatributos'));
  var idart = parseInt($('#id_art_sucursal').val());
  var temp = "id_articulo_sucu_atributos="+id+'&es_obligatorio='+es_obligatorio+'&id_art_sucursal_padre='+idart;
  var tb = (tis.parents('table').attr('id'));

  if(id>0 && idart>0)
  {
    $('table#'+tb+' tbody.a_trib tr.ordenes1 td.obligatorio input').each(function (index, value){
      $(this).prop('checked', false);
    });
    
    es_obligatorio = parseInt(es_obligatorio);
    var val = (es_obligatorio>0) ? (true) : (false);
    $('table#'+tb+' tbody.a_trib tr#tr_'+id+' td.obligatorio input').prop('checked', val);
    editar_atributo(temp);
  }
});

$(document).on('change', '.por_defecto', function (e) {
  var tis = $(this);
  var por_defecto = (tis.is(':checked')) ? ("1"): ("0");
  var id = parseInt(tis.parents('tr').attr('idarticulosucuatributos'));
  var idpadre2 = parseInt(tis.parents('table').attr('idpadre2'));
  var temp = "id_articulo_sucu_atributos="+id+'&por_defecto='+por_defecto+'&id_atributo_padre='+idpadre2;
  var tb = (tis.parents('table').attr('id'));
  if(id>0)
  {
    $('table#'+tb+' tbody.sub_trib tr.ordenes td.defecto input').each(function (index, value){
      $(this).prop('checked', false);
    });

    por_defecto = parseInt(por_defecto);
    var val = (por_defecto>0) ? (true) : (false);
    $('table#'+tb+' tbody.sub_trib tr#tr_'+id+' td.defecto input').prop('checked', val);
    editar_atributo(temp);
  }
});
/*Validar Al Salir del Formulario*/
function validar_tabs(tipo)
{
    var esatributos = ($('#esatributos').is(':checked')) ? ("1"): ("0");
    var valor = true;
    var cantpro = parseInt($('table#tb_atributo tbody.a_trib tr td.orden1').length);
    //console.log(tipo+' esatributos->'+esatributos+' cantpro->'+cantpro+' valor->'+valor);
    if(esatributos== "1")
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
    var para_ventas_val = $('#para_atributos_val').val(); 
    var esatributos = ($('#esatributos').is(':checked')) ? ("1"): ("0");
    if(esatributos==1)
    {
      var cantpro = parseInt($('div#div_es_atributos table tbody tr td.orden').length);
      if(cantpro == 0)
      {
          esatributos = 0;
      }
    }

    $.ajax({
      url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
      type: 'POST',
      data: 'id_art_sucursal='+id_art_sucursal+'&es_atributos='+esatributos,
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
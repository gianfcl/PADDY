$( document ).ready(function() {
  $('#fechadocu_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
    }, 
    function(start, end, label) {}
  );

  $('#fechacreado_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
    }, 
    function(start, end, label) {}
  );

  $( "#descripcion" ).autocomplete({
    params:{'id_almacen': function() { return $('#id_almacen').val(); }},
    serviceUrl: $('base').attr('href')+"articuloxsucursal/search_articulo2",
    type:'POST',
    onSelect: function (suggestion) {          
      //$('#descripcion').val(suggestion.descripcion);
      $('#id_art_sucursal').val(suggestion.id_art_sucursal);
      limpcbx();
    }
  });

});

function limpcbx()
{
  $('.row .col-xs-12 .control-group select.form-control').val('');
}

$(document).on('change', '#id_zona', function (e) {
  var id_zona = parseInt($(this).val());
  id_zona = (id_zona>0) ? (id_zona) : (0);
  $("#id_area").html("<option value=''>Seleccione Área</option>");
  $("#id_ubicacion").html("<option value=''>Seleccione Ubicación</option>");
  if(id_zona>0)
  {
    
    $.ajax({
      url: $('base').attr('href') + 'area/cbox_area',
      type: 'POST',
      data: 'id_zona='+id_zona,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $("#id_area").html(response.data);
          }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }    
});

$(document).on('change', '#id_area', function (e) {
  var id_area = parseInt($(this).val());
  $("#id_ubicacion").html("<option value=''>Seleccione Ubicación</option>");
  if(id_area>0)
  {
    
    $.ajax({
      url: $('base').attr('href') + 'ubicacion/cbox_ubi',
      type: 'POST',
      data: 'id_area='+id_area,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $("#id_ubicacion").html(response.data);
          }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }    
});

$(document).on('change', '#id_ubicacion', function(e) {
  var id_ub = parseInt($(this).val());
  if(id_ub>0) 
  {
    
  }
});

$(document).on('change', '#id_grupo', function (e) {
  var id_grupo = parseInt($(this).val());
  $("#id_familia").html("<option value=''>Seleccione Familia</option>");
  $("#id_subfamilia").html("<option value=''>Seleccione SubFamilia</option>");
  if(id_grupo>0)
  {
    
    $.ajax({
      url: $('base').attr('href') + 'familia/cbx_familia',
      type: 'POST',
      data: 'id_grupo='+id_grupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $("#id_familia").html(response.data);
          }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
    
});

$(document).on('change', '#id_familia', function(e) {
  var id_fa = parseInt($(this).val());
  $("#id_subfamilia").html("<option value=''>Seleccione SubFamilia</option>");
  if(id_fa>0) 
  {    
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_familia='+id_fa,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $("#id_subfamilia").html(response.data);
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#almacen_busc').val('');
  $('#almacen_busc').selectpicker('refresh');
  $('#fechaactual').prop('checked',false);
  buscarbandeja(0);
});

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscarbandeja(page);
});

$(document).on('click', '#paginacion_data a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscarbandeja(page);
});

$(document).on('click', '#datatable-buttons .buscarbandeja', function (e) {
  var page = 0;
  buscarbandeja(0);
});

$(document).on('change', '#fechaactual', function (e) {
  var estado = ($(this).is(':checked')) ? (1): (0);
  var fec  = (estado==1) ? ($(this).attr('date')) : ("");
  $('#fechadocu_busc').val(fec);
});

function buscarbandeja(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var fecha_busc = $('#fechadocu_busc').val();
  var titulo_busc = $('#titulo_busc').val();
  var usuario_creado = $('#usu_creado').val();
  var usuario_operario = $('#usu_planificado').val();
  var fecha_creado = $('#fechacreado_busc').val();
  var id_almacen = $('#almacen_busc').val();
  var temp = "page="+page;

  if($('#idestados').length)
  {
    var idform = ifrome();
    console.log(idform);
    if(idform != "-")
    {
      temp=temp+'&idestados='+idform;
    }
  }

  if($('#usercrado').length)
  {
    var usu = ($('#usercrado').is(':checked')) ? (1): (0);
    if(usu==1)
    {
      temp=temp+'&id_operario=1';
    }
  }

  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(titulo_busc.trim().length)
  {
    temp=temp+'&titulo_busc='+titulo_busc;
  }
  if(fecha_busc.trim().length)
  {
    var fe_in = datetoing(fecha_busc);
    temp=temp+'&fecha_ingreso='+fe_in;
  }
  if(usuario_operario.trim().length)
  {
    temp=temp+'&usu_planificado='+usuario_operario;
  }
  if(usuario_creado.trim().length)
  {
    temp=temp+'&usu_creado='+usuario_creado;
  }
  if(fecha_creado.trim().length)
  {
    var fe_in = datetoing(fecha_creado);
    temp=temp+'&fecha_creado='+fe_in;
  }
  if(id_almacen)
  {
    temp=temp+'&id_almacen='+id_almacen;
  }
  var urx = $('#url_modulo').val();
  $.ajax({
    url: $('base').attr('href') + urx+'/buscar_documentos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
        //var urx = $('#linkmodulo').attr('url');
        //abrirnmodal(false,'editalmacen');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide"); 
    }
  });
}


$(document).on('click', '.buscar', function (e) {
  buscar();
});

function limpiando()
{
  $('#id_tomainventfisico').val('');
  $('#txt_titulo').val('');
  $('#id_operario').val('');

  $('#id_zona').val('');
  $('#id_area').html('');
  $('#id_ubicacion').html('');

  $('#id_grupo').val('');
  $('#id_familia').html('');
  $('#id_subfamilia').html('');

  $('#id_art_sucursal').val('');
  $('#descripcion').val('');

  $('#id_frecu').val('');

  $('#id_almacen').val('');
  $("div#tab_content1 input[type=checkbox]").prop('checked', false);
  //$("div#tab_content2 div.bootstrap-tagsinput").html("");
}

$(document).on('click', '.opentoma', function (e) {
  limpiando();
  $('#id_almacen').val($(this).attr('idalm'));
  $('#id_almacen_select').val($(this).attr('idalm'));
  abrirnmodal(true,'edittomainventfisico');
  //buscar_articulos(0);
});

$(document).on('click', '.btn_eliminar', function (e) {
  var estado = 6;
  var id = parseInt($(this).parents('tr').attr('iddocumento')); //alert(id)
  id = (id>0) ? (id) : (0);
  if(id>0)
  {
    var temp = "id_tomainventfisico="+id+'&estado='+estado;
    swal({
      title: 'Anular',
      text: "¿Esta Seguro de Anular?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then(function(isConfirm) {
      if (isConfirm === true) {
        $.ajax({
          url: $('base').attr('href') + 'tomainventfisico/delete',
          type: 'POST',
          data: temp,
          dataType: "json",
          beforeSend: function(response) {
            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) {
              buscarbandeja(0);              
            }                   
          },
          complete: function(response) {
            $.LoadingOverlay("hide");
          }
        });
      } else if (isConfirm === false) {
        
      } else {
        // Esc, close button or outside click
        // isConfirm is undefined
      }
    })
  }
});

$(document).on('click', '#buscar_arti .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  var page = 0;

  buscar_articulos(page);
});

$(document).on('click', '.add_articulos', function (e) {
  var page = 0;
  var padre = $(this).parents('tr');
  var id = parseInt(padre.attr('idarticulo'));
  id = (id>0) ? (id) : (0);
  if(id>0)
  {
    var i = parseInt($('div#tab_content2 div.bootstrap-tagsinput span.tag').length)+1;
    var clas = "primary";
    clas = (i%2 == 1) ? ('success') : (clas);
    var desc = padre.find('td.desc').html();
    var html = "<span class='tag label label-"+clas+"' id='"+id+"'>"+desc+"<span data-role='remove' class='delarti'></span>";
    $('div#tab_content2 div.bootstrap-tagsinput').append(html);
    remover_arti(id);
  }
});

$(document).on('click', '#pagina_data_buscar li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscarbandeja(page);
});

$(document).on('click', '#pagina_data_buscar a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_articulos(page);
});

$(document).on('click', 'table#buscar_arti a.buscarfiltro', function (e) {  
  buscar_articulos(0);
});

function buscar_articulos(page)
{
  var idalmacen = parseInt($('#id_almacen').val());
  idalmacen = (idalmacen>0) ? (idalmacen) : (0);
  if(idalmacen>0)
  {
    var codigo_busc = $('#codigo_buscx').val();
    var descripcion_busc = $('#descripcion_busc').val();
    var inid_med_base_busc = $('#inid_med_base_busc').val();

    var temp = "page="+page+'&id_almacen='+idalmacen;
    if($('div#tab_content2 div.bootstrap-tagsinput span.tag').length)
    {
      temp = temp+'&id_arti='+get_joinids();
    }
    
    if(codigo_busc.trim().length)
    {
    temp=temp+'&codigo_busc='+codigo_busc;
    }

    if(descripcion_busc.trim().length)
    {
    temp=temp+'&descripcion_busc='+descripcion_busc;
    }
    if(inid_med_base_busc.trim().length)
    {
    temp=temp+'&inid_med_base_busc='+inid_med_base_busc;
    }
    
    $.ajax({
      url: $('base').attr('href') + 'tomainventfisico/buscar_articulo',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $('#buscar_arti').LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#buscar_arti tbody').html(response.data.rta);
          $('#pagina_data_buscar').html(response.data.paginacion);
        }
      },
      complete: function() {
        $('#buscar_arti').LoadingOverlay("hide");
      }
    });
  }
    
}

$(document).on('click', 'span.delarti', function (e) {
  var id = parseInt($(this).parents('span.tag').attr('id'));
  if(id>0)
  {
    $('span#'+id).remove();
  }
});

function remover_arti(idarti)
{
  if($('#buscar_arti tbody tr#'+idarti).length)
  {
    $('#buscar_arti tr#'+idarti).remove();
    var limite = parseInt($('table#datatable-buttons').attr('limite'));
    limite = (limite>0) ? (limite) : (0);
    if($('#buscar_arti tbody tr td.orden').length) 
    {
      var page = $('div#pagina_data_buscar ul.pagination li.active a.active').attr('tabindex');
      page = (page>0) ? (page) : (0);
      var i = page*limite;
      $('table#buscar_arti tbody tr td.orden').each(function (index, value){
        i++;
        $(this).html(i);
      });
    }
    else
    {
      buscar_articulos(0);
    }
  }    
}

function get_joinids()
{
  var ids =  new Array();
  var i = 0;
  $('div#tab_content2 div.bootstrap-tagsinput span.tag').each(function (index, value){
    ids[i] = $(this).attr('id');
    i++;
  });
  return ids.join(',');
}

function save_tomainventfisico(url, temp)
{
  $.ajax({
    async: false,
    url: $('base').attr('href') + 'tomainventfisico/save_tomainventfisico',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        var urx = $('#linkmodulo').attr('url');
        var path_url = ($(location).attr('href')).split("/");
        var url_mod = path_url[4];
        if(urx == "tomainventfisico")
        {
          window.location.href = urx+''+url;
        }
        else
        { 
          console.log(url_mod);
          if(url_mod !== "tomainventfisico")
          {  
            abrirnmodal(false,'edittomainventfisico');
            limpiando();
            swal({
              title: 'Desea',
              text: "Ir al documento",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'SI',
              cancelButtonText: 'NO',
              confirmButtonClass: 'btn btn-success',
              cancelButtonClass: 'btn btn-danger',
              buttonsStyling: false
            }).then(function () {
              window.location.href = urx+''+url+'/'+response.data.id;
            }, function (dismiss) {
              // dismiss can be 'cancel', 'overlay',
              // 'close', and 'timer'
              if (dismiss === 'cancel') {
                buscarbandeja(0);
              }
            })
          }
        }
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$('.nav-tabs a').on('shown.bs.tab', function(event){
  var id_al = parseInt($('#id_almacen').val());
  var subti = $('#subti').html();;
  limpiando();
  if(id_al>0)
  {
    $('#id_almacen').val(id_al);
    $('#id_almacen').val(id_al);
    $('#subti').html(subti);
  }
});
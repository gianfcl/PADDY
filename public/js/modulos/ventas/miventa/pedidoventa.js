$( document ).ready(function() {
    $('body').removeClass('nav-md').addClass('nav-sm');
    $('.left_col').removeClass('scroll-view').removeAttr('style');
    $('.sidebar-footer').hide();

    if ($('#sidebar-menu li').hasClass('active')) {
        $('#sidebar-menu li.active').addClass('active-sm').removeClass('active');
    }
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_pedido_ventas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_pedido_ventas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_pedido_ventas(page);
});

function buscar_pedido_ventas(page)
{
  if($('ul.muestrapedido li.active').length)
  {
    var tipo = parseInt($('ul.muestrapedido li.active a').attr('tipo'));
    var ids = parseInt($('ul.muestrapedido li.active a').attr('ids'));
    var temp = 'ids='+ids+'&tipo='+tipo+"&page="+page; //alert(temp)
    $.ajax({
      url: $('base').attr('href') + 'pedidococina/buscar_pedido_ventas',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        $('#contdata').html(response.rta);
        $('#paginacion_data').html(response.paginacion);
      },
      complete: function() {
        $('.divmenu').matchHeight({
          byRow: true,
          property: 'height',
          /*target: null,*/
          remove: false
        });
        $.LoadingOverlay("hide");
      }
    });
  }
    
}

$(document).on('click', 'ul.muestrapedido li a.viewlistapedido', function (e) {
  var tipo = parseInt($(this).attr('tipo'));
  var ids = parseInt($(this).attr('ids')); 
  var id = $(this).attr('id');

  var num = id.replace("tua_", id);

  $('ul.muestrapedido li.tab').removeClass('active');
  $(this).tab('show');
  if(tipo >0 && ids >0)
  {
    //mostrartab('tua_', 'tudiv_', num);
    $(this).parents('li.tab').addClass('active in');
    buscar_pedido_ventas(0); 
  }
});

function mostrartab(tab='', cont='', num='')
{
  $('a#'+tab+num).tab('show');
  $('a#'+tab+num).parents('li').attr({'class':'active'});
  $('div#'+cont+num).addClass('active');
}

$(document).on('click', '.cambestadoa', function (e) {
  var padre = $(this);
  var idest = parseInt(padre.attr('idest')); // id_pedidosestados
  var iddet = parseInt(padre.parents('.contdetped').find('.post-header-line').attr('idpeddet'));
  var tipo = parseInt(padre.attr('tipo'));
  if(idest>0 && iddet>0 && tipo>0)
  {
    swal({
      title: 'Estas Seguro?',
      text: "De Eliminar Estadp!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => { //alert(result)
      if (result) {
        save_estados('id_pedidosestados='+idest+'&id_pedido_det='+iddet+'&tipo='+tipo+'&estado=0',padre)
        swal('Cambio!', 'con exito estado OK.', 'success');
      }
    })
  }
    
});

function save_estados(temp, padre)
{
  $.ajax({
    url: $('base').attr('href') + 'pedidococina/save_estados',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        padre.parents('.demoPadder').html(response.data.rta);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('click', '.cambestadon', function (e) {
  var padre = $(this);
  var idest = parseInt(padre.attr('idest')); // id_pedidosestados
  var iddet = parseInt(padre.parents('.demoPadder').attr('idpeddet'));
  var tipo = parseInt(padre.attr('tipo'));
  if(idest>0 && iddet>0 && tipo>0)
  {
    save_estados('id_pedidosestados='+idest+'&id_pedido_det='+iddet+'&tipo='+tipo+'&estado=0', padre)
  }
});
/*
$('ul.muestrapedido li a').on('shown.bs.tab', function(event){
  var tipo = parseInt($(this).attr('tipo'));
  var ids = parseInt($(this).attr('ids')); alert(mas)
  $('ul.muestrapedido li.tab').removeClass('active');
  if(tipo >0 && ids >0)
  {
    alert("mas")
    $(this).parents('li.tab').addClass('active');
    buscar_pedido_ventas(0); 
  }
});*/
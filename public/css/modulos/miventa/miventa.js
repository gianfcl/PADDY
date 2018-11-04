$("#modalmiventa").modal();

$(document).on('click', '.mospiso', function (e)
{
	$('#todameza').html('');
	$('#todameza').addClass('collapse');
	$('#todazona').removeClass('collapse');
});

$(document).on('click', '.mosmesa', function (e)
{
  	var id = parseInt($(this).attr('id'));
  	id = id > 0 ? id : 0;
  	if(id>0)
  	{
	    $.ajax({
	        url: $('base').attr('href') + 'miventa/infomesas',
	        type: 'POST',
	        data: 'id_zonam='+id,
	        dataType: "json",
	        beforeSend: function() {
	            //showLoader();
	        },
	        success: function(response) {
	            if (response.code==1) {
	              $('#todameza').html(response.data.mesas);
	              $('#todazona').addClass('collapse');
	              $('#todameza').removeClass('collapse');
	            }
	        },
	        complete: function() {
	        }
	    });
  	}
});

$(document).on('click', '.tusvalores', function (e)
{
  	var id = parseInt($(this).attr('idtu'));
  	var tipo = parseInt($(this).attr('tipo'));
  	id = id > 0 ? id : 0;
  	tipo = tipo > 0 ? (tipo + 1) : 0;
  	$(this).parents('.panel-body').find('a').removeClass('btn-primary');
  	$(this).parents('.panel-body').find('a').addClass('btn-default');
  	$(this).addClass('btn-primary');

  	$('h4.panel-title a').attr({'aria-expanded':'false'});
  	$('.panel-collapse').removeClass('in');
  	$('.panel-collapse').attr({'aria-expanded':'false'});
  	$('.panel-collapse').attr({'style':'height: 0px;'});

  	$('a#a_id_'+tipo).attr({'aria-expanded':'true'});
  	$('div#collapse'+tipo).addClass('in');
  	$('div#collapse'+tipo).attr({'aria-expanded':'true'});
  	$('div#collapse'+tipo).attr({'style':''});

  	if(id>0)
  	{
		for (var i = tipo; i < 5; i++) {
			$('div#cont'+i).html('');
		}

	    $.ajax({
	        url: $('base').attr('href') + 'miventa/infovalores',
	        type: 'POST',
	        data: 'id='+id+'&estipo='+tipo,
	        dataType: "json",
	        beforeSend: function() {
	            //showLoader();
	        },
	        success: function(response) {
	            if (response.code==1) {	            	
	            	$('div#cont'+tipo).html(response.data.info);
	            }
	        },
	        complete: function() {
	        }
	    });
  	}
});


var cartOpen = false;
var numberOfProducts = 0;
 
$('body').on('click', '.js-toggle-cart', toggleCart);
$('body').on('click', '.js-add-product', addProduct);
$('body').on('click', '.js-remove-product', removeProduct);

function toggleCart(e) {
  e.preventDefault();
  if(cartOpen) {
    closeCart();
    return;
  }
  openCart();
}

function openCart() {
  cartOpen = true;
  $('body').addClass('open');
}

function closeCart() {
  cartOpen = false;
  $('body').removeClass('open');
}

function addProduct(e) {
  e.preventDefault();
  openCart();
  $('.js-cart-empty').addClass('hide');
  var product = $('.js-cart-product-template').html();
  $('.js-cart-products').prepend(product);
  numberOfProducts++;
}

function removeProduct(e) {
  e.preventDefault();
  numberOfProducts--;
  $(this).closest('.js-cart-product').hide(250);
  if(numberOfProducts == 0) {
    $('.js-cart-empty').removeClass('hide');
  }
}

$(document).on('click', '.number-spinner button', function (e) 
{
	var btn = $(this);
	var val = parseInt(btn.closest('.number-spinner').find('input').val());
	val = val > 0 ? val : 0;
	var newVal = 0;
	
	if (btn.attr('data-dir') == 'up') {
		newVal = parseInt(val) + 1;
	} else {
		if (val > 1) {
			newVal = parseInt(val) - 1;
		} else {
			newVal = 1;
		}
	}
	btn.closest('.number-spinner').find('input').val(newVal);
});

$(document).on('click', '.mimesa', function (e)
{
	var mesa = $(this).html();
	var id = $(this).attr('idmesa');
	var idpedido = parseInt($(this).attr('idpedido'));
	idpedido = idpedido > 0 ? idpedido : 0;

	if(idpedido > 0)
	{
		$.ajax({
	        url: $('base').attr('href') + 'miventa/getpedido',
	        type: 'POST',
	        data: 'id_pedido='+idpedido,
	        dataType: "json",
	        beforeSend: function() {
	            //showLoader();
	        },
	        success: function(response) {
	            if (response.code==1) {
	            	$('#form_lita input.id_pedido').val(response.data.id_pedido);
	            	$('#form_lita input.id_mesam').val(response.data.id_mesam);
	            	$('#lista tbody').html(response.data.lista);
            		$('#detalle tbody').html(response.data.detalle);
            		$('table#detalle tfoot tr td.total span').html(response.data.pt);
            		$('.savelista').removeClass('disabled');
	            }
	        },
	        complete: function() {
	        }
	    });
	}
	else
	{
		$('#form_lita input.id_mesam').val(id);
		$('.cart__title small').html(mesa);
	}
		
	$('#modalmiventa').modal('hide');


});

function sumarsubtotal()
{
	var tot = 0;
	var sb = 0;
	$('table#detalle tbody tr td.subtotal').each(function (index, value){
		sb = parseFloat($(this).html());
		sb = sb > 0 ? sb :0;
		tot = tot + sb;
	});
	tot = (tot>0) ? (tot.toFixed(2)) : ('0.00');
	$('table#detalle tfoot tr td.total span').html(tot);
}

$(document).on('click', '.savecantidad', function (e)
{
	var cant = $('#form_cantidad .number-spinner input').val();
	var viene = parseInt($('#viene_cant').val());
	var nomb = $('#cant_desc').val();
	var id  = $('#cant_id_artixsuc').val();
	var pre  = $('#cant_pre').val();
	var orden = parseInt($('#cant_orde').val());
	orden = orden > 0 ? orden : 1;

	var html = "";
	var sub = cant*pre;
	sub = (sub>0) ? (sub.toFixed(2)) : ('0.00');	

	if(viene == 1)
	{
		html = '<tr orden="'+orden+'" class="tr_detalle" id="tr_'+orden+'_'+id+'">'+
					'<td class="cantidad"><span>'+cant+'</span>'+
					'</td>'+
					'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left">'+nomb+'</p></div></div>'+
					'</td>'+
					'<td class="precio"><span>'+pre+'</span>'+
					'</td>'+
					'<td class="subtotal" class="text-center subtotal">'+sub+'</td>'+
				'</tr>';
		var tu_i = $('#detalle tbody');
		var es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);
		
		html = '<tr orden="'+orden+'" class="tr_lista" id="atr_'+orden+'_'+id+'">'+
					'<td class="cantidad"><span>'+cant+'</span>'+
						'<input value="'+orden+'" name="cantidad['+orden+']['+id+']" type="hidden" class="cantidad">'+
						'<input value="0" name="id_pedido_det['+orden+']['+id+']" type="hidden" class="id_pedido_det">'+
					'</td>'+
					'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left">'+nomb+'</p></div></div>'+
						'<input value="'+id+'" name="id_art_sucursal['+orden+']['+id+']" type="hidden" class="id_art_sucursal">'+
						'<input value="'+nomb+'" name="descripcion['+orden+']['+id+']" type="hidden" class="descripcion">'+
						'<input value="" name="id_atributos['+orden+']['+id+']" type="hidden" class="idatributos">'+
						'<input value="'+pre+'" name="precio['+orden+']['+id+']" type="hidden" class="precio">'+
						'<input value="1" name="id_esatribcomb['+orden+']['+id+']" type="hidden" class="idesatribcomb">'+
					'</td>'+
					'<td class="abreviatura"><span></span>'+
					'</td>'+
					'<td class="actions"><a href="javascript:void(0);" class="btn btn-warning btn-xs editarti"><i class="fa fa-refresh"></i></a><a href="javascript:void(0);"  class="btn btn-danger btn-xs elimina"><i class="fa fa-trash-o"></i></a></td>'+
				'</tr>';
		tu_i = $('#lista tbody');
		es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);
		openCart();
		validabuttonsalista();
	}
	else
	{
		$('tr#tr_'+orden+'_'+id+' td.cantidad span').html(cant);
		$('tr#atr_'+orden+'_'+id+' td.cantidad span').html(cant);
		$('tr#atr_'+orden+'_'+id+' td.cantidad input.cantidad').html(cant);

		$('tr#tr_'+orden+'_'+id+' td.subtotal').html(sub);
	}
	
	$('#addarti').modal('hide');
	sumarsubtotal();
});

$(document).on('click', '.addarti', function (e)
{
  	$('#form_cantidad .number-spinner input').val(1);

  	$('#viene_cant').val(1);

  	var orden = 0;
  	if($('#lista tbody tr.tr_lista').length)
  	{
  		orden = parseInt($('#lista tbody tr.tr_lista:last').attr('orden'));
  		orden = orden > 0 ? orden : 0;
  		//alert(orden)
  	}
  	orden++;

  	var desc = $(this).html();
  	$('#addarti .modal-content .modal-header h4').html(desc);

  	$('#cant_id_artixsuc').val($(this).attr('idtu'));
  	$('#cant_desc').val(desc);
  	$('#cant_orde').val(orden);
  	$('#cant_pre').val($(this).attr('precio'));
});

$(document).on('click', '.editarti', function (e)
{
	$("#addarti").modal();
  	$('#viene_cant').val(2);

	var cant = parseInt($(this).parents('tr').find('td.cantidad span').html());
	var prec = parseInt($(this).parents('tr').find('td.articulo input.precio').val());
  	var orden = parseInt($(this).parents('tr').attr('orden'));
  	var desc = $(this).parents('tr').find('td.articulo p').html();
  	var id = parseInt($(this).parents('tr').find('td.articulo input.id_art_sucursal').val());

	$('#form_cantidad .number-spinner input').val(cant);
  	$('#addarti .modal-content .modal-header h4').html(desc);

  	$('#cant_id_artixsuc').val(id);
  	$('#cant_desc').val(desc);
  	$('#cant_orde').val(orden);
  	$('#cant_pre').val(prec);
});

$(document).on('click', '.addatrib', function (e)
{
	$('#viene_atrib').val(1);
	var id = $(this).attr('idtu');
	$('#form_atributos .number-spinner input').val(1);

  	var orden = 0;
  	if($('#lista tbody tr.tr_lista').length)
  	{
  		orden = parseInt($('#lista tbody tr.tr_lista:last').attr('orden'));
  		orden = orden > 0 ? orden : 0;
  	}
  	orden = orden + 1;
  	//alert(orden)
  	var desc = $(this).html();
  	$('#addatrib .modal-content .modal-header h4').html(desc);

  	$('#atrib_id_artixsuc').val(id);
  	$('#atrib_desc').val(desc);
  	$('#atrib_orde').val(orden);
  	$('#atrib_pre').val($(this).attr('precio'));

 	getatributos('id='+id)
  	
});

function getatributos(temp)
{
	$.ajax({
        url: $('base').attr('href') + 'miventa/getatributos',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {	            	
            	$('div#total_atributos').html(response.data.info);
            }
        },
        complete: function() {
        }
    });
}

$(document).on('click', '.addclasarti', function (e)
{
  	$(this).removeClass('btn-default');
  	$('.addclasarti').removeClass('btn-primary');
  	$(this).addClass('btn-primary');
});


function agregararticulo()
{
	var html = "<p class='cart__empty js-cart-empty'>Agregar Articulo</p>";
	$('#lista tbody').html(html);
  	$('#detalle tbody').html(html);
}

$(document).on('click', '.nuevopedido', function (e)
{
	closeCart();
  	$('#form_lita input.id_mesam').val('0');
  	$('#form_lita input.id_pedido').val('0');
	agregararticulo();
  	$("#modalmiventa").modal();
});

$(document).on('keypress', '.number-spinner input', function (e) {
  /*if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    return false;
  }*/
  if(e.which != 46 && (e.which < 47 || e.which > 59)) {
    return false;
  }
});

function get_joinids(div)
{
  var ids =  new Array();
  var i = 0;
  var info = '';
  if($('div#'+div+' select.combox_atributos').length)
  {
  	var tui = 0;
  	$('div#'+div+' select.combox_atributos').each(function (index, value){
  		tui = parseInt($(this).val());
  		tui = tui > 0 ? tui : 0;
	    if(tui > 0)
	    {
	      ids[i] = tui;
	      i++;
	    }      
	});
  }	  
  return ids.join(',');
}

function get_abreviatura(div)
{
  var ids =  new Array();
  var i = 0;
  var info = '';
  if($('div#'+div+' select.cbx_atributos').length)
  {
  	var tui = 0;
  	var noid = "";
  	$('div#'+div+' select.cbx_atributos').each(function (index, value){
  		tui = parseInt($(this).val());
  		noid = $(this).attr('id');
  		tui = tui > 0 ? tui : 0;
	    if(tui > 0)
	    {
	      ids[i] = $('#'+noid+' option:selected').text();
	      i++;
	    }      
	});
  }	  
  return ids.join(',');
}

$(document).on('click', '.saveatributos', function (e)
{
	var cant = $('#form_atributos .number-spinner input').val();
	var viene = parseInt($('#viene_atrib').val());
	var nomb = $('#atrib_desc').val();
	var id  = $('#atrib_id_artixsuc').val();
	var pre  = $('#atrib_pre').val();
	var orden = $('#atrib_orde').val();
	orden = orden > 0 ? orden : 1;

	var html = "";

	var sub = cant*pre;
	sub = (sub>0) ? (sub.toFixed(2)) : ('0.00');
	var idatrib = get_joinids('total_atributos');
	var abrev = get_abreviatura('total_atributos');		//alert(abrev)

	if(viene == 1)
	{
		html = '<tr orden="'+orden+'" class="tr_detalle" id="tr_'+orden+'_'+id+'">'+
					'<td class="cantidad"><span>'+cant+'</span>'+
					'</td>'+
					'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left">'+nomb+'</p></div></div>'+
					'</td>'+
					'<td class="precio"><span>'+pre+'</span>'+
					'</td>'+
					'<td class="subtotal" class="text-center subtotal">'+sub+'</td>'+
				'</tr>';
		var tu_i = $('#detalle tbody');
		var es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);

		html = '<tr orden="'+orden+'" class="tr_lista" id="atr_'+orden+'_'+id+'">'+
					'<td class="cantidad"><span>'+cant+'</span>'+
						'<input value="'+orden+'" name="cantidad['+orden+']['+id+']" type="hidden" class="cantidad">'+
						'<input value="0" name="id_pedido_det['+orden+']['+id+']" type="hidden" class="id_pedido_det">'+
					'</td>'+
					'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left">'+nomb+'</p></div></div>'+
						'<input value="'+id+'" name="id_art_sucursal['+orden+']['+id+']" type="hidden" class="id_art_sucursal">'+
						'<input value="'+nomb+'" name="descripcion['+orden+']['+id+']" type="hidden" class="descripcion">'+
						'<input value="'+idatrib+'" name="id_atributos['+orden+']['+id+']" type="hidden" class="idatributos">'+
						'<input value="'+pre+'" name="precio['+orden+']['+id+']" type="hidden" class="precio">'+
						'<input value="2" name="id_esatribcomb['+orden+']['+id+']" type="hidden" class="idesatribcomb">'+
					'</td>'+
					'<td class="abreviatura"><span>'+abrev+'</span>'+
					'</td>'+
					'<td class="actions"><a href="javascript:void(0);" class="btn btn-warning btn-xs editatrib"><i class="fa fa-refresh"></i></a><a href="javascript:void(0);" class="btn btn-danger btn-xs elimina"><i class="fa fa-trash-o"></i></a></td>'+
				'</tr>';
		tu_i = $('#lista tbody');
		es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);
		openCart();
		validabuttonsalista();
	}
	else
	{
		$('tr#atr_'+orden+'_'+id+' td.cantidad span').html(cant);
		$('tr#tr_'+orden+'_'+id+' td.cantidad span').html(cant);

		$('tr#atr_'+orden+'_'+id+' td.cantidad input.cantidad').html(cant);

		$('tr#tr_'+orden+'_'+id+' td.subtotal').html(sub);

		$('tr#atr_'+orden+'_'+id+' td.articulo input.idatributos').val(idatrib);
		$('tr#atr_'+orden+'_'+id+' td.abreviatura span').html(abrev);
	}
	
	$('#addatrib').modal('hide');
	sumarsubtotal();
});

function validabuttonsalista()
{
	if($('#lista tbody tr.tr_lista').length)
	{
		$('.savelista').removeClass('disabled');
	}
}

$(document).on('click', '.editatrib', function (e)
{
	$("#addatrib").modal();
  	$('#viene_atrib').val(2);

	var cant = parseInt($(this).parents('tr').find('td.cantidad span').html());
	var prec = parseInt($(this).parents('tr').find('td.articulo input.precio').val());
  	var atrib = $(this).parents('tr').find('td.articulo input.idatributos').val();
  	var orden = parseInt($(this).parents('tr').attr('orden'));
  	var desc = $(this).parents('tr').find('td.articulo p').html();
  	var id = parseInt($(this).parents('tr').find('td.articulo input.id_art_sucursal').val());
  	var temp = 'id='+id+'&atrib='+atrib;
	$('#form_atributos .number-spinner input').val(cant);
  	$('#addatrib .modal-content .modal-header h4').html(desc);

  	$('#atrib_id_artixsuc').val(id);
  	$('#atrib_desc').val(desc);
  	$('#atrib_pre').val(prec);
  	$('#atrib_orde').val(orden);
  	$('#atrib_atrib').val(atrib);

  	getatributos(temp)
});

$(document).on('click', '.elimina', function (e)
{
	var tis = $(this);
	var id = tis.parents('tr').attr('id');

	if( id.length )
	{
		var res = id.replace("a", "");
		swal({
			title: 'Estas Seguro?',
			text: "De Eliminar este Articulo!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, Eliminar!'
		}).then((result) => {
			if (result.value) {
				tis.parents('tr').remove();
				$('tr#'+res).remove();
				sumarsubtotal();
				if($('#lista tbody tr.tr_lista').length) {}
				else
				{
					agregararticulo();
				  	$('table#detalle tfoot tr td.total span').html('');
				  	$('.savelista').addClass('disabled')
				}

				swal('Elimino!', 'con exito OK.', 'success')
			}
		})
	}
});

$(document).on('change', 'select.combox_atributos', function (e)
{
	var id = $(this).val();
	$(this).parents('div.form-group').find('select.cbx_atributos').val(id)
});

$(document).on('click', '.cambiar', function (e)
{
	var tipo = $(this).attr('tipo');
	if(tipo == "detalle")
	{
		$('#detalle').removeClass('collapse');
		$('#lista').addClass('collapse');
		$(this).attr({'tipo':'lista'});
		$(this).html('Lista');
	}
	else
	{
		$('#lista').removeClass('collapse');
		$('#detalle').addClass('collapse');
		$(this).attr({'tipo':'detalle'});
		$(this).html('Detalle');
	}
});

$(document).on('click', '.savelista', function (e)
{
	var idme = parseInt($('#form_lita input.id_mesam').val());
	idme = idme > 0 ? idme : 0;
	if(idme > 0)
	{
		$.ajax({
	        url: $('base').attr('href') + 'miventa/save_pedido',
	        type: 'POST',
	        data: $('#form_lita').serialize(),
	        dataType: "json",
	        beforeSend: function() {
	            //showLoader();
	        },
	        success: function(response) {
	            if (response.code==1) {
	            	agregararticulo();
	              	closeCart();
	              	swal('Se Guardo con Exito')
	            }
	        },
	        complete: function() {
	        }
	    });
	}
	else
	{
		alerta('Error', 'Agregar Mesa.', 'error');
	}		
});
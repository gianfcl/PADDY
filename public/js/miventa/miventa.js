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
	            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
	        },
	        success: function(response) {
	            if (response.code==1) {
	              $('#todameza').html(response.data.mesas);
	              $('#todazona').addClass('collapse');
	              $('#todameza').removeClass('collapse');
	            }
	        },
	        complete: function() {
	        	$.LoadingOverlay("hide");
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
  	var e_s_t = ' div'
  	var e_t = tipo == '4' ? tipo+e_s_t : tipo; //alert(e_t)
  	var exp = '';
  	if(id>0)
  	{
		for (var i = tipo; i < 5; i++) {
			exp = (tipo == 4) ? tipo+e_s_t : tipo;
 			$('div#cont'+exp).html('');
		}

	    $.ajax({
	        url: $('base').attr('href') + 'miventa/infovalores',
	        type: 'POST',
	        data: 'id='+id+'&estipo='+tipo,
	        dataType: "json",
	        beforeSend: function() {
	            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
	        },
	        success: function(response) {
	            if (response.code==1) {     	
	            	$('div#cont'+e_t).html(response.data.info); //alert('div#cont'+e_t)
	            }
	        },
	        complete: function() {
	        	$.LoadingOverlay("hide");
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
	var tuva = true;
	if(btn.parents('form').attr('id') == "form_atributos")
	{
		var idptc = parseInt($('#atrib_comb').val());
		idptc = (idptc > 0) ? idptc : 0; 

		//alert(idptc)

		if(idptc > 0)
		{
			var max = parseInt($('#tb_tipocombo_'+idptc+' thead tr th.cantcombo h3 b').html());
			max = max > 0 ? max : 0; //falert(max)
			var sum = 0;
			if(max >0)
			{
				$($('tb_tipocombo_'+max+' tbody tr td table.ordlista tr.tr_lista td.cantidad span')).each(function (index, value){
		  			cnt = parseInt($(this).attr('cnt'))
		  			cnt = cnt > 0 ? cnt : 0;
		  			sum = cnt + sum;
		  		});
			}
			sum = sum + val; //alert(max+' <--> '+sum)
			if(max>=sum)
			tuva = false;

			if(!tuva)
				alerta('Error','Excedio la cantidad =< '+(max-sum + val),'error');
		}
	}

	if (btn.attr('data-dir') == 'up') {
		newVal = parseInt(val);
		newVal = (newVal > 0 && tuva) ? newVal+1 : newVal;
	} else {
		if (val > 1) {
			newVal = parseInt(val) - 1;
		} else {
			newVal = 1;
		}
	}
	//alert(newVal+' <-> '+btn.attr('data-dir'))
	if(btn.parents('form').attr('id') == "form_combos")
	{
		var tui = 0;
		var ti_is = "";
		var cnt = 0;
		var sum = 0;
		$($('#total_combos table thead tr th.cantcombo h3 b')).each(function (index, value){
	  		ti_is = $(this);
	  		tui = parseInt(ti_is.parents('table').attr('cnt'));
	  		tui = tui > 0 ? tui*newVal : 0;
	  		ti_is.html(tui)
	  		$(ti_is.parents('table.contcombos').find('tbody tr td table.ordlista tr.tr_lista td.cantidad span')).each(function (index, value){
	  			cnt = parseInt($(this).attr('cnt'))
	  			cnt = cnt > 0 ? cnt : 0;
	  			sum = cnt + sum;
	  		});
	  		if(tui>sum)
	  		{
	  			ti_is.parents('table.contcombos').find('thead tr th a.configarti').show();
	  		}
	  		else
	  		{
	  			ti_is.parents('table.contcombos').find('thead tr th a.configarti').hide();
	  		}
	  		sum = 0;
		});
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
	            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
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
	        	$.LoadingOverlay("hide");
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
	var obs = $('#obs_cantidad').val()
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
					'<td class="abreviatura"><span></span>'+'</td>'+
					'<td class="obs"><span>'+obs+'</span>'+
						'<input value="'+obs+'" name="observacion['+orden+']['+id+']" type="hidden" class="observacion">'+
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
		$('tr#atr_'+orden+'_'+id+' td.obs span').html(obs);
		$('tr#atr_'+orden+'_'+id+' td.obs input').val(obs); //alert(obs)

		$('tr#tr_'+orden+'_'+id+' td.subtotal').html(sub);
	}
	
	$('#addarti').modal('hide');
	sumarsubtotal();
});

$(document).on('click', '.addcombo', function (e)
{
	$('#form_combo .number-spinner input').val(1);

  	$('#viene_comb').val(1);

  	var orden = 0;
  	if($('#lista tbody tr.tr_lista').length)
  	{
  		orden = parseInt($('#lista tbody tr.tr_lista:last').attr('orden'));
  		orden = orden > 0 ? orden : 0;
  		//alert(orden)
  	}
  	orden++;
  	var id = $(this).attr('idtu');
  	var desc = $(this).html();
  	$('#addcombo .modal-content .modal-header h4').html(desc);

  	$('#comb_id_artixsuc').val(id);
  	$('#comb_desc').val(desc);
  	$('#comb_orde').val(orden);
  	$('#comb_pre').val($(this).attr('precio'));

  	getcombos('id='+id)
});

function getcombos(temp)
{
	$.ajax({
        url: $('base').attr('href') + 'miventa/getcombos',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {	            	
            	$('div#total_combos').html(response.data.info);
            }
        },
        complete: function() {
        	$.LoadingOverlay("hide");
        }
    });
}

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
  	$('#obs_cantidad').val('');
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
  	$('#atrib_es').val(1)

 	getatributos('id='+id)
  	
});

function getatributos(temp, div = '')
{
	div = (div.trim().length) ? div : 'total_atributos';
	$.ajax({
        url: $('base').attr('href') + 'miventa/getatributos',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {	            	
            	$('#'+div).html(response.data.info); //alert(div)
            }
        },
        complete: function() {
	        $.LoadingOverlay("hide");
        }
    });
}

$(document).on('click', '.addclasarti', function (e)
{
  	$(this).removeClass('btn-default');
  	$('.addclasarti').removeClass('btn-primary');
  	$(this).addClass('btn-primary');
});


function agregararticulo( tis = 0)
{
	var col = 4;
	var html = ''; 
	var tb = $('#lista tbody');
	var tes = parseInt(tis);
	tes = tes > 0 ? tes : 0;
	if(tes>0)
	{
		tb = $('#tb_tipocombo_'+tes+' tbody tr td table.ordlista tbody');
	}
	else
	{
		html = "<tr><td colspan='"+col+"'><p class='cart__empty js-cart-empty'>Agregar Articulo</p></td></tr>";
		$('#detalle tbody').html(html);		
	}
	col++;	
	html = "<tr><td colspan='"+col+"'><p class='cart__empty js-cart-empty'>Agregar Articulo</p></td></tr>";
	tb.html(html);
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
	var esatrib = parseInt($('#atrib_es').val());
	var escbo = parseInt($('#atrib_comb').val());
	var obs = $('#obs_atributos').val(); //alert(obs)

	escbo = (escbo > 0) ? escbo : 0;
	orden = orden > 0 ? orden : 1;

	var html = "";

	var sub = cant*pre;
	sub = (sub>0) ? (sub.toFixed(2)) : ('0.00');
	esatrib = (esatrib > 0) ? esatrib : 0;

	var idatrib = (esatrib > 0) ? get_joinids('total_atributos') : '';
	var abrev = (esatrib > 0) ? get_abreviatura('total_atributos') : '';//alert(abrev)
	var clas = (escbo > 0) ? 'cbo' : '';
	var clashtml = '';
	switch( viene )
	{
		case 1:
		case 3:
			if(viene == 1)
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
						'<td class="cantidad"><span cnt="'+cant+'">'+cant+'</span>'+
							'<input value="'+cant+'" name="cantidad['+orden+']['+id+']" type="hidden" class="cantidad">'+
							'<input value="0" name="id_pedido_det['+orden+']['+id+']" type="hidden" class="id_pedido_det">'+
						'</td>'+
						'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left">'+nomb+'</p></div></div>'+
							'<input value="'+id+'" name="id_art_sucursal['+orden+']['+id+']" type="hidden" class="id_art_sucursal">'+
							'<input value="'+nomb+'" name="descripcion['+orden+']['+id+']" type="hidden" class="descripcion">'+
							'<input value="'+idatrib+'" name="id_atributos['+orden+']['+id+']" type="hidden" class="idatributos">'+
							'<input value="'+pre+'" name="precio['+orden+']['+id+']" type="hidden" class="precio">'+
							'<input value="2" name="id_esatribcomb['+orden+']['+id+']" type="hidden" class="idesatribcomb">'+
						'</td>'+
						'<td class="abreviatura"><span>'+abrev+'</span>'+'</td>'+
						'<td class="obs"><span>'+obs+'</span>'+
							'<input value="'+obs+'" name="observacion['+orden+']['+id+']" type="hidden" class="observacion">'+
						'</td>'+
						'<td class="actions"><a href="javascript:void(0);" class="btn btn-warning btn-xs editatrib'+clas+'"><i class="fa fa-refresh"></i></a><a href="javascript:void(0);" class="btn btn-danger btn-xs elimina"><i class="fa fa-trash-o"></i></a></td>'+
					'</tr>';
			tu_i = $('#lista tbody');
			if(viene == 3 && escbo>0)
			{
				tu_i = '#tb_tipocombo_'+escbo;
				orden = 0; 
				if($(tu_i+' tbody tr table.ordlista tr.tr_lista').length)
			  	{
			  		orden = parseInt($(tu_i+' tbody tr.tr_lista:last').attr('orden'));
			  		orden = orden > 0 ? orden : 0;
			  	}
			  	orden++;
			  	tu_i = $(tu_i+' tbody tr table.ordlista tbody');
				$("#addcombo").modal();
				disabledaddcbo(escbo,cant);
			}
			es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);
			openCart();
			validabuttonsalista();
			$('#addatrib').modal('hide');
			sumarsubtotal();
		break;

		case 2:
		case 4:
			tu_i = $('#lista');
			if(viene == 4 && escbo>0)
			{
				tu_i = '#tb_tipocombo_'+escbo+' tbody tr td table.ordlista tbody';
				$("#addcombo").modal();
				disabledaddcbo(escbo,cant);
			}
			else
			{
				$('tr#tr_'+orden+'_'+id+' td.subtotal').html(sub);
				sumarsubtotal();
			}
			$(tu_i+' tr#atr_'+orden+'_'+id+' td.cantidad span').html(cant);
			$(tu_i+' tr#tr_'+orden+'_'+id+' td.cantidad span').html(cant);

			$(tu_i+' tr#atr_'+orden+'_'+id+' td.cantidad input.cantidad').html(cant);

			$(tu_i+' tr#atr_'+orden+'_'+id+' td.articulo input.idatributos').val(idatrib);
			$(tu_i+' tr#atr_'+orden+'_'+id+' td.abreviatura span').html(abrev);

			$(tu_i+' tr#atr_'+orden+'_'+id+' td.obs span').html(obs);
			$(tu_i+' tr#atr_'+orden+'_'+id+' td.obs input').val(obs);			

			$('#addatrib').modal('hide');
		break;

		default:
		break;
	}
	$('#total_atributos').html('');
	$('#obs_atributos').val('');
});

function disabledaddcbo(escbo, cn)
{
	if(escbo > 0)
	{
		tu_i = '#tb_tipocombo_'+escbo;
		tot = parseInt($(tu_i+' thead tr th.cantcombo span').html());
		tot = tot > 0 ? tot : 0;
		cnt = 0;
		cn = parseInt(cn);
		cn = cn > 0 ? cn : 0;
		sum = cn;
		if($(tu_i+' thead tr th.ordlista tr.tr_lista td.cantidad span').length)
	  	{
	  		$(tu_i+' tbody tr table.ordlista tr.tr_lista td.cantidad span').each(function (index, value){
				cnt = parseInt($(this).html());
		  		sum = sum + cnt;
	  		});		  		
	  	}
	  	var ex = (sum >= tot) ? true : false;
	  	var tx = (ex) ? 'disabled' : '';
	  	if(ex)
	  	{
	  		$(tu_i+' thead tr th a.configarti').hide();
	  	}
	  	else
	  	{
	  		$(tu_i+' thead tr th a.configarti').show();
	  	}

	}
}

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
  	$('#atrib_es').val(1);
  	$('#atrib_comb').val(0);
  	getatributos(temp)
});

$(document).on('click', '.elimina', function (e)
{
	var tis = $(this);
	var id = tis.parents('tr').attr('id');
	var estu = false;
	var padre = '';
	var idpadre = 0;
	if(tis.parents('table.contcombos').length)
	{
		padre = tis.parents('table.contcombos')
		estu = true;
		idpadre = parseInt(padre.attr('idpartescombo')); //alert(idpadre)
		idpadre = idpadre > 0 ? idpadre : 0;
	}
 
//alert(estu)
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
		}).then((result) => { //alert(result)
			if (result) {
				
				if(idpadre > 0)
				{
					tis.parents('tr.tr_lista').remove();
					$('#tb_tipocombo_'+idpadre+' thead tr th.a_d_d_art a').show();
					
					if($('#tb_tipocombo_'+idpadre+' tbody tr td table.ordlista tbody tr').length) {}
					else {
						agregararticulo(idpadre); //alert(idpadre);
					}					
				}
				else
				{   
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
		$(this).html('Detalle');
	}
	else
	{
		$('#lista').removeClass('collapse');
		$('#detalle').addClass('collapse');
		$(this).attr({'tipo':'detalle'});
		$(this).html('Cuenta');
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
	            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
	        },
	        success: function(response) {
	            if (response.code==1) {
	            	agregararticulo();
	              	closeCart();
	              	swal('Se Guardo con Exito')
	            }
	        },
	        complete: function() {
	        	$.LoadingOverlay("hide");
	        }
	    });
	}
	else
	{
		alerta('Error', 'Agregar Mesa.', 'error');
	}
		
});

$(document).on('click', '.minus-button', function (e) {

    const currentInput = $(e.currentTarget).parent().prev()[0];

    let minusInputValue = $(currentInput).html();

    if(minusInputValue >= 1)
    minusInputValue --;
    $(currentInput).html(minusInputValue);
});

$(document).on('click', '.plus-button', function (e) {
	var cant = parseInt($(this).parents('table').find('thead tr.cnt_ptcb').attr('cnt'));
	cant = cant > 0 ? cant : 0;
	var tui = 0;
	var sum = 0;

	$($(this).parents('table').find('tbody tr td.viewcant div.viewcant')).each(function (index, value){
  		tui = parseInt($(this).html());
  		tui = tui > 0 ? tui : 0;
  		sum = sum + tui;
	});

	const currentInput = $(e.currentTarget).parent().prev()[0];

	let plusInputValue = $(currentInput).html();
    if(cant > sum)
	plusInputValue ++;
	$(currentInput).html(plusInputValue);
});

$(document).on('click', '.configarti', function (e)
{
	var tis = $(this);
	$("#addatrib").modal();
	$("#addcombo").modal('hide');
	$('#form_atributos .number-spinner input').val(1);

  	$('#viene_atrib').val(3);

  	var orden = 0;
  	var sub = 0;
  	if($('#lista tbody tr.tr_lista').length)
  	{
  		orden = parseInt($('#lista tbody tr.tr_lista:last').attr('orden'));
  		orden = orden > 0 ? orden : 0;
  		//alert(orden)
  	}
	
	var aux = 0;
  	if($('#addcboatrib table.ordlista tbody tr.tr_lista').length)
  	{
  		
  		$('#addcboatrib table.ordlista tbody').each(function (index, value){
  			sub = parseInt($(this).find('tr.tr_lista:last').attr('orden'));
	  		sub = sub > 0 ? sub : 0;
	  		aux = sub > aux ? sub : aux;
  		});  		
  	}
  	orden = (orden > aux) ? orden : aux;
  	if(aux == 0) 
		orden++;

  	orden++;
  	var esatrib = parseInt(tis.attr('esatrib'));
  	esatrib = esatrib > 0 ? esatrib: 0;
  	var id = tis.parents('tr').attr('idtu');
  	var desc = tis.parents('tr').find('th.desc').html(); //alert(desc)
  	$('#addatrib .modal-content .modal-header h4').html(desc);

  	$('#atrib_id_artixsuc').val(id);
  	$('#atrib_desc').val(desc);
  	$('#atrib_pre').val($(this).attr('precio'));
  	$('#atrib_orde').val(orden);
  	$('#atrib_atrib').val('')
  	$('#atrib_es').val(esatrib);
  	$('#atrib_comb').val($(this).parents('table').attr('idpartescombo'));

  	//if(esatrib > 0)
  	getatributos('id='+id)
});

$(document).on('click', '.editatribcbo', function (e){
	$("#addatrib").modal();
	$("#addcombo").modal('hide');
  	$('#viene_atrib').val(4);
  	var tis = $(this);

	var cant = parseInt(tis.parents('tr').find('td.cantidad span').html());
	var prec = parseInt(tis.parents('tr').find('td.articulo input.precio').val());
  	var atrib = tis.parents('tr').find('td.articulo input.idatributos').val();
  	var orden = parseInt(tis.parents('tr').attr('orden'));
  	var desc = tis.parents('tr').find('td.articulo p').html();
  	var id = parseInt(tis.parents('tr').find('td.articulo input.id_art_sucursal').val());
  	var temp = 'id='+id+'&atrib='+atrib;
  	var obs = tis.parents('tr').find('td.obs span').html();
	$('#form_atributos .number-spinner input').val(cant);
  	$('#addatrib .modal-content .modal-header h4').html(desc);

  	$('#atrib_id_artixsuc').val(id);
  	$('#atrib_desc').val(desc);
  	$('#atrib_pre').val(prec);
  	$('#atrib_orde').val(orden);
  	$('#atrib_atrib').val(atrib);
  	$('#atrib_es').val(1);
  	$('#atrib_comb').val(tis.parents('table.contcombos').attr('idpartescombo')); 
  	//alert(tis.parents('table.contcombos').attr('idpartescombo'));
  	$('#obs_atributos').val(obs)
  	getatributos(temp)
});
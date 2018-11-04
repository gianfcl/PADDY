//$("#modalmiventa").modal();

$(document).on('click', '.mospiso', function (e)
{
	$('#todameza').html('');
	$('#todameza').addClass('collapse');
	$('#todazona').removeClass('collapse');
	ver_aver(2);
	limpdescmesas();
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
	        aSync: false,
	        data: 'id_zonam='+id,
	        dataType: "html",
	        beforeSend: function() {
	            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
	        },
	        success: function(response) {
	            $('#todameza').html(response);
				$('#todazona').addClass('collapse');
				$('#todameza').removeClass('collapse');
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
  	$(this).parents('.panel-body').find('a').addClass('btn-info');
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
    ver_aver(1);
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
			var max = parseInt($('#tb_tipocombo_'+idptc+' thead tr.notocar th.cantcombo h3 b.cantplatos').html());
			max = max > 0 ? max : 0; //alert(max)
			var sum = val;
			sum = (btn.attr('data-dir') == 'up') ? sum+1 : sum-1; //alert(sum);
			/*var viene = parseInt($('#viene_comb').val());
			viene = viene > 0 ? viene : 0;*/
			var idtx = $('#idedit_comb').val();
			var cantm = (idtx.length) ? parseInt($('#'+idtx+' td.cantidad span').html()) : 0;
			cantm = cantm > 0 ? cantm : 0;
			var suni = 0;
		    var cnt = 0;
			if(max >0)
			{
				$($('#tb_tipocombo_'+idptc+' tbody tr td table.ordlista tr.tr_lista td.cantidad span')).each(function (inx, vax){
		  			cnt = parseInt($(vax).html());
		  			cnt = cnt > 0 ? cnt : 0;
		  			sum = cnt + sum;
		  			suni = suni + cnt;
		  		});
			}
			
			sum = sum - cantm; //alert('max-> '+max+' <--> sum->'+sum+' <--> cantm->'+cantm)
			if(max<sum)
			tuva = false;

			if(!tuva)
				alerta('Error','La cantidad es mayor a '+val,'error');
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
		$($('#total_combos thead tr.notocar th.cantcombo h3 b.cantplatos')).each(function (index, value){
	  		ti_is = $(this);
	  		tui = parseInt(ti_is.html());
	  		tui = tui > 0 ? tui*newVal : 0;
	  		ti_is.html(tui)
	  		$(ti_is.parents('table.contcombos').find('tbody tr td table.ordlista tr.tr_lista td.cantidad span')).each(function (ix, vx){
	  			cnt = parseInt($(vx).html())
	  			cnt = cnt > 0 ? cnt : 0;
	  			sum = cnt + sum;
	  		});
	  		alert(tui+' '+sum)
	  		if(tui>sum)
	  		{
	  			ti_is.parents('table.contcombos').find('thead tr.a_d_d_art').show();
	  		}
	  		else
	  		{
	  			ti_is.parents('table.contcombos').find('thead tr.a_d_d_art').hide();
	  		}
	  		sum = 0;
		});
	}

	btn.closest('.number-spinner').find('input').val(newVal);
});

function ver_aver(tip)
{
	var tip = (parseInt(tip) > 0) ? parseInt(tip) : 0;
	var tip1 = tip == 1 ? 'add_arti_cu' : 'nuevo_mesas';
	var tip2 = tip == 1 ? 'nuevo_mesas' : 'add_arti_cu';

	$('.'+tip2).addClass('collapse');

	$('.'+tip1).removeClass('collapse'); //alert('add->'+tip1+' remov->'+tip2);
}

$(document).on('click', '.abrirmesa', function (e)
{
	openCart();
});

$(document).on('click', '.mimesa', function (e)
{
	$('h1.cart__title small').html($(this).html());
	cargardescmesas();
	var id = $(this).attr('idmesa');
	var idpedido = parseInt($(this).attr('idpedido'));
	idpedido = idpedido > 0 ? idpedido : 0;
 	var num = idpedido > 0 ? 1 : 2;
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
	            $('#form_lita input.id_pedido').val(response.id_pedido);
            	$('#form_lita input.id_mesam').val(response.id_mesam);
            	$('#lista tbody').html(response.lista);
        		$('#detalle tbody').html(response.detalle);
        		$('table#detalle tfoot tr td.total span').html(response.pt);
        		$('.savelista').removeClass('disabled');
        		ver_aver(1);
	        },
	        complete: function() {
	        	$.LoadingOverlay("hide");
	        	if(idpedido >0 )
	        	openCart();
	        }
	    });
	}
	else
	{
		$('#form_lita input.id_mesam').val(id);
		openCart();
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

$(document).on('click', '.addmasarti', function (e)
{
	cargardescmesas();
	var iddefc = parseInt($('#a_id_1').attr('idgrup'));
	if(iddefc > 0)
	{
		$('#hasclik_'+iddefc).click();
	}
	
});

function cargardescmesas()
{
	$('.x_title h3 small').html($('h1.cart__title small').html());
	$('.x_title h3 b').html('Mesa');
}

function limpdescmesas()
{
	$('.x_title h3 small').html('');
	$('.x_title h3 b').html('');
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
		if(parseInt(tu_i.length) > 1)
		{
			tu_i = tu_i.eq(0);
		}
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
	limp_todo('form_cantidad');
});

$(document).on('click', '.addcombo', function (e)
{
	$('#form_combos input.esticuenta').val(1); //alert(va)

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

function getcombos(temp, clas = '')
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
			if(clas.trim().length)
			{
				editcbo(clas);
			}
        }
    });
}

function crearadicional(tip, div)
{
	var tipo = (parseInt(tip)>0) ? parseInt(tip) : 0;
	var html = tipo >0 ? '<div class="row x_title1"><h2><a href="javascript:void(0);" class="masadicional btn-primary btn btn-sm" data-toggle="modal" data-target="#masadicional"><i class="fa fa-plus"></i></a> Adicional</h2></div>' : '';
	$('#'+div+' .tu_adicional').html(html);
}

$(document).on('click', 'h1.cart__title b', function (e)
{
	$.ajax({
        url: $('base').attr('href') + 'miventa/ver_bandeja',
        type: 'POST',
        data: $('#form_lita').serialize(),
        dataType: "json",
        beforeSend: function() {
            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {
            	$('#all_mesas').html(response.data.all_mesas);
            	$('#tb_totales').html(response.data.all_tbs);
            }
        },
        complete: function() {
        	$.LoadingOverlay("hide");
        	ver_aver(2);
        	agregararticulo();
        	closeCart();
        }
    });
});

$(document).on('click', '.verpedido', function (e)
{
	$('ul#tabs a[href="#tab_content2"]').tab('show');
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
  	//$('#obs_cantidad').val('');
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
  	$(this).parents('.panel-body').find('a').removeClass('btn-primary');
  	$(this).parents('.panel-body').find('a').addClass('btn-info');
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
  	limpdescmesas();
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
  return ids.join(', ');
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
	var cob_id_arti = $('#comb_id_artixsuc').val();

	escbo = (escbo > 0) ? escbo : 0;
	orden = orden > 0 ? orden : 1;

	var html = "";

	var sub = cant*pre;
	sub = (sub>0) ? (sub.toFixed(2)) : ('0.00');
	esatrib = (esatrib > 0) ? esatrib : 0;

	var idatrib = get_joinids('total_atributos');
	var abrev = get_abreviatura('total_atributos');//alert(abrev)
	var clas = (escbo > 0) ? 'cbo' : '';
	var clashtml = (escbo > 0) ? ' idpartescombo="'+escbo+'"' : '';
	var id_esatribcomb = 2;
	switch( viene )
	{
		case 1:
		case 3:
			var htmlpadre = '';
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
			}
			else
			{
				id_esatribcomb = 4;
				var ordpad = $('#comb_orde').val();
				htmlpadre = '<input value="'+cob_id_arti+'" name="id_artipadre['+orden+']['+id+']" type="hidden" class="idpadre">'+
							'<input value="'+escbo+'" name="id_partescombo['+orden+']['+id+']" type="hidden" class="idpartescombo">'+
							'<input value="'+ordpad+'" name="id_ordenpadre['+orden+']['+id+']" type="hidden" class="idpartescombo">';
			}
				
			var tu_i = $('#detalle tbody');
			var es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);

			html = '<tr'+clashtml+' orden="'+orden+'" class="tr_lista" id="'+clas+'atr_'+orden+'_'+id+'">'+
						'<td class="cantidad"><span cnt="'+cant+'">'+cant+'</span>'+
							'<input value="'+cant+'" name="cantidad['+orden+']['+id+']" type="hidden" class="cantidad">'+
							'<input value="0" name="id_pedido_det['+orden+']['+id+']" type="hidden" class="id_pedido_det">'+
						'</td>'+
						'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left">'+nomb+'</p></div></div>'+
							'<input value="'+id+'" name="id_art_sucursal['+orden+']['+id+']" type="hidden" class="id_art_sucursal">'+
							'<input value="'+nomb+'" name="descripcion['+orden+']['+id+']" type="hidden" class="descripcion">'+
							'<input value="'+idatrib+'" name="id_atributos['+orden+']['+id+']" type="hidden" class="idatributos">'+
							'<input value="'+pre+'" name="precio['+orden+']['+id+']" type="hidden" class="precio">'+
							'<input value="'+id_esatribcomb+'" name="id_esatribcomb['+orden+']['+id+']" type="hidden" class="idesatribcomb">'+htmlpadre+
						'</td>'+
						'<td class="abreviatura"><span>'+abrev+'</span>'+'</td>'+
						'<td class="obs"><span>'+obs+'</span>'+
							'<input value="'+obs+'" name="observacion['+orden+']['+id+']" type="hidden" class="observacion">'+
						'</td>'+
						'<td class="actions"><a href="javascript:void(0);" class="btn btn-warning btn-xs editatrib'+clas+'"><i class="fa fa-refresh"></i></a><a href="javascript:void(0);" class="btn btn-danger btn-xs elimina"><i class="fa fa-trash-o"></i></a></td>'+
					'</tr>';
			tu_i = $('#lista tbody');
			if(parseInt(tu_i.length) > 1)
			{
				tu_i = tu_i.eq(0);
			}
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
			}
			es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);
			if(viene == 3 && escbo>0)
			{
				disabledaddcbo(escbo);
			}
			openCart();
			validabuttonsalista();
			$('#addatrib').modal('hide');
			sumarsubtotal();
		break;

		case 2:
		case 4:
		//alert(128+' viene->'+viene+' escbo->'+escbo)
			tu_i = $('#lista');
			if(viene == 4 && escbo>0)
			{
				tu_i = '#tb_tipocombo_'+escbo+' tbody tr td table.ordlista tbody';
				$("#addcombo").modal();
			}
			else
			{
				$('tr#tr_'+orden+'_'+id+' td.subtotal').html(sub);
				sumarsubtotal();
			}

			$(tu_i+' tr#'+clas+'atr_'+orden+'_'+id+' td.cantidad span').html(cant);
			$(tu_i+' tr#'+clas+'atr_'+orden+'_'+id+' td.cantidad span').attr({'cnt':cant});

			$(tu_i+' tr#'+clas+'atr_'+orden+'_'+id+' td.cantidad input.cantidad').html(cant);

			$(tu_i+' tr#'+clas+'atr_'+orden+'_'+id+' td.articulo input.idatributos').val(idatrib);
			$(tu_i+' tr#'+clas+'atr_'+orden+'_'+id+' td.abreviatura span').html(abrev);

			$(tu_i+' tr#'+clas+'atr_'+orden+'_'+id+' td.obs span').html(obs);
			$(tu_i+' tr#'+clas+'atr_'+orden+'_'+id+' td.obs input').val(obs);
			if(viene == 4 && escbo>0)
			{
				disabledaddcbo(escbo);
			}		

			$('#addatrib').modal('hide');
		break;

		default:
		break;
	}
	limp_todo('form_atributos','total_atributos');
	$('.savelista').removeClass('disabled');
});

function disabledaddcbo(escbo)
{
	if(escbo > 0)
	{
		tu_i = '#tb_tipocombo_'+escbo; 
		tot = parseInt($(tu_i+' thead tr.notocar th.cantcombo h3 b.cantplatos').html());
		tot = tot > 0 ? tot : 0;
		cnt = 0;

		sum = 0;

		if($(tu_i+' tbody tr td table.ordlista tr.tr_lista td.cantidad span').length)
	  	{
	  		$(tu_i+' tbody tr table.ordlista tr.tr_lista td.cantidad span').each(function (index, value){
				cnt = parseInt($(value).html());
		  		sum = sum + cnt;
	  		});		  		
	  	}
	  	//alert('tot-> '+tot+' sum->'+sum)
	  	var ex = (sum >= tot) ? true : false;
	  	var tx = (ex) ? 'disabled' : '';
	  	if(ex)
	  	{
	  		$(tu_i+' thead tr.a_d_d_art').hide();
	  		$(tu_i+' .escoge').hide();
	  	}
	  	else
	  	{
	  		$(tu_i+' thead tr.a_d_d_art').show();
	  		$(tu_i+' .escoge').show();
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
	var id2 = "";

	if(tis.parents('table.contcombos').length)
	{
		padre = tis.parents('table.contcombos')
		estu = true;
		idpadre = parseInt(padre.attr('idpartescombo')); //alert(idpadre)
		idpadre = idpadre > 0 ? idpadre : 0;
	}

	if(tis.parents('form#form_lita').length)
	{
		id2 = id.replace("atr_", "");
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
					if(tis.parents('form#form_lita').length)
					{
						id2 = id.replace("atr_", "");
						tis.parents('tr.'+id2).remove();
					}
					$('#tb_tipocombo_'+idpadre+' thead tr.a_d_d_art').show();
					$('#tb_tipocombo_'+idpadre+' thead .escoge').show();
					
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
	$('.nuevobuttom li').removeClass('active');
	$(this).parents('li').addClass('active');
	$('.cart__products table').addClass('collapse');
	$('table#'+tipo).removeClass('collapse');
	var txt = $(this).html();
	$(this).parents('.nuevobuttom').find('button b').html(txt);
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
	            	$('#all_mesas').html(response.data.all_mesas);
	            	$('#tb_totales').html(response.data.all_tbs);
	            	//agregararticulo();
	              	//closeCart();
	              	swal('Se Guardo con Exito')
	            }
	        },
	        complete: function() {
	        	$.LoadingOverlay("hide");
	        	ver_aver(2);
	        }
	    });
	}
	else
	{
		alerta('Error', 'Agregar Mesa.', 'error');
	}
	limpdescmesas();	
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
  	if($('#lista tbody tr.tr_lista').length)
  	{
  		orden = parseInt($('#lista tbody tr.tr_lista:last').attr('orden'));
  		orden = orden > 0 ? orden : 0;
  		//alert(orden)
  	}
	
	var aux = 0;
  	var sub = 0;
  	if($('table.ordlista tbody tr.tr_lista').length)
  	{  		
  		$('table.ordlista tbody tr.tr_lista').each(function (index, vx){
  			sub = parseInt($(vx).attr('orden')); //alert('sub-> '+sub)
	  		sub = sub > 0 ? sub : 0;
	  		aux = sub > aux ? sub : aux;
  		});  		
  	}
  	orden = (orden > aux) ? orden : aux;
  	if(aux == 0)
  	{
		orden++;
  	}

  	orden++;
  	var esatrib = parseInt(tis.attr('esatrib'));
  	esatrib = esatrib > 0 ? esatrib: 0;
  	var id = tis.parents('tr').attr('idtu');
  	var desc = tis.parents('tr').find('th.desc span.pull-left').html(); //alert(desc)
  	$('#addatrib .modal-content .modal-header h4').html(desc);

  	$('#atrib_id_artixsuc').val(id);
  	$('#atrib_desc').val(desc);
  	$('#atrib_pre').val($(this).attr('precio'));
  	$('#atrib_orde').val(orden);
  	$('#atrib_atrib').val('')
  	$('#atrib_es').val(esatrib);
  	$('#atrib_comb').val($(this).parents('table').attr('idpartescombo'));
  	$('#idedit_comb').val('');

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
  	$('#idedit_comb').val(tis.parents('tr.tr_lista').attr('id'))
  	//alert(tis.parents('tr.tr_lista').attr('id'));
  	$('#obs_atributos').val(obs)
  	getatributos(temp)
});

$(document).on('click', '.savecombo', function (e)
{
	var valida = true;
	var tui = 0;
	var ti_is = "";
	var cnt = 0;
	var sum = 0;
	var sumt = 0;
	var idult = 0;
	var ord = 0;
	var aux = 0;

	$($('#total_combos table thead tr.notocar th.cantcombo h3 b.cantplatos')).each(function (index, value){
  		ti_is = $(value);
  		tui = parseInt(ti_is.html());
  		tui = tui > 0 ? tui : 0;
  		sumt = sumt + tui;
  		
  		$(ti_is.parents('table.contcombos').find('tbody tr td table.ordlista tr.tr_lista td.cantidad span')).each(function (id, va){
  			cnt = parseInt($(va).html());
  			cnt = cnt > 0 ? cnt : 0;
  			sum = cnt + sum;

  			ord = parseInt($(va).parents('tr.tr_lista').attr('orden'));
  			ord = ord > 0 ? ord : 0;

  			if(ord > aux)
  			{
  				aux = ord; 
  				idult = $(this).parents('tr.tr_lista').attr('id');
  			}
  		});

	});
//alert(sum+' '+sumt)
	valida = (sum>0 && sumt >0 && sum == sumt) ? valida : false;

	if(valida)
	{
		var orden = parseInt($('#comb_orde').val());
		orden = orden > 0 ? orden : 1;
		var id  = $('#comb_id_artixsuc').val();

		var idcbx = orden+'_'+id;

		$('table.ordlista tbody tr.tr_lista td.actions a').addClass('hide');
		$('table.ordlista tbody tr.tr_lista td.articulo p').addClass('vienecombo');
		$('table.ordlista tbody tr.tr_lista').addClass(idcbx);
		var oldipc = $('#'+idult).parents('table.contcombos').attr('idpartescombo');
		var new_u = idult.replace("cbo", "");

		var trult = '<tr idpartescombo="'+oldipc+'" orden="'+aux+'" class="tr_lista '+idcbx+'" id="'+new_u+'">'+$('#'+idult).html()+'</tr>'
		$('#'+idult).remove(); //alert(trult);
		var cant = $('#form_combos .number-spinner input').val();
		var viene = parseInt($('#viene_comb').val()); //alert(viene)
		var nomb = $('#comb_desc').val();
		var pre  = $('#comb_pre').val();
		
		var atrib_atrib = $('#comb_atrib').val();
		
		var obs = $('#obs_combo').val();

		var html = "";
		var sub = cant*pre;
		sub = (sub>0) ? (sub.toFixed(2)) : ('0.00');

		var newid = "";
		var htmlhijo = '';
		var htmlcbos = '';
		var cantcbo = 0;
		$('#total_combos table.contcombos').each(function (ze, axi){
			newid = $(axi).attr('idpartescombo');
			cantcbo = $(axi).attr('cnt');
			htmlcbos = htmlcbos + '<input value="'+cantcbo+'" name="canticbpl['+orden+']['+id+']['+newid+']" type="hidden" class="canticbpl">';
			$(axi).find('tbody tr td table.ordlista tbody tr.tr_lista').each(function (zi, axo){
				//alert($(axo).attr('id'))
				newid = $(axo).attr('id');
				newid = newid.replace("cbo", ""); //alert(newid);
				$(axo).attr({'id':newid});
			});
		});

		$('table.ordlista tbody').each(function (index, vix){				
			htmlhijo = htmlhijo + $(vix).html(); //alert($(vix).html())
  		});

  		htmlhijo = htmlhijo + trult;

		switch( viene )
		{
			case 1:
				html = '<tr orden="'+orden+'" class="tr_detalle" id="atr_'+idcbx+'">'+
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
//alert('entro')
				html = '<tr orden="'+orden+'" class="tr_lista" id="atr_'+orden+'_'+id+'">'+
							'<td class="cantidad"><span cnt="'+cant+'">'+cant+'</span>'+
								'<input value="'+cant+'" name="cantidad['+orden+']['+id+']" type="hidden" class="cantidad">'+
								'<input value="0" name="id_pedido_det['+orden+']['+id+']" type="hidden" class="id_pedido_det">'+
							'</td>'+
							'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left">'+nomb+'</p></div></div>'+
								'<input value="'+id+'" name="id_art_sucursal['+orden+']['+id+']" type="hidden" class="id_art_sucursal">'+
								'<input value="'+nomb+'" name="descripcion['+orden+']['+id+']" type="hidden" class="descripcion">'+
								'<input value="" name="id_atributos['+orden+']['+id+']" type="hidden" class="idatributos">'+
								'<input value="'+pre+'" name="precio['+orden+']['+id+']" type="hidden" class="precio">'+
								'<input value="3" name="id_esatribcomb['+orden+']['+id+']" type="hidden" class="idesatribcomb">'+htmlcbos+
							'</td>'+
							'<td class="abreviatura"><span></span>'+'</td>'+
							'<td class="obs"><span>'+obs+'</span>'+
								'<input value="'+obs+'" name="observacion['+orden+']['+id+']" type="hidden" class="observacion">'+
							'</td>'+
							'<td class="actions"><a href="javascript:void(0);" class="btn btn-warning btn-xs editcbo"><i class="fa fa-refresh"></i></a><a href="javascript:void(0);" class="btn btn-danger btn-xs elimina"><i class="fa fa-trash-o"></i></a></td>'+
						'</tr>'+
						'<tr class="'+orden+'_'+id+'" id="hijoatr_'+orden+'_'+id+'">'+
							'<td colspan="5">'+
								'<table class="dethijo" width="100%"><thead><tr><th style="width:12%"></th><th style="width:50%"></th><th style="width:14%"></th><th style="width:14%"></th><th style="width:10%"></th></tr></thead><tbody>'+htmlhijo+'</tbody></table>'+
							'</td>'
						'</tr>';
				tu_i = $('#lista tbody tr#hijoatr_'+orden+'_'+id+' td table.dethijo tbody');
				es = (orden > 1) ? $('#lista tbody').not( "table.dethijo tbody" ).append(html) : $('#lista tbody').not( "table.dethijo tbody" ).html(html);
				//$('table.ordlista tbody tr.tr_lista td.actions a.btn-warning').removeClass('editatribcbo');
				

			break;
			case 2:
				tu_i = $('#lista tbody tr#hijoatr_'+orden+'_'+id+' td table.dethijo tbody');
				tu_i.html(htmlhijo);
				tu_i = '#lista tbody';
				$(tu_i+' tr#atr_'+orden+'_'+id+' td.cantidad span').html(cant);
				$(tu_i+' tr#tr_'+orden+'_'+id+' td.cantidad span').html(cant);

				$(tu_i+' tr#atr_'+orden+'_'+id+' td.obs span').html(obs);
				$(tu_i+' tr#atr_'+orden+'_'+id+' td.obs input').val(obs);
			break;
		}
		
		$("#addcombo").modal('hide');
		sumarsubtotal();
		limp_todo('form_combos','total_combos')
		$('.savelista').removeClass('disabled');
	}
	else
	{
		alerta('No Agrego','Verificar la cantidad de Articulos','error');
	}

});

$(document).on('click', '.editcbo', function (e)
{
	var tis = $(this);
	var pad = tis.parents('tr.tr_lista');
	var id = parseInt(pad.find('td.articulo input.id_art_sucursal').val());
	id = id > 0 ? id : 0; //alert(id)

	var cant = parseInt(pad.find('td.cantidad input.cantidad').val());
	var desc = pad.find('td.articulo p').html();
	var orden = pad.attr('orden');
	var prec = pad.find('td.articulo input.precio').val();
	var clas = pad.attr('id');
	var obs = pad.find('td.obs span').html();
	if(id > 0)
	{
		$('#addcombo').modal();
		$('#form_combos input.esticuenta').val(cant);
	  	$('#viene_comb').val(2);
	  	$('#addcombo .modal-content .modal-header h4').html(desc);
	  	$('#comb_id_artixsuc').val(id);
	  	$('#comb_desc').val(desc);
	  	$('#comb_orde').val(orden);
	  	$('#comb_pre').val(prec);
	  	$('#obs_combo').val(obs);
	  	clas = clas.replace("atr_", "");
	  	getcombos('id='+id,clas);
	 }

});

function editcbo(clas)
{
	if(clas.trim().length)
	{
		var oldcant = 0;
	  	var idplcbo = 0;
	  	var i = 0;

	  	var clase = '';
	  	var orden = 0;
	  	var idtpl = 0;
	  	var idnom = '';
	  	var trult = '';
		var es = '';
		var tu_i = '';
		var cant = $('#form_combos .number-spinner .esticuenta').val();
//alert('clas->'+clas);
	  	$('table.contcombos').each(function (za, axe){
	  		oldcant = $(axe).find('thead tr.notocar th.cantcombo h3 b.cantplatos').html(); 
	  		oldcant = oldcant > 0 ? oldcant*cant : 0;
	  		$(axe).find('thead tr.notocar th.cantcombo h3 b.cantplatos').html(oldcant);
	  		idplcbo = $(axe).attr('idpartescombo'); //alert('idplcbo->'+idplcbo+' clas->'+clas)
	  		$(axe).find('thead tr.a_d_d_art').hide();
	  		$(axe).find('thead .escoge').hide();
	  		tu_i = $(axe).find('tbody tr td table.ordlista tbody');
	  		tu_i.html('');
	  		$('#lista tbody	 tr.'+clas+' table.dethijo tbody tr.tr_lista').each(function (z, ax){
	  			if($(ax).attr('idpartescombo') == idplcbo)
	  			{
	  				clase = $(ax).attr('class');// alert(orden)
	  				orden = $(ax).attr('orden');
	  				idtpl = $(ax).attr('idpartescombo');
	  				idnom = 'cbo'+$(ax).attr('id');
	  				trult = '<tr idpartescombo="'+idtpl+'" orden="'+orden+'" class="'+clase+'" id="'+idnom+'">'+$(ax).html()+'</tr>';
	  				tu_i.append(trult);
	  			}	  			
	  		});
	  		i = 0;
	  		$(axe).find('tbody tr td.actions a').removeClass('hide');	  		
	  	});
	}
}
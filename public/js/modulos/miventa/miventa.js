$('table tbody tr.tr_detalle:eq(0) td span').css({'font-weight':'bold'});
if(parseInt($('#estadospedidx').val()))
{
	swal({
    title: 'Error',
    text: 'Configurar los estados del pedido',
    type: 'error',
    showConfirmButton:false,
    allowOutsideClick: false
    });
}
$(document).on('click', '.mospiso', function (e)
{
	$('#todameza').html('');
	$('#todameza').addClass('collapse');
	$('#todazona').removeClass('collapse');
	ver_aver(2);
	limpdescmesas();
	$('.addmasarti').show();
	$('#detalle tbody').not( "table.dethijo tbody" ).find('tr td.actions a').show();

	cambiar(2);
});

$(document).on('click', '.mosmesa', function (e)
{
  	var id = parseInt($(this).attr('id'));
  	id = id > 0 ? id : 0;
  	var temp = "es_editable="+$('#edta').val()+"&es_visible="+$('#visb').val();

  	if(id>0)
  	{
  		temp = temp+'&id_zonam='+id;
	    $.ajax({
	        url: $('base').attr('href') + 'miventa/infomesas',
	        type: 'POST',
	        aSync: false,
	        data: temp,
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

function infovalores(temp, tipo)
{
	var e_s_t = ' div'
  	var e_t = tipo == '4' ? tipo+e_s_t : tipo; //alert(e_t)
  	var exp = '';
  	for (var i = tipo; i < 5; i++) {
		exp = (tipo == 4) ? tipo+e_s_t : tipo;
			$('div#cont'+exp).html('');
	}

	$('h4.panel-title a').attr({'aria-expanded':'false'});
  	$('.panel-collapse').removeClass('in');
  	$('.panel-collapse').attr({'aria-expanded':'false'});
  	$('.panel-collapse').attr({'style':'height: 0px;'});

  	$('a#a_id_'+tipo).attr({'aria-expanded':'true'});
  	$('div#collapse'+tipo).addClass('in');
  	$('div#collapse'+tipo).attr({'aria-expanded':'true'});
  	$('div#collapse'+tipo).attr({'style':''});

    $.ajax({
        url: $('base').attr('href') + 'miventa/infovalores',
        type: 'POST',
        data: temp,
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

$(document).on('click', '.tusvalores', function (e)
{
  	var id = parseInt($(this).attr('idtu'));
  	var tipo = parseInt($(this).attr('tipo'));
  	id = id > 0 ? id : 0;
  	tipo = tipo > 0 ? (tipo + 1) : 0;

  	$(this).parents('.panel-body').find('a').removeClass('btn-primary');
  	$(this).parents('.panel-body').find('a').addClass('btn-info');
  	$(this).addClass('btn-primary');
  	$('table#lista tfoot tr td.total span').html('');
  	if(id>0)
  	{
		infovalores('id='+id+'&estipo='+tipo, tipo);
  	}
});

$(document).on('click', '.addmasarti', function (e)
{
	cargardescmesas();
	var id = parseInt($(this).attr('idtu')); //alert(id)
  	var tipo = parseInt($(this).attr('tipo'));
  	id = id > 0 ? id : 0;
  	tipo = tipo > 0 ? (tipo + 1) : 0;
	if(id>0)
  	{
  		$('#collapse1 cont1 a').removeClass('btn-primary');
	  	$('#collapse1 cont1 a').addClass('btn-info');
	  	$('#hasclik_'+id).addClass('btn-primary');
		infovalores('id='+id+'&estipo='+tipo, tipo);

		$('.informacion .nuevobuttom button b').html($('.informacion .nuevobuttom ul li').eq(0).html());
    	$('.informacion .nuevobuttom ul li').removeClass('active');
    	$('.informacion .nuevobuttom ul li').eq(0).addClass('active');
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
				$($('#tb_tipocombo_'+idptc+' tbody tr td table.orddetalle tr.tr_detalle td.cantidad span')).each(function (inx, vax){
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

	if(btn.parents('form').attr('id') == "form_cantidadprecuenta")
	{
		var max = parseInt($('#viene_precant').val());
		max = max > 0 ? max : 0; //alert(max)
		var sum = val;
		sum = (btn.attr('data-dir') == 'up') ? sum+1 : sum-1; //alert(sum);
		/*var viene = parseInt($('#viene_comb').val());
		viene = viene > 0 ? viene : 0;*/
		
		if(max<sum)
		tuva = false;

		if(!tuva)
			alerta('Error','La cantidad es mayor a '+val,'error');
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
	  		$(ti_is.parents('table.contcombos').find('tbody tr td table.orddetalle tr.tr_detalle td.cantidad span')).each(function (ix, vx){
	  			cnt = parseInt($(vx).html())
	  			cnt = cnt > 0 ? cnt : 0;
	  			sum = cnt + sum;
	  		});
	  		//alert(tui+' '+sum)
	  		if(tui>sum)
	  		{
	  			ti_is.parents('table.contcombos').find('thead tr.a_d_d_art').show();
	  			ti_is.parents('table.contcombos').find('thead tr.notocar').show();
	  		}
	  		else
	  		{
	  			ti_is.parents('table.contcombos').find('thead tr.a_d_d_art').hide();
	  			ti_is.parents('table.contcombos').find('thead tr.notocar').hide();
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
	var padre = $(this);
	$('h1.cart__title small').html(padre.html());
	cargardescmesas();
	var id = padre.attr('idmesa');
	var idzonam = padre.attr('idzonam');
	var idpedido = parseInt(padre.attr('idpedido'));
	var esvisible = parseInt(padre.attr('esvisible'));
	var eseditable = parseInt(padre.attr('eseditable'));

	idpedido = idpedido > 0 ? idpedido : 0;
 	var num = idpedido > 0 ? 1 : 2;
 	$('table#lista tfoot tr td.total span').html('');
 	var iduser = parseInt($('#iduser').val());
 	var edta = parseInt($('#edta').val());
 	var html = '<h2 class="text-center text-success">No hay clientes</h2>';
 	
 	cambiar(2);
 	if(esvisible > 0)
 	{
		if(idpedido > 0)
		{
			var estado = "";
			var iielm = 0;
			var temp = "&es_visible="+$('#visb').val();
			var codecli = 0;

			$.ajax({
		        url: $('base').attr('href') + 'miventa/getpedido',
		        type: 'POST',
		        data: 'id_pedido='+idpedido+temp,
		        dataType: "json",
		        beforeSend: function() {
		            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
		        },
		        success: function(response) {
		        	if(response.send != null)
		        		iielm = parseInt(Object.keys(response.send).length);
		        	//alert(Object.keys(response.send).length)
		        	estado = response.estadopedido
		        	codecli = parseInt(response.codeallclie);
		        	$('.informacion .nuevobuttom').attr({'estado':estado});
		        	$('#cabecera #form_save_pedido input.numpedido').val(response.codigo);
		        	$('#cabecera #form_save_pedido input.fechacreacion').val(response.fecha_i);
		        	$('#cabecera #form_save_pedido input.horacreacion').val(response.hora_i);
		        	

		        	if(codecli == 2)
		        	{
		        		html = ''
		        		$.each( response.allclie, function( ident, vv ){
		        			html = html + '<div class="form-group" idcli="'+ident+'" tb="div_'+ident+'">'+
                                '<label for="busc_cliee" class="control-label col-md-2 col-sm-2 col-xs-12"><a href="javascript:void(0);" class="quitarcliente"><i class="fa fa-remove fa-2x"></i></a></label>'+
                                '<div class="col-md-10 col-sm-10 col-xs-12">'+
                                    '<input id="clix_'+ident+'" type="text" class="form-control" value="'+vv+'" name="clientx" aria-describedby="hora" placeholder="Cliente 1">'+
                                '</div>'+
                            '</div>';
		        		});
		        		cboclientes(response.allclie);
		        	}
		        	$('#cabecera #form_save_pedido #aqui_clientes').html(html);
		        	if(iielm)
		        	{
			        	$('.savedetalle').removeClass('disabled');
			        	var isu = parseInt(response.id_usuario_creado);
		        		$('.addmasarti').show();
		        		var este = false;
			        	var det = '';
			        	$('.informacion .nuevobuttom button b').html(response.nomb);
			        	$('.informacion .nuevobuttom ul li').removeClass('active');
			        	$('.informacion .nuevobuttom ul li').eq(0).addClass('active');

			        	$('#all_mesas').html(response.all_mesas);
            			$('#tb_totales').html(response.all_tbs);

			        	$.each( response.send, function( ident, vv ){
			        		ident = ident.replace("es_", ''); //alert(ident)
			        		switch(ident)
			        		{
			        			case 'lista':
					        		$('table#lista tfoot tr td.total span').html(response.pt);

					            	det = response.lista;
			        			break;

			        			case 'detalle':
			        				$('#form_detalle input.id_pedido').val(response.id_pedido);
					            	$('#form_detalle input.id_mesam').val(response.id_mesam);
					            	$('#form_detalle input.id_zonam').val(response.id_zonam);

					        		det = response.detalle;
					        		este = true;
			        			break;

			        			case 'estados':
			        				det = response.estados;
			        			break;

			        			case 'horarios':
			        				det = response.horarios;
			        			break;

			        			case 'consolidado':
			        				det = response.consolidado;
			        				$('table#consolidado tfoot tr td.total span').html(response.pt);

			        			break;

			        			case 'usuario':
			        				det = response.usuario;
			        			break;

			        			case 'precuenta':
			        				det = response.precuenta;
			        			break;

			        			case 'default':
			        			break;
			        		}

			        		if(vv.length)
			        		{	//alert(ident+'<-  tu->'+vv+' cant->'+vv.length)
			        			$('#'+ident).addClass('collapse');
							}
			        		else
			        		{
			        			$('#'+ident).removeClass('collapse');
			        		}
			        		//alert('#'+ident+' tbody');

			        		$('#'+ident+' tbody').html(det); 
				        });
		        		
		        		if(este)
		        		{
		        			$('#detalle tbody').not( "table.dethijo tbody" ).find('tr td.actions a').show();
			        		$( "table.dethijo tbody tr td.actions a").hide();
			        		if(eseditable < 1)
			        		{
			        			$('.addmasarti').hide();
		        				$('#detalle tbody').not( "table.dethijo tbody" ).find('tr td.actions a').hide();
		        				$('.savedetalle').addClass('disabled');
			        		}
		        		}		        		

		        		ver_aver(1);

		        		if(idpedido >0 )
		        		openCart();
		        		$('#modalmiventa').modal('hide');
	        		}
	        		else
	        		{
	        			alerta('Agregar Vistas');
	        		}

		        },
		        complete: function() {
		        	$.LoadingOverlay("hide");
		        }
		    });
		}
		else
		{
			$('#form_detalle input.id_mesam').val(id);
			$('#form_detalle input.id_zonam').val(idzonam);
			openCart();
			$('#modalmiventa').modal('hide');
		}
	}
	else
	{
		alerta('No tiene Permisos de Visualización');
	}
});

function cboclientes(arry)
{
	var cbo = '';

	$.each( arry, function( ident, vv ){
		cbo = cbo + '<li  id="licliente_'+ident+'" class=""><a idclie="'+ident+'" class="cambiarcli" href="javascript:void(0);">'+vv+'</a></li>';
	});

	$('.impresion .nuevobuttom ul').html(cbo);
	$('.impresion .nuevobuttom ul li').removeClass('active');
	$('.impresion .nuevobuttom ul li').eq(0).addClass('active');
	var newnmb = $('.impresion .nuevobuttom ul li.active a').html();
	newnmb = (parseInt(newnmb.length) > 12) ? newnmb.substr(0,12)+'...' : newnmb;
	$('.impresion .nuevobuttom button b').html(newnmb);
}

function sumarsubtotal()
{
	var tot = 0;
	var sb = 0;
	$('table#lista tbody tr td.subtotal').each(function (index, value){
		sb = parseFloat($(this).html());
		sb = sb > 0 ? sb :0;
		tot = tot + sb;
	});
	tot = (tot>0) ? (tot.toFixed(2)) : ('0.00');
	$('table#lista tfoot tr td.total span').html(tot);
}

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
		var tu_i = $('#lista tbody').eq(0);
		html = '<tr orden="'+orden+'" class="tr_lista" id="tr_'+orden+'_'+id+'">'+
					'<td class="cantidad"><span class="font-weight-bold">'+cant+'</span>'+
					'</td>'+
					'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left font-weight-bold">'+nomb+'</p></div></div>'+
					'</td>'+
					'<td class="precio">'+pre+'</td>'+
					'<td class="subtotal" class="text-center subtotal">'+sub+'</td>'+
				'</tr>';

		var es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);
		
		html = '<tr orden="'+orden+'" class="tr_detalle" id="atr_'+orden+'_'+id+'">'+
					'<td class="cantidad"><span class="font-weight-bold">'+cant+'</span>'+
						'<input value="'+orden+'" name="cantidad['+orden+']['+id+']" type="hidden" class="cantidad">'+
						'<input value="0" name="id_pedido_det['+orden+']['+id+']" type="hidden" class="id_pedido_det">'+
					'</td>'+
					'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left font-weight-bold">'+nomb+'</p></div></div>'+
						'<input value="'+id+'" name="id_art_sucursal['+orden+']['+id+']" type="hidden" class="id_art_sucursal">'+
						'<input value="'+nomb+'" name="descripcion['+orden+']['+id+']" type="hidden" class="descripcion">'+
						'<input value="" name="id_atributos['+orden+']['+id+']" type="hidden" class="idatributos">'+
						'<input value="'+pre+'" name="precio['+orden+']['+id+']" type="hidden" class="precio">'+
						'<input value="1" name="id_esatribcomb['+orden+']['+id+']" type="hidden" class="idesatribcomb">'+
						'</td>'+
					'<td class="abreviatura"><span> class="font-weight-bold"</span>'+'</td>'+
					'<td class="obs"><span class="font-weight-bold">'+obs+'</span>'+
						'<input value="'+obs+'" name="observacion['+orden+']['+id+']" type="hidden" class="observacion">'+
					'</td>'+
					'<td class="actions"><a href="javascript:void(0);" class="btn btn-warning btn-xs editarti"><i class="fa fa-refresh"></i></a><a href="javascript:void(0);"  class="btn btn-danger btn-xs elimina"><i class="fa fa-trash-o"></i></a></td>'+
				'</tr>';
		tu_i = $('#detalle tbody');
		if(parseInt(tu_i.length) > 1)
		{
			tu_i = tu_i.eq(0);
		}
		es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);
		openCart();
		validabuttonsadetalle();
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
	$('#form_combos input.esticaja').val(1); //alert(va)
	$('#form_combos button.savecombo').hide();

  	$('#viene_comb').val(1);

  	var orden = 0;
  	if($('#detalle tbody tr.tr_detalle').length)
  	{
  		orden = parseInt($('#detalle tbody tr.tr_detalle:last').attr('orden'));
  		orden = orden > 0 ? orden : 0;
  	}
  	orden++;
  	var id = $(this).attr('idtu');
  	var desc = $(this).html();
  	if($(this).parents('td.addacciones').length)
  	{
  		desc = $(this).parents('tr').find('td.desc').html();
  	}  	
  	
  	$('#addcombo .modal-content .modal-header h4').html(desc);


  	$('#comb_id_artixsuc').val(id);
  	$('#comb_desc').val(desc);
  	$('#comb_orde').val(orden);
  	$('#comb_pre').val($(this).attr('precio'));
  	$('#comb_pre_uni_axu').val($(this).attr('precio'));
  	var temp = "";
  	getcombos('id='+id);
});

function getcombos(temp, clas = '')
{
	$('#form_combos button.estibutton').prop( "disabled", false );
	$('#es_combopreciovariable').val('');
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
            	if(parseInt(response.data.es_cbxv) == 1)
            	{
            		$('#form_combos button.estibutton').prop( "disabled", true );
            		$('#es_combopreciovariable').val(response.data.es_cbxv);
            	}
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
	var temp = "&es_visible="+$('#visb').val();
	$.ajax({
        url: $('base').attr('href') + 'miventa/ver_bandeja',
        type: 'POST',
        data: $('#form_detalle').serialize()+temp,
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
	$('ul#tabs a[href="#tab_conti2"]').tab('show');
	var idped = parseInt($('#form_detalle input.id_pedido').val());
	var estado = "";
	if(idped)
	{
		estado = $('.informacion .nuevobuttom').attr('estado');
	}
	$('#form_save_pedido div.estadopedido').html(estado);
});

$(document).on('click', '.addarti', function (e)
{
  	$('#form_cantidad .number-spinner input').val(1);

  	$('#viene_cant').val(1);

  	var orden = 0;
  	if($('#detalle tbody tr.tr_detalle').length)
  	{
  		orden = parseInt($('#detalle tbody tr.tr_detalle:last').attr('orden'));
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
  	if($('#detalle tbody tr.tr_detalle').length)
  	{
  		orden = parseInt($('#detalle tbody tr.tr_detalle:last').attr('orden'));
  		orden = orden > 0 ? orden : 0;
  	}
  	orden = orden + 1;
  	//alert(orden)
  	var desc = $(this).html();
  	if($(this).parents('td.addacciones').length)
  	{
  		desc = $(this).parents('tr').find('td.desc').html();
  	}
  	$('#addatrib .modal-content .modal-header h4').html(desc);

  	$('#atrib_id_artixsuc').val(id);
  	$('#atrib_desc').val(desc);
  	$('#atrib_orde').val(orden);
  	$('#atrib_pre').val($(this).attr('precio'));
  	$('#atrib_es').val(1);

  	var id_es_adic = parseInt($(this).attr('esadicional'));
  	getcombos('id='+id)
  	$('#addatrib .tabla_adicional').addClass('collapse');

 	getatributos('id='+id, 'total_atributos')
  	
});

function getatributos(temp, div = '')
{
	div = (div.trim().length) ? div : '';
	$('#'+div).html(''); //alert(div)
    $('#'+div+' .tu_adicional').html('');
    var atrib_comb = parseInt($('#atrib_comb').val());
    atrib_comb = atrib_comb > 0 ? atrib_comb : 0;
    
	$.ajax({
        url: $('base').attr('href') + 'miventa/getatributos',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
        	$('#'+div).html(response.data.info);
        	if(div == "total_atributos" && atrib_comb == 0 )
        	{
        		$('#addatrib .tu_adicional').html(response.data.adicional);
        	}
        	else
        	{
        		//$('#addatrib .tu_adicional').html('');
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
	var col = 0;
	var html = ''; 
	var tb = $('#detalle tbody');
	var tes = parseInt(tis);
	tes = tes > 0 ? tes : 0;
	if(tes>0)
	{
		tb = $('#tb_tipocombo_'+tes+' tbody tr td table.orddetalle tbody');
	}

	var parte1 = "<tr><td colspan='";
	var parte2 = "'><p class='cart__empty js-cart-empty'>Agregar Articulo</p></td></tr>"
    
	var tipo = "";

	$('.informacion .nuevobuttom ul li').removeClass('active');
	$('.informacion .nuevobuttom ul li').eq(0).addClass('active');
	$('.informacion .nuevobuttom button b').html($('.informacion .nuevobuttom ul li.active a').html());

	$('.informacion .nuevobuttom ul li a').each(function (index, value){
		tipo = $(value).attr('tipo');
		switch(tipo)
		{
			case 'lista':
				col = 4;
				$('#'+tipo+' tfoot tr td.total span').html('');
			break;

			case 'detalle':
				col = 5;
			break;

			case 'estados':
				col = 2;
			break;

			case 'horarios':
				col = 4;
			break;

			case 'consolidado':
				col = 4;
				$('#'+tipo+' tfoot tr td.total span').html('');
			break;

			case 'usuario':
				col = 4;
			break;

			default:
			break;
		}
		html = parte1+col+parte2;
		$('#'+tipo+' tbody').html(html);
	});
}

$(document).on('click', '.nuevopedido', function (e)
{
	closeCart();
  	$('#form_detalle input.id_mesam').val('0');
  	$('#form_detalle input.id_zonam').val('0');
  	$('#form_detalle input.id_pedido').val('0');
	agregararticulo();
  	$("#modalmiventa").modal();
  	limpdescmesas();
  	$('#todameza').addClass('collapse');
	$('#todazona').removeClass('collapse');
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
	var pref = $(this).attr('tipo');
	pref = pref.length > 0 ? 'adic_' : '';

	var form = pref.length > 0 ? 'adicionales' : 'atributos';

	var cant = $('#form_'+form+' .number-spinner input').val(); //alert(cant)
	var viene = parseInt($('#'+pref+'viene_atrib').val());
	var nomb = $('#'+pref+'atrib_desc').val();
	var id  = $('#'+pref+'atrib_id_artixsuc').val();
	var pre  = $('#'+pref+'atrib_pre').val();
	var preadic  = $('#'+pref+'atrib_pre_adic').val();
	var orden = $('#'+pref+'atrib_orde').val();
	var esatrib = parseInt($('#'+pref+'atrib_es').val());
	var escbo = parseInt($('#'+pref+'atrib_comb').val());
	var obs = $('#'+pref+'obs_atributos').val(); //alert(obs)

	var cob_id_arti = $('#comb_id_artixsuc').val();

	escbo = (escbo > 0) ? escbo : 0;
	orden = orden > 0 ? orden : 1;

	var html = "";

	var sub = cant*pre;
	sub = (sub>0) ? (sub.toFixed(2)) : ('0.00');
	esatrib = (esatrib > 0) ? esatrib : 0;

	var idatrib = get_joinids(pref+'total_atributos');
	var abrev = get_abreviatura(pref+'total_atributos');//alert(abrev)
	var clas = '';
	var clashtml = (escbo > 0) ? ' idpartescombo="'+escbo+'"' : '';
	if(escbo >0)
	{
		$('#tb_tipocombo_'+escbo+' tbody table.orddetalle').removeClass('collapse');
	}
	var id_esatribcomb = ($('div.tabla_adicional table.contadicionales tbody tr.tr_detalle').length) ? 5 : 2;

	var htmlhijo = '';
	var htmadici = '';
	var ad_cant = '';
	var ad_desc = '';
	var ad_prec = '';
	var ad_tota = '';

	if($('div.tabla_adicional table.contadicionales tbody tr.tr_detalle').length && pref == '')
	{
		$('div.tabla_adicional table.contadicionales tbody tr.tr_detalle td.actions a').addClass('hide');
		$('div.tabla_adicional table.contadicionales tbody tr.tr_detalle').each(function (zi, axo){
			//alert($(axo).attr('id'))
			newid = $(axo).attr('id');
			ord_e = $(axo).attr('orden');
			ad_cant = $(axo).find('td.cantidad span').html();
			ad_desc = $(axo).find('td.articulo div.row div.col-sm-12 p').html();
			ad_prec = parseFloat($(axo).find('td.articulo input.precio').val());
			ad_tota = parseFloat(ad_cant*ad_prec);
			ad_tota = ad_tota > 0 ? ad_tota.toFixed(2) : '0.00';
			ad_prec = ad_prec > 0 ? ad_prec.toFixed(2) : '0.00';

			newid = newid.replace("addici", ""); //alert(newid);
			$(axo).attr({'id':newid});
			newid = newid.replace("a", ""); //alert(newid);
			htmadici = htmadici+'<tr orden="'+ord_e+'" class="tr_lista" id="'+newid+'">'+
									'<td class="cantidad"><span class="font-weight-bold">'+ad_cant+'</span></td>'+
									'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left font-weight-bold">'+ad_desc+'</p></div></div></td>'+
									'<td class="precio">'+ad_prec+'</td>'+
									'<td class="subtotal">'+ad_tota+'</td>'+
								'</tr>';
		});
		htmlhijo = $('div.tabla_adicional table.contadicionales tbody').html();
	}

	switch( viene )
	{
		case 1:
		case 3:
		case 5:
			var htmlpadre = '';
			tu_i = $('#detalle tbody');

			if(viene == 1)
			{
				html = '<tr orden="'+orden+'" class="tr_lista" id="tr_'+orden+'_'+id+'">'+
							'<td class="cantidad"><span class="font-weight-bold">'+cant+'</span>'+
							'</td>'+
							'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left font-weight-bold">'+nomb+'</p></div></div>'+
							'</td>'+
							'<td class="precio">'+pre+'</td>'+
							'<td class="subtotal" class="text-center subtotal">'+sub+'</td>'+
						'</tr>';
				if(parseInt(htmlhijo.length)>0)
				{
					html = html + '<tr class="'+orden+'_'+id+'" id="adicionatr_'+orden+'_'+id+'">'+
								'<td colspan="5" bgcolor="#ffffff">'+
									'<table class="dethijo" bgcolor="#ffffff" width="100%"><thead><tr><th style="width:10%"></th><th style="width:56%"></th><th style="width:12%"></th><th style="width:22%"></th></tr></thead><tbody>'+htmadici+'</tbody></table>'+
								'</td>'
							'</tr>'
				}
			}
			else if(viene==3)
			{
				id_esatribcomb = 4;
				clas = (escbo > 0) ? 'cbo' : '';
				var ordpad = $('#comb_orde').val();
				htmlpadre = '<input value="'+cob_id_arti+'" name="id_artipadre['+orden+']['+id+']" type="hidden" class="idpadre">'+
							'<input value="'+escbo+'" name="id_partescombo['+orden+']['+id+']" type="hidden" class="idpartescombo">'+
							'<input value="'+ordpad+'" name="id_ordenpadre['+orden+']['+id+']" type="hidden" class="id_ordenpadre">';
			}
			else if(viene==5)
			{
				clas = 'addici';
				id_esatribcomb = 6;
				cob_id_arti = parseInt($('#atrib_id_artixsuc').val());
				ordpad = $('#atrib_orde').val();
				htmlpadre = '<input value="'+cob_id_arti+'" name="id_artipadre['+orden+']['+id+']" type="hidden" class="idpadre">'+
							'<input value="'+escbo+'" name="id_partescombo['+orden+']['+id+']" type="hidden" class="idpartescombo">'+
							'<input value="'+ordpad+'" name="id_ordenpadre['+orden+']['+id+']" type="hidden" class="id_ordenpadre">';
			
			}
			else
			{

			}

			var es = (orden > 1) ? $('#lista tbody').not( "table.dethijo tbody" ).append(html) : $('#lista tbody').not( "table.dethijo tbody" ).html(html);

			html = '<tr'+clashtml+' orden="'+orden+'" class="tr_detalle" id="'+clas+'atr_'+orden+'_'+id+'">'+
						'<td class="cantidad"><span cnt="'+cant+'" class="font-weight-bold">'+cant+'</span>'+
							'<input value="'+cant+'" name="cantidad['+orden+']['+id+']" type="hidden" class="cantidad">'+
							'<input value="0" name="id_pedido_det['+orden+']['+id+']" type="hidden" class="id_pedido_det">'+
						'</td>'+
						'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left font-weight-bold">'+nomb+'</p></div></div>'+
							'<input value="'+id+'" name="id_art_sucursal['+orden+']['+id+']" type="hidden" class="id_art_sucursal">'+
							'<input value="'+nomb+'" name="descripcion['+orden+']['+id+']" type="hidden" class="descripcion">'+
							'<input value="'+idatrib+'" name="id_atributos['+orden+']['+id+']" type="hidden" class="idatributos">'+
							'<input value="'+pre+'" name="precio['+orden+']['+id+']" type="hidden" class="precio">'+
							'<input value="'+pre+'" name="precio_uni_axu['+orden+']['+id+']" type="hidden" class="precio_uni_axu">'+
							'<input value="'+preadic+'" name="precio_uni_adic['+orden+']['+id+']" type="hidden" class="precio_uni_adic">'+
							'<input value="" name="es_combopreciovariable['+orden+']['+id+']" type="hidden" class="es_combopreciovariable">'+
							'<input value="'+id_esatribcomb+'" name="id_esatribcomb['+orden+']['+id+']" type="hidden" class="idesatribcomb">'+htmlpadre+
						'</td>'+
						'<td class="abreviatura"><span class="font-weight-bold">'+abrev+'</span>'+'</td>'+
						'<td class="obs"><span>'+obs+'</span>'+
							'<input value="'+obs+'" name="observacion['+orden+']['+id+']" type="hidden" class="observacion">'+
						'</td>'+
						'<td class="actions"><a href="javascript:void(0);" class="btn btn-warning btn-xs editatrib'+clas+'"><i class="fa fa-refresh"></i></a><a href="javascript:void(0);" class="btn btn-danger btn-xs elimina"><i class="fa fa-trash-o"></i></a></td>'+
					'</tr>';

			if(viene == 3 && escbo>0)
			{
				tu_i = '#tb_tipocombo_'+escbo;
				orden = 0; 
				if($(tu_i+' tbody tr table.orddetalle tr.tr_detalle').length)
			  	{
			  		orden = parseInt($(tu_i+' tbody tr.tr_detalle:last').attr('orden'));
			  		orden = orden > 0 ? orden : 0;
			  	}
			  	orden++;
			  	tu_i = $(tu_i+' tbody tr table.orddetalle tbody');
				$("#addcombo").modal();
			}

			$('#'+pref+'addatrib').modal('hide');

			if(viene == 5)
			{
				var tu_i = '#'+$('#'+pref+'viene_adicionales').val();
				orden = 0;
				if($(tu_i+' table.contadicionales tr.tr_detalle').length)
			  	{
			  		orden = parseInt($(tu_i+' tbody tr.tr_detalle:last').attr('orden'));
			  		orden = orden > 0 ? orden : 0;
			  	}
			  	orden++;
			  	tu_i = $(tu_i+' table.contadicionales tbody');
			  	$('#addatrib').modal('show');
			  	limp_todo('form_adicionales');
			}
			else
			{
				openCart();
				if(viene == 1)
				{
					if(parseInt(htmlhijo.length)>0)
					{
						html = html + '<tr class="'+orden+'_'+id+'" id="adicionatr_'+orden+'_'+id+'">'+
									'<td colspan="5" bgcolor="#ffffff">'+
										'<table class="dethijo" bgcolor="#ffffff" width="100%"><thead><tr><th style="width:12%"></th><th style="width:50%"></th><th style="width:14%"></th><th style="width:14%"></th><th style="width:10%"></th></tr></thead><tbody>'+htmlhijo+'</tbody></table>'+
									'</td>'
								'</tr>'
					}
					$('#form_atributos .tabla_adicional .contadicionales tbody').html('');
					$('#form_atributos .tabla_adicional .contadicionales').hide();
					$('#form_atributos .tu_adicional').html('');

				}

			}

			es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);

			if(viene == 3 && escbo>0)
			{
				disabledaddcbo(escbo);
			}
			if(viene == 1)
			{
				validabuttonsadetalle();
				sumarsubtotal();
			}
				
		break;

		case 2:
		case 4:
		case 6:
		//alert(128+' viene->'+viene+' escbo->'+escbo)
			tu_i = '#detalle';
			if(viene == 4 && escbo>0)
			{
				clas = 'cbo';
				tu_i = '#tb_tipocombo_'+escbo+' tbody tr td table.orddetalle tbody';
				$("#addcombo").modal();
			}
			else if(viene == 6)
			{
				tu_i = '.contadicionales tbody';
				clas = 'addici';
			}
			else
			{
				$('tr#tr_'+orden+'_'+id+' td.subtotal').html(sub);
				sumarsubtotal();
			}
            //alert(tu_i+' tr#'+clas+'atr_'+orden+'_'+id+' cant->'+cant);
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

			$('#'+pref+'addatrib').modal('hide');
			if(viene == 6)
			{
				$('#addatrib').modal('show');
				limp_todo('form_adicionales');

				
			}
			if(viene==2)
			{
				$('#form_atributos .tabla_adicional .contadicionales tbody').html('');
				$('#form_atributos .tabla_adicional .contadicionales').hide();
				$('#form_atributos .tu_adicional').html('');
			}
		break;

		default:
		break;
	}
	limp_todo('form_'+form, pref+'total_atributos');
	if(viene > 0 && viene <3)
	$('.savedetalle').removeClass('disabled');
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

		if($(tu_i+' tbody tr td table.orddetalle tr.tr_detalle td.cantidad span').length)
	  	{
	  		$(tu_i+' tbody tr table.orddetalle tr.tr_detalle td.cantidad span').each(function (index, value){
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
	  		$(tu_i+' thead tr.notocar').hide();
	  	}
	  	else
	  	{
	  		$(tu_i+' thead tr.a_d_d_art').show();
	  		$(tu_i+' .escoge').show();
	  		$(tu_i+' thead tr.notocar').show();
	  	}
	  	tot = 0;

	  	$('#form_combos table thead tr.notocar th.cantcombo h3 b.cantplatos').each(function (es, zw){
			cnt = parseInt($(zw).html());
	  		tot = tot + cnt;
  		});

	  	var preuniaux = parseFloat($('#comb_pre_uni_axu').val());
	  	preuniaux = preuniaux > 0 ? preuniaux : 0;
	  	var preadic = 0;
	  	var sumpredic = 0;
		sum = 0;
  		$('#form_combos table tbody tr table.orddetalle tr.tr_detalle td.cantidad span').each(function (index, value){
			cnt = parseInt($(value).html());
	  		sum = sum + cnt;
	  		predic = parseFloat($(value).parents('tr.tr_detalle').find('td.articulo input.precio_uni_adic').val());
	  		predic = predic*cnt;
	  		predic = predic >0 ? predic : 0;
	  		sumpredic = sumpredic + predic; //alert(sumpredic)
  		});

  		if(tot == sum)
  		{
  			$('#form_combos button.savecombo').show();
  		}
  		else
  		{
  			$('#form_combos button.savecombo').hide();
  		}
  		preuniaux = preuniaux + sumpredic;
  		$('#comb_pre').val(preuniaux);
  		$('#comb_pre_uni_adic').val(sumpredic);
	}
}

function validabuttonsadetalle()
{
	if($('#detalle tbody tr.tr_detalle').length)
	{
		$('.savedetalle').removeClass('disabled');
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
  	var obs = $(this).parents('tr').find('td.obs span').html();
  	var id = parseInt($(this).parents('tr').find('td.articulo input.id_art_sucursal').val());
  	var temp = 'id='+id+'&atrib='+atrib;
	$('#form_atributos .number-spinner input').val(cant);
  	$('#addatrib .modal-content .modal-header h4').html(desc);
  	var clas = orden+'_'+id;

  	if(parseInt($('#adicionatr_'+clas).length))
  	{
  		var tu_i = $('div.tabla_adicional table.contadicionales tbody');
  		tu_i.html('');
  		$('#detalle tbody	 tr.'+clas+' table.dethijo tbody tr.tr_detalle').each(function (z, ax){
  			clase = $(ax).attr('class');	//alert(orden)
			orden = $(ax).attr('orden');
			idnom = 'addici'+$(ax).attr('id');
			trult = '<tr  orden="'+orden+'" class="'+clase+'" id="'+idnom+'">'+$(ax).html()+'</tr>';
			tu_i.append(trult);
  		});
  		$('div.tabla_adicional table.contadicionales tbody tr.tr_detalle td.actions a').removeClass('hide');
  		$('#form_atributos .tabla_adicional .contadicionales').show();

  	}

  	$('#atrib_id_artixsuc').val(id);
  	$('#atrib_desc').val(desc);
  	$('#atrib_pre').val(prec);
  	$('#atrib_orde').val(orden);
  	$('#atrib_atrib').val(atrib);
  	$('#atrib_es').val(1);
  	$('#atrib_comb').val(0);
  	$('#obs_atributos').val(obs);
  	getatributos(temp,'total_atributos')
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

	if(tis.parents('form#form_detalle').length)
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
					tis.parents('tr.tr_detalle').remove();
					if(tis.parents('form#form_detalle').length)
					{
						id2 = id.replace("atr_", "");
						tis.parents('tr.'+id2).remove();
					}
					$('#tb_tipocombo_'+idpadre+' thead tr.a_d_d_art').show();
					$('#tb_tipocombo_'+idpadre+' thead tr.notocar').show();
					$('#tb_tipocombo_'+idpadre+' thead .escoge').show();
					
					if($('#tb_tipocombo_'+idpadre+' tbody tr td table.orddetalle tbody tr').length) {}
					else {
						agregararticulo(idpadre); //alert(idpadre);
						$('#tb_tipocombo_'+idpadre+' tbody table.orddetalle').addClass('collapse');
					}					
				}
				else
				{   
					tis.parents('tr').remove();
					$('tr#'+res).remove();
					sumarsubtotal();
					if($('#detalle tbody tr.tr_detalle').length) {}
					else
					{
						agregararticulo();
					  	$('table#lista tfoot tr td.total span').html('');
					  	$('.savedetalle').addClass('disabled')
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
	$('.informacion .nuevobuttom li').removeClass('active');
	$(this).parents('li').addClass('active');
	$('.cart__products table').addClass('collapse');
	$('table#'+tipo).removeClass('collapse');
	$('table#'+tipo+' table.dethijo').removeClass('collapse');
	var txt = $(this).html();
	$(this).parents('.informacion .nuevobuttom').find('button b').html(txt);
});

$(document).on('click', '.savedetalle', function (e)
{
	var idme = parseInt($('#form_detalle input.id_mesam').val());
	var idzom = parseInt($('#form_detalle input.id_zonam').val());
	idme = idme > 0 ? idme : 0;
	idzom = idzom > 0 ? idzom : 0;
	var temp = "&es_visible="+$('#visb').val();
	var iielm = 0;
	//var eseditable = 1;
	if(idme > 0 && idzom > 0)
	{
		var estado = "";
		$.ajax({
	        url: $('base').attr('href') + 'miventa/save_pedido',
	        type: 'POST',
	        data: $('#form_detalle').serialize()+temp,
	        dataType: "json",
	        beforeSend: function() {
	            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
	        },
	        success: function(response) {
	        	$('#all_mesas').html(response.all_mesas);
            	$('#tb_totales').html(response.all_tbs);
	        	$('.informacion .nuevobuttom button b').html(response.nomb);
	        	$('.informacion .nuevobuttom ul li').removeClass('active');
			    $('.informacion .nuevobuttom ul li').eq(0).addClass('active');
			    if(response.send != null)
		        	iielm = parseInt(Object.keys(response.send).length);

		        estado = response.estadopedido
		        $('.informacion .nuevobuttom').attr({'estado':estado});

	        	if(iielm)
	        	{
		            $.each( response.send, function( ident, vv ){
		        		ident = ident.replace("es_", ''); 
		        		switch(ident)
		        		{
		        			case 'lista':
				            	det = response.lista;
				        		$('table#lista tfoot tr td.total span').html(response.pt);
		        			break;

		        			case 'detalle':
		        				$('#form_detalle input.id_pedido').val(response.id_pedido);
				            	$('#form_detalle input.id_mesam').val(response.id_mesam);
				            	$('#form_detalle input.id_zonam').val(response.id_zonam);
				        		det = response.detalle;
				        		este = true;
		        			break;

		        			case 'estados':
		        				det = response.estados;
		        			break;

		        			case 'horarios':
		        				det = response.horarios;
		        			break;

		        			case 'consolidado':
		        				det = response.consolidado;
		        				$('table#consolidado tfoot tr td.total span').html(response.pt);
		        			break;

		        			case 'usuario':
		        				det = response.usuario;
		        			break;

		        			case 'default':
		        			break;
		        		}

		        		if(vv.length)
		        		{	//alert(ident+'<-  tu->'+vv+' cant->'+vv.length)
		        			$('#'+ident).addClass('collapse');
						}
		        		else
		        		{
		        			$('#'+ident).removeClass('collapse');
		        		}
		        		//alert('#'+ident+' tbody');

		        		$('#'+ident+' tbody').html(det); 
			        });
	        		
	        		/*if(este)
	        		{
	        			$('#detalle tbody').not( "table.dethijo tbody" ).find('tr td.actions a').show();
		        		$( "table.dethijo tbody tr td.actions a").hide();
		        		if(eseditable < 1)
		        		{
		        			$('.addmasarti').hide();
	        				$('#detalle tbody').not( "table.dethijo tbody" ).find('tr td.actions a').hide();
	        				$('.savedetalle').addClass('disabled');
		        		}
	        		}*/
	        	}

            	//agregararticulo();
              	//closeCart();
              	swal('Se Guardo con Exito')
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
  	if($('#detalle tbody tr.tr_detalle').length)
  	{
  		orden = parseInt($('#detalle tbody tr.tr_detalle:last').attr('orden'));
  		orden = orden > 0 ? orden : 0;
  		//alert(orden)
  	}
	
	var aux = 0;
  	var sub = 0;
  	if($('table.orddetalle tbody tr.tr_detalle').length)
  	{  		
  		$('table.orddetalle tbody tr.tr_detalle').each(function (index, vx){
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
  	$('#atrib_pre_adic').val($(this).attr('precioadic'));
  	$('#atrib_orde').val(orden);
  	$('#atrib_atrib').val('')
  	$('#atrib_es').val(esatrib);
  	$('#atrib_comb').val($(this).parents('table').attr('idpartescombo'));
  	$('#idedit_comb').val('');

  	getatributos('id='+id, 'total_atributos')
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
  	$('#idedit_comb').val(tis.parents('tr.tr_detalle').attr('id'))
  	//alert(tis.parents('tr.tr_detalle').attr('id'));
  	$('#obs_atributos').val(obs)
  	getatributos(temp, 'total_atributos')
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
  		
  		$(ti_is.parents('table.contcombos').find('tbody tr td table.orddetalle tr.tr_detalle td.cantidad span')).each(function (id, va){
  			cnt = parseInt($(va).html());
  			cnt = cnt > 0 ? cnt : 0;
  			sum = cnt + sum;

  			ord = parseInt($(va).parents('tr.tr_detalle').attr('orden'));
  			ord = ord > 0 ? ord : 0;

  			if(ord > aux)
  			{
  				aux = ord; 
  				idult = $(this).parents('tr.tr_detalle').attr('id');
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

		$('table.orddetalle tbody tr.tr_detalle td.actions a').addClass('hide');
		$('table.orddetalle tbody tr.tr_detalle td.articulo p').addClass('vienecombo');
		$('table.orddetalle tbody tr.tr_detalle').addClass(idcbx);
		var oldipc = $('#'+idult).parents('table.contcombos').attr('idpartescombo');
		var new_u = idult.replace("cbo", "");

		var trult = '<tr idpartescombo="'+oldipc+'" orden="'+aux+'" class="tr_detalle '+idcbx+'" id="'+new_u+'">'+$('#'+idult).html()+'</tr>'
		$('#'+idult).remove(); //alert(trult);
		var cant = $('#form_combos .number-spinner input').val();
		var viene = parseInt($('#viene_comb').val()); //alert(viene)
		var nomb = $('#comb_desc').val();
		var pre  = parseFloat($('#comb_pre').val());
		pre = pre >0 ? pre.toFixed(2) : 0;
		var preaux = $('#comb_pre_uni_axu').val();
		var preadic = $('#comb_pre_uni_adic').val();

		var id_es_adic = $('#comb_es_adic').val();
		var es_cbxv = $('#es_combopreciovariable').val();
		
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
			$(axi).find('tbody tr td table.orddetalle tbody tr.tr_detalle').each(function (zi, axo){
				//alert($(axo).attr('id'))
				newid = $(axo).attr('id');
				newid = newid.replace("cbo", ""); //alert(newid);
				$(axo).attr({'id':newid});
			});
		});

		$('table.orddetalle tbody').each(function (index, vix){				
			htmlhijo = htmlhijo + $(vix).html(); //alert($(vix).html())
  		});

  		htmlhijo = htmlhijo + trult;

		switch( viene )
		{
			case 1:

				var tu_i = $('#lista tbody').not( "table.dethijo tbody" );
				html = '<tr orden="'+orden+'" class="tr_lista" id="atr_'+idcbx+'">'+
							'<td class="cantidad"><span class="font-weight-bold">'+cant+'</span>'+
							'</td>'+
							'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left font-weight-bold">'+nomb+'</p></div></div>'+
							'</td>'+
							'<td class="precio">'+pre+
							'</td>'+
							'<td class="subtotal" class="text-center subtotal">'+sub+'</td>'+
						'</tr>';

				var es = (orden > 1) ? tu_i.append(html) : tu_i.html(html);
//alert('entro')
				html = '<tr orden="'+orden+'" class="tr_detalle" id="atr_'+orden+'_'+id+'">'+
							'<td class="cantidad"><span cnt="'+cant+'" class="font-weight-bold">'+cant+'</span>'+
								'<input value="'+cant+'" name="cantidad['+orden+']['+id+']" type="hidden" class="cantidad">'+
								'<input value="0" name="id_pedido_det['+orden+']['+id+']" type="hidden" class="id_pedido_det">'+
								'<input value="'+id_es_adic+'" name="es_adicional['+orden+']['+id+']" type="hidden" class="es_adicional">'+
								'<input value="'+es_cbxv+'" name="es_combopreciovariable['+orden+']['+id+']" type="hidden" class="es_combopreciovariable">'+
							'</td>'+
							'<td class="articulo"><div class="row"><div class="col-sm-12"><p class="text-left font-weight-bold">'+nomb+'</p></div></div>'+
								'<input value="'+id+'" name="id_art_sucursal['+orden+']['+id+']" type="hidden" class="id_art_sucursal">'+
								'<input value="'+nomb+'" name="descripcion['+orden+']['+id+']" type="hidden" class="descripcion">'+
								'<input value="" name="id_atributos['+orden+']['+id+']" type="hidden" class="idatributos">'+
								'<input value="'+pre+'" name="precio['+orden+']['+id+']" type="hidden" class="precio">'+
								'<input value="'+preaux+'" name="precio_uni_axu['+orden+']['+id+']" type="hidden" class="precio_uni_axu">'+
								'<input value="'+preadic+'" name="precio_uni_adic['+orden+']['+id+']" type="hidden" class="precio_uni_adic">'+
								'<input value="3" name="id_esatribcomb['+orden+']['+id+']" type="hidden" class="idesatribcomb">'+htmlcbos+
							'</td>'+
							'<td class="abreviatura"><span class="font-weight-bold"></span>'+'</td>'+
							'<td class="obs"><span class="font-weight-bold">'+obs+'</span>'+
								'<input value="'+obs+'" name="observacion['+orden+']['+id+']" type="hidden" class="observacion">'+
							'</td>'+
							'<td class="actions"><a href="javascript:void(0);" class="btn btn-warning btn-xs editcbo"><i class="fa fa-refresh"></i></a><a href="javascript:void(0);" class="btn btn-danger btn-xs elimina"><i class="fa fa-trash-o"></i></a></td>'+
						'</tr>'+
						'<tr class="'+orden+'_'+id+'" id="hijoatr_'+orden+'_'+id+'">'+
							'<td colspan="5" bgcolor="#ffffff">'+
								'<table class="dethijo" bgcolor="#ffffff" width="100%"><thead><tr><th style="width:12%"></th><th style="width:50%"></th><th style="width:14%"></th><th style="width:14%"></th><th style="width:10%"></th></tr></thead><tbody>'+htmlhijo+'</tbody></table>'+
							'</td>'
						'</tr>';
				tu_i = $('#detalle tbody tr#hijoatr_'+orden+'_'+id+' td table.dethijo tbody');
				es = (orden > 1) ? $('#detalle tbody').not( "table.dethijo tbody" ).append(html) : $('#detalle tbody').not( "table.dethijo tbody" ).html(html);
				//$('table.orddetalle tbody tr.tr_detalle td.actions a.btn-warning').removeClass('editatribcbo');
				

			break;
			case 2:
				tu_i = $('#detalle tbody tr#hijoatr_'+orden+'_'+id+' td table.dethijo tbody');
				tu_i.html(htmlhijo);
				tu_i = '#detalle tbody';
				$(tu_i+' tr#atr_'+orden+'_'+id+' td.cantidad span').html(cant);
				$(tu_i+' tr#tr_'+orden+'_'+id+' td.cantidad span').html(cant);

				$(tu_i+' tr#atr_'+orden+'_'+id+' td.obs span').html(obs);
				$(tu_i+' tr#atr_'+orden+'_'+id+' td.obs input').val(obs);
			break;
		}
		
		$("#addcombo").modal('hide');
		sumarsubtotal();
		limp_todo('form_combos','total_combos')
		$('.savedetalle').removeClass('disabled');
	}
	else
	{
		alerta('No Agrego','Verificar la cantidad de Articulos','error');
	}

});

$(document).on('click', '.editcbo', function (e)
{
	var tis = $(this);
	var pad = tis.parents('tr.tr_detalle');
	var id = parseInt(pad.find('td.articulo input.id_art_sucursal').val());
	id = id > 0 ? id : 0; //alert(id)
	$('#form_combos button.savecombo').show();

	var cant = parseInt(pad.find('td.cantidad input.cantidad').val());
	var desc = pad.find('td.articulo p').html();
	var orden = pad.attr('orden');
	var prec = pad.find('td.articulo input.precio').val();
	var precaux = pad.find('td.articulo input.precio_uni_axu').val();
	var precadic = pad.find('td.articulo input.precio_uni_adic').val();
	var es_cbxv = parseInt(pad.find('td.articulo input.es_combopreciovariable').val());
	var clas = pad.attr('id');
	var obs = pad.find('td.obs span').html();
	if(id > 0)
	{
		$('#addcombo').modal();
		$('#form_combos input.esticaja').val(cant);
	  	$('#viene_comb').val(2);
	  	$('#addcombo .modal-content .modal-header h4').html(desc);
	  	$('#comb_id_artixsuc').val(id);
	  	$('#comb_desc').val(desc);
	  	$('#comb_orde').val(orden);
	  	$('#comb_pre').val(prec);
	  	$('#comb_pre_uni_axu').val(precaux);
	  	$('#comb_pre_uni_adic').val(precadic);
	  	$('#es_combopreciovariable').val(es_cbxv);
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
		$('#total_combos table.orddetalle').removeClass('collapse');
		var cant = $('#form_combos .number-spinner .esticaja').val();
//alert('clas->'+clas);
	  	$('table.contcombos').each(function (za, axe){
	  		oldcant = $(axe).find('thead tr.notocar th.cantcombo h3 b.cantplatos').html(); 
	  		oldcant = oldcant > 0 ? oldcant*cant : 0;
	  		$(axe).find('thead tr.notocar th.cantcombo h3 b.cantplatos').html(oldcant);
	  		idplcbo = $(axe).attr('idpartescombo'); //alert('idplcbo->'+idplcbo+' clas->'+clas)
	  		$(axe).find('thead tr.a_d_d_art').hide();
	  		$(axe).find('thead tr.notocar').hide();
	  		$(axe).find('thead .escoge').hide();
	  		tu_i = $(axe).find('tbody tr td table.orddetalle tbody');
	  		tu_i.html('');
	  		$('#detalle tbody	 tr.'+clas+' table.dethijo tbody tr.tr_detalle').each(function (z, ax){
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


$(document).on('click', '#adic_addatrib .modal-dialog .modal-content .modal-header button.close', function (e)
{
	$("#addatrib").modal();
});

$(document).on('change', '#selec_desc', function (e)
{
	$("#adic_addatrib").modal({backdrop: "static"});
	$("#addatrib").modal("hide");
	$('#adic_viene_adicionales').val('addatrib');
	$('#adic_viene_atrib').val(5);
	var id = $(this).val();

	$("#selec_precio").val(id);
	$("#selec_atrib").val(id);

	$('#adic_addatrib .number-spinner input').val(1);

  	var orden = 0;
  	var vediv = '#adic_addatrib tbody tr.tr_detalle';

  	if($('#adic_addatrib tbody tr.tr_detalle').length) {}
  	else
  	{
  		vediv = '#detalle tbody tr.tr_detalle';
  	}

  	if($(vediv).length)
  	{
  		orden = parseInt($(vediv+':last').attr('orden'));
  		orden = orden > 0 ? orden : 0;
  	}
  	orden = orden + 1;
  	//alert(orden)
  	var desc = $( "#selec_desc option:selected" ).text();
  	$('#adic_addatrib .modal-content .modal-header h4').html(desc);

  	var prec = $( "#selec_precio option:selected" ).text();

  	$('#adic_atrib_id_artixsuc').val(id);
  	$('#adic_atrib_desc').val(desc);
  	$('#adic_atrib_orde').val(orden);
  	$('#adic_atrib_pre').val(prec);
  	$('#adic_atrib_es').val(1);

 	getatributos('id='+id, 'adic_total_atributos');
 	$('#addatrib .tabla_adicional').removeClass('collapse');
 	$('#addatrib .tabla_adicional').show();
});

$(document).on('click', '.editatribaddici', function (e)
{
	$("#adic_addatrib").modal({backdrop: "static"});
	$("#addatrib").modal("hide");

  	$('#adic_viene_atrib').val(6);

	var cant = parseInt($(this).parents('tr').find('td.cantidad span').html());
	var prec = parseInt($(this).parents('tr').find('td.articulo input.precio').val());
  	var atrib = $(this).parents('tr').find('td.articulo input.idatributos').val();
  	var orden = parseInt($(this).parents('tr').attr('orden'));
  	var desc = $(this).parents('tr').find('td.articulo p').html();
  	var id = parseInt($(this).parents('tr').find('td.articulo input.id_art_sucursal').val());
  	var obs = $(this).parents('tr').find('td.obs input').val();
  	var temp = 'id='+id+'&atrib='+atrib;
	$('#form_adicionales .number-spinner input').val(cant);
  	$('#adic_addatrib .modal-content .modal-header h4').html(desc);

  	$('#adic_atrib_id_artixsuc').val(id);
  	$('#adic_atrib_desc').val(desc);
  	$('#adic_atrib_pre').val(prec);
  	$('#adic_atrib_orde').val(orden);
  	$('#adic_atrib_atrib').val(atrib);
  	$('#adic_atrib_es').val(1);
  	$('#adic_atrib_comb').val(0);
  	$('#adic_obs_atributos').val(obs);
  	getatributos(temp,'adic_total_atributos')
});

function cargarcbox(temp, estipo)
{
	var div = '';
	var txt = '';
	var html = '';
		
	var iielm = 0;
	var tipo = parseInt(estipo);
	if(tipo < 1)
		tipo = 0;

	switch(tipo)
	{
		case 2:
			div = 'familia_busc';
			txt = 'Familia';
			$('#subfamilia_busc').html('');
		break;

		case 3:
			div = 'subfamilia_busc';
			txt = 'Sub Familia';
		break;

		case 4:
			div = "datatable-buttons tbody";
		
		break;

		default: break;
	}

	$.ajax({
        url: $('base').attr('href') + 'miventa/cargarcbox',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
        	if(response.data != null)
	        	iielm = parseInt(Object.keys(response.data).length);
	       	if(iielm)
	       	{
	       		if(tipo == 4)
	       		{
	       			var clas = " addatrib";
	       			var classe = "";
	       			var tarje = "";
	       			var v_v = 0;
	       			var esadi = 0;
	       			for(i in response.data) {
	       				classe = clas;
	       				if(parseInt(response.data[i].es_combo))
	       				{
	       					classe = " addcombo";
	       				}
	       				v_v = parseFloat(response.data[i].valor_v);
	       				if(v_v >0)
	       					v_v = v_v.toFixed(2);

	       				tarje = $.trim(classe);
			            html +="<tr>";
			            html +="<td class='desc'>"+response.data[i].val+"</td>";
			            html +="<td class='addacciones'><a href='javascript:void(0);' class='btn btn-info "+classe+" btn-xs' precio='"+v_v+"' data-toggle='modal' data-target='#"+tarje+"' idtu='"+response.data[i].id+"' class='btn btn-info"+classe+"' esadicional='"+response.data[i].es_adicional+"'><i class='fa fa-share-square'></i></a></td>";
			            html +="</tr>";
			        }
	       		}
	       		else
	       		{
	       			html = '<option value="">' + txt + '</option>';
	       			for(var key in response.data) {
			            html += "<option value=" + key  + ">" +response.data[key] + "</option>";
			        }				        
	       		}
	       		$('#'+div).html(html);
	       	}	        	
        },
        complete: function() {
	        $.LoadingOverlay("hide");
        }
    });
}

$(document).on('click', 'a.cargarcbox', function (e)
{
	var tis = $(this);
	var estipo = parseInt(tis.attr('estipo'));
	estipo = estipo > 0 ? estipo : 0;
	var id = 1;
    var temp = '';
	if(estipo > 0)
	{
		temp = 'estipo='+estipo+'&id='+id;
		var descripcion_busc = $('#descripcion_busc').val();

	  	if(descripcion_busc.trim().length)
		{
			temp +='&descripcion_busc='+descripcion_busc;
		}
		
		cargarcbox(temp,estipo)
	}
});

$(document).on('change', 'select.cargarcbox', function (e)
{
	var tis = $(this);
	var estipo = parseInt(tis.attr('estipo'));
	estipo = estipo > 0 ? estipo : 0;
	var id = parseInt(tis.val());
	id = id > 0 ? id : 0;
	var temp = 'estipo='+estipo+'&id='+id;

	if(estipo >0 && id >0)
	{	
		cargarcbox(temp,estipo)
	}
	else
	{
		$('#familia_busc').html('');
		$('#subfamilia_busc').html('');			
	}
});

function cambiar(tipo)
{
	var a = '';
	var b = '';
	var tip = parseInt(tipo);
	switch(tip)
	{
		case 1:
			a = 'impresion';
			b = 'informacion';
			break;

		case 2:
			a = 'informacion';
			b = 'impresion';
			break;

		default:
			break;
	}

	if($('aside div.'+a).length && $('aside div.'+b).length)
	{
		$('aside div.'+a).removeClass('collapse');
		$('aside div.'+b).addClass('collapse');
	}
	var idped = parseInt($('#form_detalle input.id_pedido').val());
	idped = idped > 0 ? idped : 0;
	if(idped > 0)
	{
		$.ajax({
	        url: $('base').attr('href') + 'miventa/getpedidoprecuenta',
	        type: 'POST',
	        data: 'id_pedido='+idped+'&tip='+tip,
	        dataType: "json",
	        beforeSend: function() {
	            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
	        },
	        success: function(response) {
	            if($('#precuenta').length)
            	{
            		$('#precuenta tbody').html(response.precuenta);
            	}
            	
            	if($('table#viewprecuenta').length)
            	{
            		$('#viewprecuenta tbody').html(response.viewprecuenta);
            		$('#viewprecuenta tfoot td.total span').html(response.pt);
            		$('#viewprecuenta').removeClass('collapse');
            	}
	        },
	        complete: function() {
	        	$.LoadingOverlay("hide");
	        }
	    });	
	}
			
}

$(document).on('click', 'a.printreport', function (e){
	cambiar($(this).attr('tipo'));
});

$(document).on('click', 'a.deletetprecu', function (e){
	swal({
		title: 'Estas Seguro?',
		text: "De Eliminar este Articulo",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí, estoy seguro!'
	}).then((result) => {
		if (result) {     
			$(this).parents('tr').remove();
		}
	});
});

$(document).on('click', 'a.addcantprecu', function (e){
	var tis = $(this); alert(123)
	var cant = parseInt(tis.html());
	var id = tis.parents('tr').attr('id');
	cant = cant > 0 ? cant : 0;
	$('#cantidadprecuenta').modal();
	if($('#'+id).length && cant >0)
	{
		$('#form_cantidadprecuenta #viene_precant').val(cant);
		$('#form_cantidadprecuenta #viene_idprecuentt').val(id);
	}
});

$(document).on('click', '#form_cantidadprecuenta a.savecantidadprecuenta', function (e){
	var id = $('#viene_idprecuentt').val(); alert(id)
	var cant = parseInt($('#form_cantidadprecuenta input.esticaja').val());
	cant = cant > 0 ? cant : 0;
	if(cant > 0)
	{
		$('#'+id+' td.cantidad a').html(cant);
		$('#cantidadprecuenta').modal('hide');
	}	
});

$(document).on('click', '.impresion a.saveprecuenta', function (e){
	var idcli = parseInt($('.impresion .nuevobuttom ul li.active a.cambiarcli').attr('idclie'));
    var idped = parseInt($('#form_detalle input.id_pedido').val());
    
    if(idcli > 0 && idped >0)
    {
		var temp = $('#form_precuenta').serialize()+'&id_pedido='+idped+'&id_cliente='+idcli;
		$.ajax({
	        url: $('base').attr('href') + 'miventa/saveprecuenta',
	        type: 'POST',
	        data: temp,
	        dataType: "json",
	        beforeSend: function() {
	            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
	        },
	        success: function(response) {
	            if (parseInt(response.error_code)==1) {	            	
	            	$('div#total_combos').html(response.data.info);
	            	if(parseInt(response.data.es_cbxv) == 1)
	            	{
	            		$('#form_combos button.estibutton').prop( "disabled", true );
	            		$('#es_combopreciovariable').val(response.data.es_cbxv);
	            	}
	            	if($('#viewprecuenta').length)
	            	{
	            		$('#viewprecuenta tbody').html(response.viewprecuenta);
	            		$('#viewprecuenta tfoot td.total span').html(response.pt);
	            	}
	            	if($('#precuenta').length)
	            	{
	            		$('#precuenta tbody').html(response.precuenta);
	            	}
	            }
	        },
	        complete: function() {
	        	$.LoadingOverlay("hide");
	        }
	    });
    }
});
var urlx = $('base').attr('href');
urlx = urlx.replace("/index", "");
$( document ).ready(function() {
	$('.demo2')
	    .colorpicker()
	    .on('change', function(e) { console.log('change'); })
	    .on('changeColor', function(e) { console.log('changeColor'); })
	    .on('hidePicker', function(e) { var tmp = 'pk='+$(this).parent('.col-md-6').find('input').attr('idpadre')+'&name=color&value='+e.color.toHex(); edit_estadopedidos(tmp); });

	$('#form_save_configpedido .editestado').editable({
	    url: urlx + 'miventacofig/edit_estadopedidos',
	    ajaxOptions: { type: 'post', dataType: 'json'},
	    title: 'Editar Estado'
	});
});


function edit_estadopedidos(temp)
{
	var uri = urlx +'miventacofig/edit_estadopedidos';

	$.ajax({
	    url: uri,
	    type: 'POST',
	    data: temp,
	    dataType: "json",
	    beforeSend: function() {
	        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
	    },
	    success: function(response) {
	        if (response.code==1) {
	        	//alert(1111)
	    	}
	    },
	    complete: function() {
	        $.LoadingOverlay("hide");
	    }
    });
}

function save_addestadopedidos(temp, add, remo)
{
	var uri = urlx+'miventacofig/save_addestadopedidos';
	$.ajax({
	    url: uri,
	    type: 'POST',
	    data: temp,
	    dataType: "json",
	    beforeSend: function() {
	      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
	    },
	    success: function(response) {
	        if (response.code==1) {
		        add.addClass('collapse');
		        remo.removeClass('collapse');
	    	}
	    },
	    complete: function() {
	        $.LoadingOverlay("hide");
	    }
    });
}

$(document).on('click', '.addestadopedidos', function (e) {
	var add = $(this);
	var remo = $('#form_save_configpedido div.divcolores');

	save_addestadopedidos('',add,remo);
});

$(document).on('click', '.btn_cancelar', function (e) {
	var remo = $('#form_save_configpedido .addestadopedidos');
	var add = $('#form_save_configpedido div.divcolores');

	save_addestadopedidos('estdox=1',add,remo);
});


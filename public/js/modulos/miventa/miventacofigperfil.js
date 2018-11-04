
$(document).on('change', '.perfrect', function (e)
{
  var padre = $(this);
  var idperf = parseInt(padre.attr('idperfil'));
  var idrecper = parseInt(padre.attr('idpedidoperfil'));
  var estado = (padre.is(':checked')) ? ("1"): ("0");
  //console.log(idperf);
  if(estado == 1)
  {
  		padre.parents('p').find('.probl').removeClass('collapse');
  }
  else
  {
  		padre.parents('p').find('.probl').addClass('collapse');
  }
  if(idperf>0)
  {
  		var temp = 'id_perfil='+idperf+'&estado='+estado;
  		editarfiltro(temp);
  }   
});

function editarfiltro(temp)
{
    $.ajax({
      url: $('base').attr('href') + 'miventacofig/save_perfpedido',
      type: 'POST',
      data: temp,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
}

$(document).on('change', '.probl', function (e)
{
	var padre = $(this);
	var idperf = parseInt(padre.attr('idperfil'));
	var tipo = padre.attr('tipo');
	var estado = (padre.is(':checked')) ? ("1"): ("0");
	if(idperf>0)
	{
	  	var temp = 'id_perfil='+idperf+'&estadox='+estado+'&tipo='+tipo;
	  	editarfiltro(temp);
	}
});

$(document).on('change', '.perfrectver', function (e)
{
  var padre = $(this);
  var idperf = parseInt(padre.attr('idperfil'));
  var idrecper = parseInt(padre.attr('idpedidoperfil'));
  var estado = (padre.is(':checked')) ? ("1"): ("0");
  //console.log(idperf);
  if(estado == 1)
  {
  		padre.parents('p').find('.problver').removeClass('collapse');
  }
  else
  {
  		padre.parents('p').find('.problver').addClass('collapse');
  }
  if(idperf>0)
  {
  		var temp = 'id_perfil='+idperf+'&estado='+estado;
  		editarfiltrover(temp);
  }   
});

function editarfiltrover(temp)
{
    $.ajax({
      url: $('base').attr('href') + 'miventacofig/save_perfpedidover',
      type: 'POST',
      data: temp,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
}

$(document).on('change', '.problver', function (e)
{
	var padre = $(this);
	var idperf = parseInt(padre.attr('idperfil'));
	var tipo = padre.attr('tipo');
	var estado = (padre.is(':checked')) ? ("1"): ("0");
	if(idperf>0)
	{
	  	var temp = 'id_perfil='+idperf+'&estadox='+estado+'&tipo='+tipo;
	  	editarfiltrover(temp);
	}
});

$(document).on('change', '.perfbandeja', function (e)
{
  var padre = $(this);
  var idperf = parseInt(padre.attr('idperfil'));
  var idrecper = parseInt(padre.attr('idpedidoperfil'));
  var estado = (padre.is(':checked')) ? ("1"): ("0");
  //console.log(idperf);
  if(estado == 1)
  {
  		padre.parents('p').find('.probandeja').removeClass('collapse');
  }
  else
  {
  		padre.parents('p').find('.probandeja').addClass('collapse');
  }
  if(idperf>0)
  {
  		var temp = 'id_perfil='+idperf+'&estado='+estado;
  		editarfiltrobandeja(temp);
  }   
});

function editarfiltrobandeja(temp)
{
    $.ajax({
      url: $('base').attr('href') + 'miventacofig/save_perfilbandejaentrada',
      type: 'POST',
      data: temp,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
}

$(document).on('change', '.probandeja', function (e)
{
	var padre = $(this);
	var idperf = parseInt(padre.attr('idperfil'));
	var tipo = padre.attr('tipo');
	var estado = (padre.is(':checked')) ? ("1"): ("0");
	if(idperf>0)
	{
	  	var temp = 'id_perfil='+idperf+'&estadox='+estado+'&tipo='+tipo;
	  	editarfiltrobandeja(temp);
	}
});

$(document).on('change', '.perfrectcolum', function (e)
{
  var padre = $(this);
  var idperf = parseInt(padre.attr('idperfil'));
  var idrecper = parseInt(padre.attr('idpedidoperfil'));
  var estado = (padre.is(':checked')) ? ("1"): ("0");
  //console.log(idperf);
  if(estado == 1)
  {
      padre.parents('p').find('.problcolum').removeClass('collapse');
  }
  else
  {
      padre.parents('p').find('.problcolum').addClass('collapse');
  }
  if(idperf>0)
  {
      var temp = 'id_perfil='+idperf+'&estado='+estado;
      editarfiltrocolum(temp);
  }   
});

function editarfiltrocolum(temp)
{
    $.ajax({
      url: $('base').attr('href') + 'miventacofig/save_perfpedidocolum',
      type: 'POST',
      data: temp,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
}

$(document).on('change', '.problcolum', function (e)
{
  var padre = $(this);
  var idperf = parseInt(padre.attr('idperfil'));
  var tipo = padre.attr('tipo');
  var estado = (padre.is(':checked')) ? ("1"): ("0");
  if(idperf>0)
  {
      var temp = 'id_perfil='+idperf+'&estadox='+estado+'&tipo='+tipo;
      editarfiltrocolum(temp);
  }
});
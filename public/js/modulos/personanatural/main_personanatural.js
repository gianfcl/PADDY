function direccionar()
{
  var contr = $('#url_modulo').val();
  var ment = $('#subtitle').val();
  var tabs = $('#myTab li.active').attr('tabs');
  var idss = $('#myTab li.active').attr('idss');
  var sub = $('#myTab li.active').attr('sub'); 
  var url = $('base').attr('href') +'/'+contr+'/'+ment+'/'+tabs+'/'+idss;
  if($('#miTab li.active').length)
  {
    url = $('#miTab li.active a').attr('href');
  }

  window.location.href = url;
}

/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/
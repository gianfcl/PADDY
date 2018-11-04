/*Validar Al Salir del Formulario*/
$(document).on('click', '#my_tab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/
$(document).on('click', '#myTab li.tab a', function (e) {
  var padre = $(this);
  var url = padre.attr('url');
  var ir = padre.html();
  var act = $('#myTab li.active a').html();
  if(url.length)
  {
    swal({
      title: 'Esta Seguro de Ir '+ir+' ?',
      text: "Saldrá de "+act,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!',
      allowOutsideClick:false
    }).then(function(isConfirm) {
      if (isConfirm) { 
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});    
        window.location.href = url;
      }
    });
  }
});

$(document).on('click', '#linkmodulo', function (e) {
  var padre = $(this);
  var url = padre.attr('url');
  $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});    
  window.location.href = url;
});
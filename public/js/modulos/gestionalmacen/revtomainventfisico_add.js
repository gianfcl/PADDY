$( document ).ready(function() {
	jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_tomainventfisico').validate({
    rules:
    {
			id_almacen: { required:true }
    },
    messages: 
    {
      id_almacen: { required:"Buscar y Seleccionar" }
    },      

    highlight: function(element) {
      $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
        if(element.parent('.col-md-4').length) { error.insertAfter(element.parent()); }
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'tomainventfisico/save_tomainventfisico',
        type: 'POST',
        data: $('#form_save_tomainventfisico').serialize(),
        dataType: "json",
        beforeSend: function(response) {
          $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            var va = $('#va').val();
            var url = $('#linkmodulo').attr('href');

            var uro = url;
            var title = "Toma de Inventario N°"+response.data.id;
            var num = parseInt(response.data.id);
            var estado = $('#estado').val();
            
            window.location.href = url;              
          }                   
        },
        complete: function(response) {
          $.LoadingOverlay("hide");
        }
      });
        
    }
  });

  $('a.mostrarcomentope').click(function() {
    $(this).popover({
        placement: 'left'
    }).popover('show');
  });

  $('a.editcomentrev').editable({
    container: 'body',
    url: $('base').attr('href') + 'revtomainventfisico/edit_comentario',
    ajaxOptions: { type: 'post', dataType: 'json'},
    title: 'Comentario',
    display: function(value) {
      var css = (value.trim().length) ? (' text-danger') : ('');
      $(this).html("<i class='fa fa-commenting fa-2x"+css+"'></i>");
    }
  });
});

$(document).on('change', '.recontar', function (e) {
  var id_doc_det = $(this).parents('tr').attr('id');
  var recont = ($(this).is(':checked')) ? (2): (1);
  if(id_doc_det>0)
  {
    var temp = "id_doc_det="+id_doc_det+'&reconteo='+recont;
    $.ajax({
      url: $('base').attr('href') + 'revtomainventfisico/save_reconteo',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            //$("#id_area").html(response.data);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }    
});
$( document ).ready(function() {
	jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_tomainventfisico').validate({
    rules:
    {
			id_almacen: { required:true },
      exist_pedido:{ required:true }
    },
    messages: 
    {
      id_almacen: { required:"Buscar y Seleccionar" },
      exist_pedido:{ required: "" }
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
      var si = valid_exist_pedido();
      if(si == 1)
      {
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
              
              switch(estado) {
                case '0':            
                  break;
                case '1':
                  url = url+va+'/'+num;
                  break;
                case '2':
                  break;
                default:
                  break;
              }
              window.location.href = url;
            }                   
          },
          complete: function(response) {
            $.LoadingOverlay("hide");
          }
        });
      }
      else
      {
        alerta('No Guardo', 'Verificar Artículos', 'success');
      }
        
    }
  });

  $('table#lista_articulos a.editcomentope').editable({
    container: 'body',
    title: 'Editar Comentario',
    display: function(value) {
      var css = (value.trim().length) ? (' text-danger') : ('');
      $(this).html("<i class='fa fa-commenting fa-2x"+css+"'></i>");
    } 
  });

  $('a.mostrarcomentope').click(function() {
    $(this).popover({
        placement: 'left'
    }).popover('show');
  });

});

function formarurl()
{
  var url = false;
  var id_al = $('#id_almacen').val();
  var idfrecu = parseInt($('#id_frecu').val());
  var idtipo = $('ul#myTab li.active a').attr('id'); //console.log(idtipo);
  idtipo = idtipo.replace("-tab","");

  var id_ar = parseInt($('#id_area').val());
  var id_ub = parseInt($('#id_ubicacion').val());
  var id_z = parseInt($('#id_zona').val());
  var id_g = parseInt($('#id_grupo').val());
  var id_f = parseInt($('#id_familia').val());
  var id_s = parseInt($('#id_subfamilia').val());
  var idart = parseInt($('#id_art_sucursal').val());

  id_ar = (id_ar>0) ? (id_ar) : ("-");
  id_ub = (id_ub>0) ? (id_ub) : ("-");
  id_z = (id_z>0) ? (id_z) : ("-");
  id_g = (id_g>0) ? (id_g) : ("-");
  id_f = (id_f>0) ? (id_f) : ("-");
  id_s = (id_s>0) ? (id_s) : ("-");
  idart = (idart>0) ? (idart) : ("-");
  idfrecu = (idfrecu>0) ? (idfrecu) : ("-");
  alert(id_al+'/'+id_z+'/'+id_ar+'/'+id_ub+'/'+id_g+'/'+id_f+'/'+id_s+'/'+idart+'/'+idfrecu);
  if(id_z!="-" || id_g!="-" || idart!="-" || idfrecu!="-")
  {
    url = id_al+'/'+id_z+'/'+id_ar+'/'+id_ub+'/'+id_g+'/'+id_f+'/'+id_s+'/'+idart+'/'+idfrecu;
  }
  return url;
}

$(document).on('focusout', '.padd5', function (e) {
  var padre = $(this);
  var cantidad = padre.val();

  if(cantidad.trim().length)
  {
    $(this).removeClass('erroinput');    
  }
  else
  {
    $(this).addClass('erroinput');
  }

  valid_exist_pedido();

  padre = padre.parents('tr');

  var cant = parseFloat(padre.find('td input.cant').val());

});

function valid_exist_pedido()
{
  var i = 0;
  var cantidad = 0;
  var cu = 0;
  var va = 0;
  var padre = "";
  var sum = 0;
  var vsum = 0;
  $('.cant').each(function (index, value){
    padre = $(this);
    cantidad = padre.val();

    if(cantidad.trim().length)
    {
      $(this).removeClass('erroinput');
      sum++;
    }
    else
    {
      $(this).addClass('erroinput');        
    }  
   });

  if(sum==0) {
    i++;
  }
  else
  {
    i=0;
  }
  
  var num = parseFloat($('#lista_articulos tbody tr td input.cant').length);
  //console.log('num->'+num);
  if(num>0 && i==0) { va = 1;}
  else {
    if(i>0) { va=2; }
  }
  //console.log('va->'+va);
  if(va==1)
  {
    $('#exist_pedido').val('si');
    $('#exist_pedido').parents('.form-group').removeClass('has-error');
  }
  else
  {
    $('#exist_pedido').val('');
    $('#exist_pedido').parents('.form-group').addClass('has-error');    
  }
  return va;
}

$(document).on('click', '.btn_eliminar', function (e) {
  var estado = $(this).attr('estado');
  var id = parseInt($('#id_tomainventfisico').val());
  id = (id>0) ? (id) : (0);
  if(id>0)
  {
    var temp = "id_tomainventfisico="+id+'&estado='+estado;
    swal({
      title: 'Anular',
      text: "¿Esta Seguro de Anular?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then(function(isConfirm) {
      if (isConfirm === true) {
        $.ajax({
          url: $('base').attr('href') + 'tomainventfisico/delete',
          type: 'POST',
          data: temp,
          dataType: "json",
          beforeSend: function(response) {
            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) {
              var url = $('#linkmodulo').attr('href');              
              window.location.href = url;              
            }                   
          },
          complete: function(response) {
            $.LoadingOverlay("hide");
          }
        });
      } else if (isConfirm === false) {
        
      } else {
        // Esc, close button or outside click
        // isConfirm is undefined
      }
    })
  }
});

$(document).on('click', '.guardar', function (e) {
  e.preventDefault();
  var estado = $(this).attr('estado');
  var tipo = (estado==1)?("Guardo"):("Envio");
  $('#estado').val(estado);

  var nutot = 0;
  var no = 0;
  $('.cant').each(function (index, value){
    padre = $(this);
    cantidad = parseInt(padre.val());
    nutot++;
    if(padre.val().trim().length==0) {no++;}
  });

  if(nutot == no)
  {
    $('#exist_pedido').val('');
    $('#exist_pedido').parents('.form-group').addClass('has-error');
    alerta('No '+tipo+'!', 'Ingresar Cantidades', 'error');
  }
  else
  {
    $('#exist_pedido').val('si');
    $('#exist_pedido').parents('.form-group').removeClass('has-error');
    $('#form_save_tomainventfisico').submit();
  }
});

$(document).on('click', '.editcomentope', function (e) {
  var id = parseInt($(this).parents('tr').attr('id'));
  id = id>0 ? id : '';
  $('#idauxliar').val(id);
});

$(document).on('click', 'form.editableform button.editable-submit', function (e) {
  var comen = $('form.editableform div.editable-input textarea').val();
  var id = parseInt($('#idauxliar').val());
  if(id>0)
  {
    $('#lista_articulos tr#'+id+' td.comentarios input.comentario_ope').val(comen);
  }
  $('#idauxliar').val('');
});

$(document).on('click', 'form.editableform button.editable-cancel', function (e) {
  $('#idauxliar').val('');
});
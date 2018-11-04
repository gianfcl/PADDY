
$(document).on('click', '#cont_cel', function (e) {
  var ord = ($('#div_celu .form-group').length>0) ? ($('#div_celu .form-group:last').attr('orden')) : (0);
  ord = parseInt(ord)+1;
  var i = 0;
  $( "#div_celu .form-group select" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });

  $( "#div_celu .form-group input" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });
  if(i == 0)
  {
    add_operador('tipo=add_operadorcel&orden='+ord, 'div_celu');
  }
  else
  {
    alerta('Completar!','Tiene que Completar el # de Celular','error');
  }                   
});

$(document).on('click', '#cont_tel', function (e) {
  var ord = ($('#div_tel .form-group').length>0) ? ($('#div_tel .form-group:last').attr('orden')) : (0);
  ord = parseInt(ord)+1;
  var i = 0;
  $( "#div_tel .form-group select" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });

  $( "#div_tel .form-group .col-md-4 input" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });

  if(i == 0)
  {
    add_operador('tipo=add_operadortel&orden='+ord, 'div_tel');
  }
  else
  {
    alerta('Completar!','Tiene que Completar el # de Teléfono','error');
  }                   
});

function add_operador(temp, div)
{
  if((temp.trim().length)>0 && (div.trim().length)>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'clientes/add_operador',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              $( "#"+div ).append(response.data);
            }
        },
        complete: function() {
            //hideLoader();
        }
    });
  }
}

function html_operador(temp, div)
{
  if((temp.trim().length)>0 && (div.trim().length)>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'clientes/add_operador',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              $( "#"+div ).html(response.data);
            }
        },
        complete: function() {
            //hideLoader();
        }
    });
  }
}

$(document).on('click', '.cont_modal', function (e)
{    
  html_operador('tipo=add_operadortel&orden=0', 'div_tel');
  html_operador('tipo=add_operadorcel&orden=0', 'div_celu');
  limpiarcontacto();    
});

$(document).on('click', '.edit_contact', function (e)
{
    var idcontacto = $(this).parents('tr').attr('idcontacto');
    $.ajax({
      url: $('base').attr('href') + 'clientes/get_one_contacto',
      type: 'POST',
      data: 'id_contacto='+idcontacto,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#id_contacto').val(response.data.id_contacto);
          $('#apel_cont').val(response.data.apellidos);
          $('#nom_cont').val(response.data.nombres);
          $('#car_cont').val(response.data.cargo);          
          $('#ema_cont').val(response.data.email);
          var cel = response.data.celular;
          var tel = response.data.telefono; console.log(jQuery.type(cel));
          if(jQuery.type(cel) === "null")
          {
              html_operador('tipo=add_operadorcel&orden=0', 'div_celu');
          }
          else
          {
            $('#div_celu').html(response.data.celular);
          }

          if(jQuery.type(tel) === "null")
          {
            html_operador('tipo=add_operadortel&orden=0', 'div_tel');
          }
          else
          {
            $('#div_tel').html(response.data.telefono);            
          }
        }
      },
      complete: function() {
          //hideLoader();
      }
  });
    
});

$(document).on('click', '.delete_contact', function (e)
{
  e.preventDefault();

  if (confirm("Seguro que deseas eliminar este contacto?")) 
  {
    var idcontacto = $(this).parents('tr').attr('idcontacto');

    $.ajax({
        url: $('base').attr('href') + 'clientes/delete_contact',
        type: 'POST',
        data: 'id_contacto='+idcontacto+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              var id_cliente = $('#id_cliente').val();

              var link = ($('#tipo_persona').val()==1) ? ('edit_juri') : ('edit_nat');
      
              window.location.href = $('base').attr('href') +'clientes/'+link+'/'+id_cliente;
            }
        },
        complete: function() {
            //hideLoader();
        }
    });
  }    
});

$(document).on('click', '.delet_cel', function (e) {
  e.preventDefault();
  var nomb = "Celular";
  var padre = $(this);
  eliminar(padre, nomb);
});

$(document).on('click', '.delet_tel', function (e) {
  e.preventDefault();
  var nomb = "Teléfono";
  var padre = $(this);
  eliminar(padre, nomb);
});

function eliminar(padre, nomb)
{
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este # de "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    padre.parents('.form-group').remove();
  });
}
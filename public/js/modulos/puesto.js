$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_puesto').validate({
        rules:
        {
          id_sucursal:{ required:true },
          id_areapuesto:{ required:true },
          puesto:{ 
            required:true, 
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'puesto/validar_ac',
              type: "post",
              data: {
                id_sucursal: function() { return $( "#id_sucursal" ).val(); },
                puesto: function() { return $( "#puesto" ).val(); },
                id_areapuesto: function() { return $('#id_areapuesto').val(); },
                id_puesto: function() { return $('#id_puesto').val(); }
              }
            } 
          }
        },
        messages: 
        {
          id_sucursal:{ required:"Sucursal" },
          id_areapuesto:{ required:"Área Puesto" },
          puesto:{ required:"Puesto", minlength: "Más de 2 Letras", remote:"Ya Existe" }
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
            if(element.parent('.col-md-6').length) 
            {
              error.insertAfter(element.parent()); 
            }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'puesto/save_puesto',
                type: 'POST',
                data: $('#form_save_puesto').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var page = 0;
                      if($('#paginacion_data ul.pagination li.active a').length>0)
                      {
                        page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                      }
                      
                      buscar_puestos(page);
                      $('#editpuesto').modal('hide');
                    }
                    limpiartodo("form_save_puesto");
                },
                complete: function() {
                  var id_puesto = parseInt($('#id_puesto').val());
                  id_puesto = (id_puesto>0) ? (id_puesto) : ("0");
                  var text = (id_puesto=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Puesto se '+text+'.', 'success');
                  limpiartodo("form_save_puesto");
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_puesto', function (e)
{
  limpiartodo("form_save_puesto");
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiartodo("form_save_puesto");
    $('#editpuesto').modal('hide');
});

function limpiartodo(form)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="checkbox")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
      $(this).prop('checked', false);
    }

    if($(this).attr('type')=="text")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      $(this).val('');

      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
    }    

    if($(this).attr('type')=="hidden"){
      $(this).val('');
    }    
  });

  var valimp = $( "form#"+form ).validate();
  valimp.resetForm();
  $('#id_areapuesto').html('');
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_puestos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_puestos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_puestos(page);
});

function buscar_puestos(page)
{
  var um_busc = $('#um_busc').val();
  var um_busc1 = $('#um_busc1').val();
  var id_sucu = $('#id_sucu').val();
  
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }

  if(um_busc1.trim().length)
  {
    temp=temp+'&um_busc1='+um_busc1;
  }

  if(id_sucu.trim().length)
  {
    temp=temp+'&id_sucu='+id_sucu;
  }
  
  $.ajax({
      url: $('base').attr('href') + 'puesto/buscar_puesto',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
            $('#paginacion_data').html(response.data.paginacion);
            limpiartodo("form_save_puesto");
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
}

$(document).on('click', '.edit', function (e) {
  var idpuesto = $(this).parents('tr').attr('idpuesto');
  $.ajax({
    url: $('base').attr('href') + 'puesto/edit',
    type: 'POST',
    data: 'id_puesto='+idpuesto,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_puesto').val(response.data.id_puesto);
        $('#puesto').val(response.data.puesto);
        $('#id_areapuesto').html(response.data.area);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#id_areapuesto').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#id_areapuesto').parents('.form-group').removeClass('has-error');
        }

        if($('#id_areapuesto-error').length>0)
        {
          $('#id_areapuesto-error').html('');
        }

        $('#id_sucursal').val(response.data.id_sucursal);

        if($('#id_sucursal').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#id_sucursal').parents('.form-group').removeClass('has-error');
        }

        if($('#id_sucursal-error').length>0)
        {
          $('#id_sucursal-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idpuesto = $(this).parents('tr').attr('idpuesto');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "puesto";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'puesto/delete',
        type: 'POST',
        data: 'id_puesto='+idpuesto,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_puestos(page);
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpiartodo("form_save_puesto");
        }
      });
    }
  });   
});

$(document).on('click', '.edit_req', function (e) {
  var pa = $(this).closest('tr');
  var idpuesto = parseInt(pa.attr('idpuesto'));
  var padre = $('form#form_save_requisito');
  var text = pa.find('td').eq(2).html();
  var id = 0;

  if(idpuesto>0)
  {
    padre.find('input.id_puesto').val(idpuesto);
    padre.find('input:checkbox').prop( "checked", false );
    padre.find('input:checkbox').attr({'idpuestorequisito':'0'});
    $('#txtpu').html(text);
    $.ajax({
      url: $('base').attr('href') + 'puesto/getallpuestoreq',
      type: 'POST',
      data: 'id_puesto='+idpuesto,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {          
          jQuery.each( response.data, function( i, val ) {
            id = parseInt(val);
            if(id>0)
            {
              $('input#id_'+i).prop( "checked", true ); console.log('Entraste->'+val);
              $('input#id_'+i).attr({'idpuestorequisito':val});
            }
          });
        }
      },
      complete: function() {
      }
    });
  }
});

$(document).on('click', '.idrequisito', function (e) {
  var padre = $(this);
  var estado = (padre.is(':checked')) ? ("1"): ("0");
  var idpuestorequisito = padre.attr('idpuestorequisito');
  var idrequisito = padre.attr('idrequisito');

  var idpuesto = padre.closest('form').find('.id_puesto').val();

  var temp = 'id_puesto='+idpuesto+'&id_requisitos='+idrequisito+'&id_puestorequisito='+idpuestorequisito+'&estado='+estado;
  $.ajax({
      url: $('base').attr('href') + 'puesto/save_pue_req',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            padre.attr({'idpuestorequisito':response.data});
          }                    
      },
      complete: function() {
          //hideLoader();
      }
  });/**/
});

$(document).on('change', '#id_sucursal', function (e)
{
  var idsu = parseInt($(this).val());
  idsu = (idsu>0) ? (idsu) : ("");
  $('#id_areapuesto').html('');
  if(idsu>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'areapuesto/commbx',
      type: 'POST',
      data: 'id_sucursal='+idsu,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_areapuesto').html(response.data);
          }                    
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});

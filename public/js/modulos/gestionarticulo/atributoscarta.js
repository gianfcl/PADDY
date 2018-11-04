$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_det').validate({
    rules:
    {
      atributoscarta:
      {
        required:true,
        minlength: 2,
        remote: {
          url: $('base').attr('href') + 'atributoscarta/validar',
          type: "post",
          data: {
            id_padre: function() { return $( "#id_padre" ).val(); },
            id_atributoscarta: function() { return $('#id_subatributoscarta').val(); },
            atributoscarta: function() { return $('#subatributoscarta').val(); }
          }
        }
      }       
    },
    messages: 
    {
      atributoscarta:
      {
        required:"Ingresar Atributos",
        minlength: "Más de 2 Letras",
        remote: "Ya Existe"
      }
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
      var orden = parseInt($('table#tb_detalle tbody tr.ordenes td.orden').length);
      var id = parseInt($('#id_subatributoscarta').val());

      if(id>0)
      {
        orden = parseInt($('table#tb_detalle tbody tr#tr_'+id+' td.orden').html());
      }

      $.ajax({
        url: $('base').attr('href') + 'atributoscarta/save_atributoscarta',
        type: 'POST',
        data: $('#form_save_det').serialize()+'&orden='+orden,
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {
            if(orden>0)
            {
              if(response.data.es=="1")
              {
                $('table#tb_detalle tbody').append(response.data.tr);
              }
              else
              { //alert(response.data.id+' %%% '+response.data.es)
                $('table#tb_detalle tbody tr#tr_'+response.data.id).html(response.data.tr);
              }
            }
            else
            {
              $('table#tb_detalle tbody').html(response.data.tr);
            }
          }
          else
          {
            alerta("Error","No Guardo",'error');
          }
        },
        complete: function() {
          limp_todo('form_save_det');
          $('#id_padre').val($('#id_atributoscarta').val());
        }
      });/**/
    }
  });

  $('#form_save_atributoscarta').validate({
    rules:
    {
      atributoscarta:
      {
        required:true,
        minlength: 2,
        remote: {
          url: $('base').attr('href') + 'atributoscarta/validar',
          type: "post",
          data: {
            atributoscarta: function() { return $( "#atributoscarta" ).val(); },
            id_atributoscarta: function() { return $('#id_atributoscarta').val(); }
          }
        }
      }       
    },
    messages: 
    {
      atributoscarta:
      {
        required:"Ingresar Atributos",
        minlength: "Más de 2 Letras",
        remote: "Ya Existe"
      }
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
        url: $('base').attr('href') + 'atributoscarta/save_atributoscarta',
        type: 'POST',
        data: $('#form_save_atributoscarta').serialize(),
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

            $('#editatributoscarta').modal('hide');

            buscar_atributoscartas(page);
          }
          else
          {
            limpiarform();
          }
        },
        complete: function() {
          var id_atributoscarta = parseInt($('#id_atributoscarta').val());
          id_atributoscarta = (id_atributoscarta>0) ? (id_atributoscarta) : ("0");
          var text = (id_atributoscarta=="0") ? ("Guardo!") : ("Edito!");
          alerta(text, 'Este atributoscarta se '+text+'.', 'success');
          limpiarform();
        }
      });/**/
    }
  });

});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_atributoscarta', function (e)
{
  limpiarform();
  limp_todo('form_save_det');
  $('#tabs2').closest('li').addClass('hide');
  mostrartab('tabs', 'tab_content',1);
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editatributoscarta').modal('hide');
});

function limpiarform()
{
  $('#id_atributoscarta').val('0');
  $('#atributoscarta').val('');
  $('#abreviatura').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  $('table#tb_detalle tbody').html("<tr><td colspan='4'><h2 class='text-center text-success'>No se hay registro</h2></td></tr>");
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#atributoscarta').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#atributoscarta').parents('.form-group').removeClass('has-error');
  }

  if($('#atributoscarta-error').length>0)
  {
    $('#atributoscarta-error').html('');
  }
  var validatore = $( "#form_save_atributoscarta" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_atributoscartas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_atributoscartas(page);
});

$(document).on('click', 'table#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_atributoscartas(page);
});

$(document).on('click', 'table#datatable-buttons .limpiar', function (e) {
  var page = 0;
  buscar_atributoscartas(page);
});

function buscar_atributoscartas(page)
{
  var atributo_busc = $('#atributo_busc').val();
  var abrev = $('#abrev').val();
  var temp = "page="+page;
  if(atributo_busc.trim().length)
  {
    temp=temp+'&atributo_busc='+atributo_busc;
  }
  if(abrev.trim().length)
  {
    temp=temp+'&abrev='+abrev;
  }

  $.ajax({
      url: $('base').attr('href') + 'atributoscarta/buscar_atributoscartas',
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
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
}

$(document).on('click', '.editar', function (e) {
  var idatributoscarta = $(this).parents('tr').attr('idatributoscarta');
  var idpadre = parseInt($('#id_atributoscarta').val());
  var atributoscarta = $(this).parents('tr').find('td.atributocarta').html();
  var abreviatura = $(this).parents('tr').find('td.abreviatura').html();

  if(idatributoscarta>0 && idpadre>0)
  {
    $('#id_padre').val(idpadre);
    $('#id_subatributoscarta').val(idatributoscarta);
    $('#subatributoscarta').val(atributoscarta);
    $('#subabreviatura').val(abreviatura);
  }
});

$(document).on('click', '.edit', function (e) {
  var idatributoscarta = parseInt($(this).parents('tr').attr('idatributoscarta'));
  mostrartab('tabs', 'tab_content',1);
  $('#tabs2').closest('li').removeClass('hide');
  $.ajax({
      url: $('base').attr('href') + 'atributoscarta/edit',
      type: 'POST',
      data: 'id_atributoscarta='+idatributoscarta,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_atributoscarta').val(response.data.id_atributoscarta);
            $('#id_padre').val(response.data.id_atributoscarta);
            
            $('#atributoscarta').val(response.data.atributoscarta);
            $('#abreviatura').val(response.data.abreviatura);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#atributoscarta').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#atributoscarta').parents('.col-md-8').removeClass('has-error');
            }

            if($('#atributoscarta-error').length>0)
            {
              $('#atributoscarta-error').html('');
            }

            $('table#tb_detalle tbody').html(response.data.tr);
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var tis = $(this);
  var idatributoscarta = parseInt(tis.parents('tr').attr('idatributoscarta'));
  var tabla = tis.parents('table').attr('id');

  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var atributo_busc = $('#atributo_busc').val();
  var temp = "page="+page;

  if(atributo_busc.trim().length)
  {
    temp=temp+'&atributo_busc='+atributo_busc;
  }
  var orden = parseInt($('table#tb_detalle tbody tr.ordenes td.orden').length);
  var contr = (tabla=="tb_detalle") ? ("delete") : ("save");
  var nomb = "Atributo";
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
        url: $('base').attr('href') + 'atributoscarta/'+contr+'_atributoscarta',
        type: 'POST',
        data: 'id_atributoscarta='+idatributoscarta+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              if(tabla=="tb_detalle")
              {
                tis.parents('tr').remove();
                if(orden>1)
                {
                  $('table#tb_detalle tbody tr.ordenes td.orden').each(function (index, value){
                    $(this).html(index+1);
                  });
                }
                else
                {
                  $('table#tb_detalle tbody').html("<tr><td colspan='4'><h2 class='text-center text-success'>No se hay registro</h2></td></tr>");
                }  
              }
              else
              {
                buscar_atributoscartas(temp);
              }              
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpiarform();
        }
      });
    }
  });   
});

function mostrartab(tab='', cont='', num='')
{
  $('a#'+tab+num).tab('show');
  $('a#'+tab+num).parents('li').attr({'class':'active'});
  $('div#'+cont+num).addClass('active');
}
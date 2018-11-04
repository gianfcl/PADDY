$( document ).ready(function() {

  $('#form_save_asignar').validate({
    rules:
    {
      id_atributos:{ required:true }
    },
    messages: 
    {
      id_atributos:{ required:"Asignar" }
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
        url: $('base').attr('href') + 'subfamiliaaf/save_asignar_atributo',
        type: 'POST',
        data: $('#form_save_asignar').serialize()+'&id_subfamiliaaf='+$('#id_subfamiliaaf').val(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            buscar_atributosxsubfam();
            $('#tatributo').modal('hide');
            
          }
        },
        complete: function() {
          buscar_atributos(0);    
          $.LoadingOverlay("hide");
        }
      });/**/
    }
  });

});

$(document).on('click', '.edit', function (e) {
  var iddet = parseInt($(this).parents('tr').attr('iddet'));
  var idatri = parseInt($(this).parents('tr').attr('idatri'));
  var obli = parseInt($(this).parents('tr').attr('obli'));
  if(iddet>0)
  {
    $('#id_subfamiliaaf_det').val(iddet);
    $('#id_atributos').val(idatri);

    $('#esobligatorio label').removeClass('active');
    $('#esobligatorio input').prop('checked', false);
    
    $('#esobligatorio #esobligatorio_'+obli).prop('checked', true);
    $('#esobligatorio #esobligatorio_'+obli).parent('label').addClass('active');
  }
});

$(document).on('click', '.delete', function (e) {

  e.preventDefault();
  var iddet = parseInt($(this).parents('tr').attr('iddet'));
  //alert(iddet);
 // var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "atributo";
  if(iddet>0)
  {
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
          url: $('base').attr('href') + 'subfamiliaaf/delete_iddet',
          type: 'POST',
          data: 'iddet='+iddet,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            //
          },
          complete: function() {
            $.LoadingOverlay("hide");

            var text = "Eliminado!";
            alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
            window.location.href = $('base').attr('href') +'subfamiliaaf/editar/'+$('#id_subfamiliaaf').val();
          }
        });
      }
    });
  }
       
});

$(document).on('click', '.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#busca_tipo').val('');

  buscar_atributos(0);
});

$(document).on('click', '.add_atributo', function (e)
{
  buscar_atributos(0);     
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_atributos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_atributos(page);
});

$(document).on('click', '.buscaratributo', function (e) {  
  var page = 0;

  buscar_atributos(page);
}); 

function buscar_atributos(page)
{
    var ids = get_joinids('datatable-buttons');
    console.log(ids);
    var temp ="page="+page+'&estado=1&ids='+ids;
    var busca_atr = $('#busca_atr').val();
    var busca_abre = $('#busca_abre').val();
    var busca_tipo = $('#busca_tipo').val();

    if(busca_atr.trim().length)
    {
      temp=temp+'&at_busc='+busca_atr;
    }

    if(busca_abre.trim().length)
    {
      temp=temp+'&abre_busc='+busca_abre;
    }

    if(busca_tipo.trim().length)
    {
      temp=temp+'&tat_busc='+busca_tipo;
    }

    $.ajax({
      url: $('base').attr('href') + 'atributos/buscar_atributoss',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            $('#buscar_provee tbody').html(response.data.rta);
            $('#paginacion_datap').html(response.data.paginacion);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });        
}

$(document).on('click', '.addobligatorio', function (e) {  
  var idatributos = $(this).parents('tr').attr('idatributos');
  $('#id_atributos').val(idatributos);
});

function get_joinids(div)
{
  var ids =  new Array();
  var i = 0;
  $('#'+div+' tbody tr').each(function (index, value){
    ids.push($(this).attr('idatri'));
  });
  return ids.join(',');
}

$(document).on('click','.btn_cancelar',function(){
  $('#tatributo').modal('hide');
});

function buscar_atributosxsubfam()
{
  var id_subfamiliaaf = $('#id_subfamiliaaf').val();

  $.ajax({
    url: $('base').attr('href') + 'subfamiliaaf/attrxsubfamilia',
      type: 'POST',
      async: false,
      data: 'id_subfamiliaaf='+id_subfamiliaaf,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            $('#bodyindex').html(response.data);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });
}
$( document ).ready(function() {
  $.validator.addMethod("time24", function(value, element) {
    var exp = value;
    if($.trim(exp).length>0) {
      return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [APap][mM]$/.test(value);
    }
    else {
      return true;
    }
  }, "");

  $('#form_save_conductor').validate({
    rules:
    {
      dni:
      {
        required:true,
        number: true,
        remote: {
          url: $('base').attr('href') + 'conductor/validar_dni',
          type: "post",
          data: {
            dni: function() { return $( "#dni" ).val(); },
            id_conductor: function() { return $('#id_conductor').val(); }
          }
        }
      },
      nombres:{ required:true },
      apellidos:{ required:true },
      sexo:{ required:true },
      numero_licencia:{ required:true },
      clase:{ required:true },
      categoria:{ required:true },
      fecha_expedicion:{ required:true },
      fecha_de_revalicion:{ required:true }
    },
    messages:{
      dni: { required:"Ingrese DNI", number: "Solo #s", remote: "Ya existe"},
      nombres:{ required:"" },
      apellidos:{ required: "" },
      sexo:{ required: "" },
      numero_licencia:{ required:"" },
      clase:{ required:"" },
      categoria:{ required:"" },
      fecha_expedicion:{ required:"" },
      fecha_de_revalicion:{ required:"" }
    },      

    highlight: function(element) {
        $(element).closest('.control-group').addClass('has-error');        
    },
    unhighlight: function(element) {
        $(element).closest('.control-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
        if(element.parent('.control-group').length) 
        {
          error.insertAfter(element.parent());
        }
    },
    submitHandler: function() {
        $.ajax({
            url: $('base').attr('href') + 'conductor/save_conductor',
            type: 'POST',
            data: $('#form_save_conductor').serialize(),
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
              if (response.code==1) {
                 window.location.href = $('base').attr('href') +'conductor/edit/'+response.data.id;
              }
              else
              {
                if($('#dni').parents('.col-md-4').attr('class')=="col-md-4")
                {
                  $('#dni').parents('.col-md-4').addClass('has-error');
                }
                
                if($('#dni-error').length>0)
                {
                  $('#dni-error').html(response.message);
                }
                else
                {
                  $('#dni').parents('.col-md-4').append("<span id='dni-error' class='help-block'>"+response.message+"</span>");
                }
              }
            },
            complete: function(response) { console.log(response.code);
              var tipo =  'success';
              var id_conductor = $('#id_conductor').val();
              id_conductor = (id_conductor>0) ? (id_conductor) : ("0");              
              var text = (id_conductor=="0") ? ("se Guardo!") : ("se Edito!");
              if(response.code == 0){
                text = "NO "+text;
                tipo = 'error';
              }             
              
              alerta(text, 'Este Conductor '+text+'.',tipo);
            }
        });/**/
    }
  });

  $('#fecha_expedicion').daterangepicker({
    singleDatePicker: true,
    format: 'YYYY-MM-DD',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#fecha_de_revalicion').daterangepicker({
    singleDatePicker: true,
    format: 'YYYY-MM-DD',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $("#dni").autocomplete({
    //appendTo: autondni,
    type:'POST',
    serviceUrl: $('base').attr('href')+"persona/get_dni",
    onSelect: function (suggestion) 
    {
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#fecha_nacimiento').val(suggestion.fecha_nacimiento);
      $('#telefono').val(suggestion.telefono);
      $('#celular').val(suggestion.celular);
      $('#pagina_web').val(suggestion.pagina_web);
      $('#email').val(suggestion.email);
      $('#dni').val(suggestion.dni);

      $('#gender label').removeClass('active');
      $('#gender input').prop('checked', false);

      var num = suggestion.sexo;
      $('#gender #sexo_'+num).prop('checked', true);
      $('#gender #sexo_'+num).parent('label').addClass('active');
    }
  });
  
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_conductores(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_conductores(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_conductores(page);
});

function buscar_conductores(page)
{
  var nombre_busc = $('#nombre_busc').val();
  var dni_busc = $('#dni_busc').val();
  var num_lic_busc = $('#num_lic_busc').val();
  var estado_busc = $('#estado_busc').val();
  var clase_busc = $('#clase_busc').val();
  var cate_busc = $('#cate_busc').val();
  var fecha_expedicion = $('#fecha_expedicion').val();
  var fecha_de_revalicion = $('#fecha_de_revalicion').val();
  var temp = "page="+page;
  if(nombre_busc.trim().length)
  {
    temp=temp+'&nombre_busc='+nombre_busc;
  }
  if(dni_busc.trim().length)
  {
    temp=temp+'&dni_busc='+dni_busc;
  }
  if(num_lic_busc.trim().length)
  {
    temp=temp+'&num_lic_busc='+num_lic_busc;
  }  
  if(estado_busc.trim().length)
  {
    temp=temp+'&estado_busc='+estado_busc;
  }
  if(clase_busc.trim().length)
  {
    temp=temp+'&clase_busc='+clase_busc;
  }  
  if(cate_busc.trim().length)
  {
    temp=temp+'&cate_busc='+cate_busc;
  }
  if(fecha_expedicion.trim().length)
  {
    temp=temp+'&fecha_expedicion='+fecha_expedicion;
  }
  if(fecha_de_revalicion.trim().length)
  {
    temp=temp+'&fecha_de_revalicion='+fecha_de_revalicion;
  }

  $.ajax({
    url: $('base').attr('href') + 'conductor/buscar_conductores',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);        
      }
    },
    complete: function() {
      $('#categoria').datetimepicker({format: 'LT'});
      $('#clase').datetimepicker({format: 'LT'});
      $('#fecha_expedicion').daterangepicker({
        singleDatePicker: true,
        format: 'YYYY-MM-DD',
        calender_style: "picker_4"
      }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
      });
      $('#fecha_de_revalicion').daterangepicker({
        singleDatePicker: true,
        format: 'YYYY-MM-DD',
        calender_style: "picker_4"
      }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
      });
    }
  });
}

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idconductor = $(this).parents('tr').attr('idconductor');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Conductor";
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
        url: $('base').attr('href') + 'conductor/delete',
        type: 'POST',
        data: 'id_conductor='+idconductor,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_conductores(page);
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
        }
      });
    }
  });   
});
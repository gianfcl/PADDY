$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])$/.test( value );
      else
        return false;
  }, "Ingrese est Formato dd-mm");

  $('#form_save_tipoevento').validate({
    rules:
    {
      tipoevento:
      {
        required:true,
        minlength: 2,
        remote: {
          url: $('base').attr('href') + 'tipoevento/validar',
          type: "post",
          data: {
            tipoevento: function() { return $( "#tipoevento" ).val(); },
            id_tipoevento: function() { return $('#id_tipoevento').val(); }
          }
        }
      }       
    },
    messages: 
    {
      tipoevento:
      {
        required:"Ingresar tipoevento",
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
      var es = true;
      var tiene = ($(this).is(':checked')) ? (1): (0);
      tiene = parseInt(tiene);

      if(tiene==1)
      {
        es = false;
        var fi = $('#fecha_inicio').val();
        var ff = $('#fecha_fin').val();
        if(fi.trim().length && ff.trim().length)
        {
          es = true;
        }
      }

      if(es)
      {
        $.ajax({
          url: $('base').attr('href') + 'tipoevento/save_tipoevento',
          type: 'POST',
          data: $('#form_save_tipoevento').serialize(),
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

              $('#edittipoevento').modal('hide');

              buscar_tipoeventos(page);
            }
            else
            {
              limpiarform();
            }
          },
          complete: function() {
            var id_tipoevento = parseInt($('#id_tipoevento').val());
            id_tipoevento = (id_tipoevento>0) ? (id_tipoevento) : ("0");
            var text = (id_tipoevento=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Este tipoevento se '+text+'.', 'success');
            limp_todo('form_save_tipoevento');
          }
        });/**/
      }
      else
      {
        alerta('Error','Ingresar Fechas','error')
      }      
    }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM',
    locale: moment.locale("es")
  });

  $('#datetimepicker7').datetimepicker({
    format: 'DD-MM',
    locale: moment.locale("es"), 
    useCurrent: false //Important! See issue #1075
  });

  $("#datetimepicker6").on("dp.change", function (e) { console.log(e.date);
    $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
  });

  $("#datetimepicker6").on("dp.show", function (e) {
    $('#datetimepicker7 input').prop( "disabled", false );
  });

  $("#datetimepicker7").on("dp.change", function (e) {
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
  });
});

/*Tiene vigencia*/
$(document).on('change', '#tiene_vigencia', function (e) {
    var tiene_vigencia = ($(this).is(':checked')) ? ("1"): ("0");
    if(tiene_vigencia==1)
    {
      $('#div_vigencia').removeClass('collapse');
    }
    else
    {
      $('#div_vigencia').addClass('collapse');
    }
});
/*<-->*/

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_tipoeventos(0);
});

$(document).on('click', '.add_tipoevento', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#edittipoevento').modal('hide');
});

$(document).on('click', '.btn_limpiar2', function (e) {
  limpiarform();
  $('#agregar_serv').modal('hide');
});

function limpiarform()
{
  $('#id_tipoevento').val('0');
  $('#tipoevento').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#tipoevento').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#tipoevento').parents('.form-group').removeClass('has-error');
  }

  if($('#tipoevento-error').length>0)
  {
    $('#tipoevento-error').html('');
  }
  var validatore = $( "#form_save_tipoevento" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_tipoeventos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tipoeventos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_tipoeventos(page);
});

function buscar_tipoeventos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'tipoevento/buscar_tipoeventos',
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

$(document).on('click', '.edit', function (e) {
  var idtipoevento = $(this).parents('tr').attr('idtipoevento');
  $.ajax({
      url: $('base').attr('href') + 'tipoevento/edit',
      type: 'POST',
      data: 'id_tipoevento='+idtipoevento,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_tipoevento').val(response.data.id_tipoevento);
          $('#tipoevento').val(response.data.tipoevento);

          $('#estado label').removeClass('active');
          $('#estado input').prop('checked', false);

          var num = response.data.estado;
          $('#estado #estado_'+num).prop('checked', true);
          $('#estado #estado_'+num).parent('label').addClass('active');
          var tienev = parseInt(response.data.tiene_vigencia);

          var fi = response.data.newfi;
          var ff = response.data.newff;

          if(tienev == 2)
          {
            $('#div_vigencia').removeClass('collapse');

          }
          else
          {
            $('#div_vigencia').addClass('collapse');
            fi = "";
            ff = "";
          }
          $('#fecha_inicio').val(fi);
          $('#fecha_fin').val(ff);
          $('#datetimepicker7 input').prop( "disabled", false );
          var es_va = (tienev==2) ? (true) : (false);
          $('#tiene_vigencia').prop('checked', es_va);
        }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idtipoevento = $(this).parents('tr').attr('idtipoevento');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "tipoevento";
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
        url: $('base').attr('href') + 'tipoevento/save_tipoevento',
        type: 'POST',
        data: 'id_tipoevento='+idtipoevento+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_tipoeventos(temp);
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

$(document).on('click', '.edit2', function (e) {
  limpiarform2();
  var id_tipoevento =  $(this).parents('tr').attr('idtipoevento');
  $('#id_tipoevento2').val($(this).parents('tr').attr('idtipoevento'));

  $.ajax({
      url: $('base').attr('href') + 'tipoevento/edit2',
      type: 'POST',
      data: 'id_tipoevento='+id_tipoevento,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code) {

            $('table#lista_articulos tbody').html(response.data.rta);
            $('#select_serviciosol').html(response.data.rta2);
            if(parseInt(response.data.sobra)>0){
              $('#select_serviciosol').closest('.form-group').removeClass('hidden');
            }
            else{
              $('#select_serviciosol').closest('.form-group').addClass('hidden');
            }
          }
      },
      complete: function() {
          //hideLoader();
      }
  });


});




$(document).on('click','.save_serv', function(e){
  if($('#select_serviciosol').val()>0){
    $.ajax({
      url: $('base').attr('href') + 'tipoevento/save_serv_config',
      type: 'POST',
      data: {
        id_serviciosol: function (){return $('#select_serviciosol').val();},
        id_tipoevento: function(){ return $('#id_tipoevento2').val();}
      },
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        
        //if (response.code==1) {
        //  buscar_tipoeventos(temp);
        // }
      },
      complete: function() {
        
        var text = "Guardo!";
        alerta(text, 'Servicio guardado correctamente', 'success');
        limpiarform2();      
        buscar_serviciosol();
      }
    });
  }
  else{
    alerta('Error!','Servicio no válido!!!','error');
    $('#agregar_serv').modal('hide');
  }
});   

function limpiarform2(){
  $('#serviciosol').val('');
  $('#id_serv').val('');
  $('#table#lista_articulos tbody').html();
}

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idtipoevento = $(this).parents('tr').attr('idtipoevento');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "tipoevento";
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
        url: $('base').attr('href') + 'tipoevento/save_tipoevento',
        type: 'POST',
        data: 'id_tipoevento='+idtipoevento+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_tipoeventos(temp);
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

function buscar_serviciosol()
{
  var id_tipoevento = $('#id_tipoevento2').val();
      $.ajax({
      url: $('base').attr('href') + 'tipoevento/edit2',
      type: 'POST',
      data: 'id_tipoevento='+id_tipoevento,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code) {
            $('table#lista_articulos tbody').html(response.data.rta);
            $('#select_serviciosol').html(response.data.rta2);
            if(parseInt(response.data.sobra)>0){
              $('#select_serviciosol').closest('.form-group').removeClass('hidden');
            }
            else{
              $('#select_serviciosol').closest('.form-group').addClass('hidden');
            }  
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
}

$(document).on('click', '.delete2', function (e) {
  e.preventDefault();
  var id_serviciosol = $(this).parents("tr").attr("id");
  //alert(id_serviciosol);
  var id_tipoevento = $("#id_tipoevento2").val();
  //alert(id_tipoevento);
  var nomb = "servicio";
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
        url: $('base').attr('href') + 'tipoevento/delete_config',
        type: 'POST',
        data: 'id_tipoevento='+id_tipoevento+'&id_serviciosol='+id_serviciosol,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            /*if (response.code) {
              $('table#lista_articulos tbody').html(response.data)
            }*/

        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          //limpiarform();
          buscar_serviciosol();
        }
      });
    }
  });   
});


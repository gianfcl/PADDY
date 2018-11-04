$( document ).ready(function() {
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#datetimepicker7').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"), 
    useCurrent: false //Important! See issue #1075
  });

  $("#datetimepicker6").on("dp.change", function (e) {
    $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
  });

  $("#datetimepicker6").on("dp.show", function (e) {
    $('#datetimepicker7 input').prop( "disabled", false );
  });
  

  $("#datehora7").on("dp.change", function (e) {
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
  });


  $('#datehora6').datetimepicker({
    format: 'HH:mm'
  });

  $('#datehora7').datetimepicker({
    format: 'HH:mm',
    useCurrent: false //Important! See issue #1075
  });

  $("#datehora6").on("dp.change", function (e) {
    $('#datehora7').data("DateTimePicker").minDate(e.date);
  });

  $("#datehora6").on("dp.show", function (e) {
    $('#datehora7 input').prop( "disabled", false );
  });
  

  $("#datehora7").on("dp.change", function (e) {
    $('#datehora6').data("DateTimePicker").maxDate(e.date);
  });

  $( "#form_addrangofechas" ).validate({
    rules: {
      fecha_inicio: { required: true},
      chekday: { required: true}
    },
    messages: {
      fecha_inicio: { required: ""},
      chekday: { required: ""}
    },
    errorElement: 'span',
    highlight: function(element) {
      $(element).closest('.form-group').addClass('has-error'); 
    },
    unhighlight: function(element) {
      $(element).closest('.form-group').removeClass('has-error');
    },
    submitHandler: function() {
      var es_horarios = parseInt($('#es_horarios').val());
      es_horarios = es_horarios >0 ? es_horarios : 0
      var id_art_sucursal = parseInt($('#id_art_sucursal').val());
      if(es_horarios == 0 && id_art_sucursal>0)
      {
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
            type: 'POST',
            data: 'id_art_sucursal='+id_art_sucursal+'&es_horarios=1',
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    //window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
                }                    
            },
            complete: function() {
                //hideLoader();
            }
        });
      }
     
      var temp = "&id_art_sucursal_padre="+id_art_sucursal;
      var fechi = $('#fecha_inicio').val();
      var fechf = $('#fecha_fin').val();
      if(fechi.trim().length)
      {
        temp=temp+'&fechi='+datetoing(fechi);
      }
      if(fechf.trim().length)
      {
        temp=temp+'&fechf='+datetoing(fechf);
      }

      $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_arthorarios',
        type: 'POST',
        data: $('#form_addrangofechas').serialize()+temp,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          
        },
        complete: function(response) {
          limp_todo('form_addrangofechas','check_docu');
          $('#prueba').modal('hide');
          alerta('Guardo Horario', 'De manera Correcta', 'success');
          location.reload();
        }
      });
    }
  });

  $( "#form_rangohoras" ).validate({
    rules: {
      hora_inicio: { required: true},
      hora_fin: { required: true}
    },
    messages: {
      hora_inicio: { required: ""},
      hora_fin: { required: ""}
    },
    errorElement: 'span',
    highlight: function(element) {
      $(element).closest('.form-group').addClass('has-error'); 
    },
    unhighlight: function(element) {
      $(element).closest('.form-group').removeClass('has-error');
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_arthoras',
        type: 'POST',
        data: $('#form_rangohoras').serialize(),
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          
        },
        complete: function(response) {
          limp_todo('form_rangohoras');
          $('#rangohoras').modal('hide');
          alerta('Guardo Horas', 'De manera Correcta', 'success');
          location.reload();
        }
      });
    }
  });

});

$(document).on('hidden.bs.modal', '#rangohoras', function (e)
{
  limp_todo('form_rangohoras');
});

$(document).on('hidden.bs.modal', '#prueba', function (e)
{
  limp_todo('form_addrangofechas','check_docu');
});

$(document).on('focusout', '#datetimepicker6 input', function (e) {
  var fechi = $(this).val();
  if(fechi.trim().length) {}
  else { $('#datetimepicker7 input').prop( "disabled", true );}
});

$(document).on('click', '.edithorario', function (e) {
  var idhorarios = parseInt($(this).parents('tr').attr('idartisucuhorarios'));
  if(idhorarios >0)
  {
    $("#prueba").modal();
    $.ajax({
      url: $('base').attr('href') + 'articuloxsucursal/edithorarios',
      type: 'POST',
      data: 'id_artisucuhorarios='+idhorarios,
      dataType: "json",
      beforeSend: function() {
        limp_todo('form_addrangofechas','check_docu');
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_artisucuhorarios').val(response.data.id_artisucuhorarios);
          $('#fecha_fin').val(response.data.fecha_finx);
          $('#fecha_inicio').val(response.data.fecha_iniciox);
          var valorcheck = "";
          $.each( response.data.chekmod, function( index, value ){
              valorcheck = (value==0) ? (false) : (true);
              $('#chekday'+index).prop('checked', valorcheck);
          });
          $('#check_docu').html(response.data.hidden);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('click', '.edithoras', function (e) {
  var padre = $(this).parents('tr');
  var padreh = $(this).parents('tr.trhoras');

  var idhoras = parseInt(padre.attr('idartisucudiahoras'));
  idhoras = idhoras > 0 ? idhoras : 0;

  var idhorarios = parseInt($(this).parents('table.conthoras').attr('idartisucuhorarios'));
  idhorarios = idhorarios > 0 ? idhorarios : 0;

  var idpadre = parseInt(padreh.attr('idartisucudiahoras'));
  idpadre = idpadre > 0 ? idpadre : 0;

  var idia = parseInt(padreh.attr('iddia'));
  idia = idia > 0 ? idia : 0;

  var fechai = padre.find('td.hora_inicio').attr('horai');
  var fechaf = padre.find('td.hora_fin').attr('horaf');

  if(idhorarios >0 && idpadre >0 && idhoras>0)
  {
    $('#id_artisucuhorariosx').val(idhorarios);
    $('#id_papi').val(idpadre);
    $('#id_ddia').val(idia);
    $('#id_artisucudiahorax').val(idhoras);
    $('#hora_inicio').val(fechai);
    $('#hora_fin').val(fechaf);
    $("#rangohoras").modal();
  }
});

$(document).on('click', '.btn_limpiar', function (e) {
  var form = $(this).parents('form').attr('id');
  limp_todo(form,'check_docu');
  form = $(this).parents('div.modal').attr('id');
  $('#'+form).modal('hide');
});

$(document).on('click', '.addhoras', function (e) {
  var idhorarios = parseInt($(this).parents('table.conthoras').attr('idartisucuhorarios'));
  idhorarios = idhorarios > 0 ? idhorarios : 0;

  var idpadre = parseInt($(this).parents('tr.trhoras').attr('idartisucudiahoras'));
  idpadre = idpadre > 0 ? idpadre : 0;

  var idia = parseInt($(this).parents('tr.trhoras').attr('iddia'));
  idia = idia > 0 ? idia : 0;

  if(idhorarios >0 && idpadre >0)
  {
    $('#id_artisucuhorariosx').val(idhorarios);
    $('#id_papi').val(idpadre);
    $('#id_ddia').val(idia);
  }

});

$(document).on('change', '#es_horarios', function (e) {
  var es_horarios = ($(this).is(':checked')) ? (1): (0);
  var id_art_sucursal = $('#id_art_sucursal').val();
  if(es_horarios==1)
  {
    $('#div_es_horarios').removeClass('collapse');
  }
  else
  {
    $('#div_es_horarios').addClass('collapse');
  }
});

$('#div_dias input[type="checkbox"]').on('change', function() {
    if($(this).is(":checked"))  {
        $('#form_addrangofechas #check_docu').append("<input id='modulo"+$(this).val()+"' type='hidden' value='"+$(this).val()+"' name='modulos["+$(this).val()+"]' />");
    } else {
        $("#modulo"+$(this).val()).remove();
    }  
});

$(document).on('click', '.deletehoras', function (e) {
  var idhoras = parseInt($(this).parents('tr').attr('idartisucudiahoras'));

  if(idhoras > 0)
  {
    swal({
      title: 'Estas Seguro?',
      text: "De Eliminar este Horario!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => { //alert(result)
      if (result) {
        $.ajax({
          url: $('base').attr('href') + 'articuloxsucursal/deletehoras',
          type: 'POST',
          data: 'id_artisucudiahoras='+idhoras,
          dataType: "json",
          beforeSend: function() {
            
          },
          success: function(response) {
            if (response.code==1) {
              swal('Elimino!', 'con exito OK.', 'success');
              location.reload();
            }
          },
          complete: function() {
            //hideLoader();
          }
        });      

        
      }
    })
  }
});

$(document).on('click', '.deletehorario', function (e) {
  var idhorarios = parseInt($(this).parents('tr').attr('idartisucuhorarios'));

  if(idhorarios > 0)
  {
    swal({
      title: 'Estas Seguro?',
      text: "De Eliminar este Rango Días!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => { //alert(result)
      if (result) {
        $.ajax({
          url: $('base').attr('href') + 'articuloxsucursal/deletehorario',
          type: 'POST',
          data: 'id_artisucuhorarios='+idhorarios,
          dataType: "json",
          beforeSend: function() {
            
          },
          success: function(response) {
            if (response.code==1) {
              swal('Elimino!', 'con exito OK.', 'success');
              location.reload();
            }
          },
          complete: function() {
            //hideLoader();
          }
        });      

        
      }
    })
  }
});


function num_orden()
{
  var i = 0;
  var num = parseInt($('#div_es_horarios table tbody tr.ordenes td.orden').length);
  if(num>0)
  {
    $('#div_es_horarios table tbody tr.ordenes td.orden').each(function (index, value){
      i++;
      $(this).html(i);
    });
  }    
}

/*Validar Al Salir del Formulario*/
function validar_tabs(tipo)
{
    var eshorarios = ($('#es_horarios').is(':checked')) ? ("1"): ("0");
    var valor = true;
    var cantpro = parseInt($('table tbody tr td').length);
    //console.log(tipo+' esadicional->'+esadicional+' cantpro->'+cantpro+' valor->'+valor);
    if(eshorarios== "1")
    {
        var valor = false;

        if(cantpro >1)
        {
            var valor = true;
            salidajax(tipo);
        }
    }
    else
    {
        salidajax(tipo);
    }
    return (valor) ? ('') : ('Ingresar un Proveedor');
}

function salidajax(tipo)
{
    var id_art_sucursal = parseInt($('#id_art_sucursal').val()); //console.log(id_art_sucursal);
    if(id_art_sucursal>0)
    {
        var para_ventas_val = $('#es_horarios_val').val(); 
        var eshorarios = ($('#es_horarios').is(':checked')) ? ("1"): ("0");
        if(eshorarios==1)
        {
            var cantpro = parseInt($('table tbody tr td').length);
            if(cantpro == 0)
            {
                eshorarios = 0;
            }
        }

        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
            type: 'POST',
            data: 'id_art_sucursal='+id_art_sucursal+'&es_horarios='+eshorarios,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
                }                    
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
}

function salidaformulario(validar, tipo)
{
    swal({
        title: 'Esta Seguro de Salir?',
        text: "No olvide "+validar,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, estoy seguro!',
        allowOutsideClick:false
    }).then(function(isConfirm) {
        if (isConfirm) {     
            salidajax(tipo)
        }
    });               
}
/*<---->*/
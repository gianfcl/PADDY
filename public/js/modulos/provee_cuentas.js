$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_cuentas').validate({
        rules:
        {
          num_cuenta:
          {
            required:true,
            number: true
          },
          cci:
          {
            required:true,
            number: true
          }       
        },
        messages: 
        {
          num_cuenta:
          {
            required:"",
            number: "Solo #s"
          },
          cci:
          {
            required:"",
            number: "Solo #s"
          }
        },      

        highlight: function(element) {
            $(element).closest('.control-group').addClass('has-error');
            $(element).closest('.btn-group').addClass('has-error'); 
            //console.log(element);     
        },
        unhighlight: function(element) {
            $(element).closest('.control-group').removeClass('has-error');
            $(element).closest('.btn-group').removeClass('has-error');
            console.log($(element).attr('type'));           
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
          var id_proveedor=$('#id_proveedor').val();
          $.ajax({
            url: $('base').attr('href') + 'proveedor/save_provee_cuenta',
            type: 'POST',
            data: $('#form_save_cuentas').serialize()+'&id_proveedor='+id_proveedor,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    //var tipo = $('#myTab li.active').attr('tabs');
                    alerta('Guardo Ok!', 'Medio Pago.', 'success');
                }                    
            },
            complete: function() {
                //hideLoader();
            }
          });/**/
        }
    });

    
});

/*Para Ventas*/
$(document).on('change', '#mediopago', function (e) {
    var mediopago = ($(this).is(':checked')) ? ("2"): ("1");
    $('#medio_pago').val(mediopago);
    if(mediopago==2)
    {
        $('#div_medio_pago').removeClass('collapse');
    }
    else
    {
        $('#div_medio_pago').addClass('collapse');
    }
});
/*<-->*/

/*Validar Al Salir del Formulario*/
function validar_tabs(tipo)
{
    var medio_pago = ($('#mediopago').is(':checked')) ? ("2"): ("1");
    var valor = true;
    var para_medio_pago = $('#para_medio_pago').val();
    //console.log('medio_pago->'+medio_pago+' para_medio_pago->'+para_medio_pago)
    //alert(tipo);
    if(medio_pago== "2" && para_medio_pago == 'n')
    {
        var valor = false;
        var num_cuenta = $('#num_cuenta').val();
        num_cuenta = parseInt(num_cuenta.trim().length);
        num_cuenta = (num_cuenta>0) ? (num_cuenta) : (0);

        var cci = $('#cci').val();
        cci = cci.trim().length;
        cci = (cci>0) ? (cci) : (0);

        if(num_cuenta>0 && cci>0)
        {
            var valor = true;
            salidajax(tipo);
        }
    }
    else
    {
        if(para_medio_pago == 'y')
        {
            salidajax(tipo);
        }
        else
        {
            salidajax();
        }
    }
    return (valor) ? ('') : ('Medio de Pago');
}

function salidajax(tipo)
{
    var id_proveedor = parseInt($('#id_proveedor').val());
    id_proveedor = (id_proveedor>0) ? (id_proveedor) : (0);
    var medio_pago = ($('#mediopago').is(':checked')) ? ("2"): ("1");
    var para_medio_pago = $('#para_medio_pago').val();
    var url = $('base').attr('href')+'proveedor';
    
    if(id_proveedor>0)
    {
        if(para_medio_pago=="y")
        {
            $.ajax({
                url: $('base').attr('href') + 'proveedor/save_provee_cuenta',
                type: 'POST',
                data: $('#form_save_cuentas').serialize()+'&medio_pago='+medio_pago,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                        //console.log(response);
                        window.location.href = url+'/edit_juri/'+response.data+'/'+tipo;
                    }                    
                },
                complete: function() {
                }
            });
        }
        else
        {
            window.location.href = url;
        }            
    }
}

function salidaformulario(validar, tipo)
{
    swal({
        title: 'Esta Seguro de Salir?',
        text: "Verificar Datos "+validar,
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
$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_precios_servicios').validate({
        
        submitHandler: function() {
            if(validar())
            {
                var temp = "&id_serv_sucursal="+$('#id_serv_sucursal').val();
                $.ajax({
                    url: $('base').attr('href') + 'serviciosxsucursal/save_precio_servicio',
                    type: 'POST',
                    data: $('#form_precios_servicios').serialize()+temp,
                    dataType: "json",
                    beforeSend: function() {
                        //showLoader();
                    },
                    success: function(response) {
                        if (response.code==1) {

                            swal('Cambios','guardados correctamente','success');
                            window.location.reload();
                        }

                    },
                    complete: function() {

                    }
                });
            }
        }
    });
});

$('.add_precio').click(function(){

    var c = 1;
    $('#tb_precioserv tbody tr').each(function( index, value ) {
        if($(this).hasClass('gen'))
            c++;
    });

    var tx = "<tr class='gen'><td><input class='form-control aut'><input type='hidden' name='mon[g_"+c+"]' class='id_moneda'> </td>"+
             "<td>"+
                "<div class='input-group'><span class='input-group-addon'></span>"+
                "<input name='precio[g_"+c+"]' type='text' class='precio form-control' aria-label='Amount (to the nearest dollar)'>"+
                "</div>"+
              "</td><td><a href='javascript:void(0);' class='btn btn-danger delete btn-xs'><i class='fa fa-trash-o'></i></a></td></tr>";

    if($('tr.default_row').length)
        $('#tb_precioserv tbody').html(tx);
    else
        $('#tb_precioserv tbody').append(tx);

    $('.aut').each(function(i, el) {
        var padre = $(this).parents('tr');
        $(this).autocomplete({
            params: {
                w_not : function(){ return monedasUsadas();}
            },
            type:'POST',
            serviceUrl: $('base').attr('href')+"moneda/get_moneda_autocomplete",
            onSelect: function (suggestion) {

                padre.find('.id_moneda').val(suggestion.id_moneda);
                padre.find('.input-group-addon').text(suggestion.simbolo);
            }
        });
    });
});

$(document).on('click','.delete',function(){
    var padre = $(this).parents('tr');
    if(padre.hasClass('db'))
    {
        var id = padre.attr('idttr');
        $.ajax({
            url: $('base').attr('href') + 'serviciosxsucursal/delete_precio',
            type: 'POST',
            data: 'id='+id,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {

                    swal('Cambios','guardados correctamente','success');
                    window.location.reload();
                }

            },
            complete: function() {

            }
        });
    }
    else
    {
        padre.remove();    
    }
});

function monedasUsadas()
{
    var a = new Array();
    $('#tb_precioserv tbody tr .id_moneda').each(function (i,elm){

        if($(this).val()>0)
            a.push($(this).val());
    });

    return a.join();
}

function validar()
{
    var pasa = true;
    $('#tb_precioserv tbody tr').each(function (i,elm){
        var $this = $(this);
        var p = parseFloat($this.find('.precio').val());
        p_to = p.toFixed(6);

        if(p>0 && p/p_to < 1)
        {   
            swal('Máximo','6 decimales!!!','error');
            pasa = false;
        }

        if($this.find('.precio').val()>0 && $this.find('.id_moneda').val()>0){}
        else
        {
            swal('No pueden haber','campos vacios!!!','error');
            pasa = false;
        }
    });

    return pasa;
}
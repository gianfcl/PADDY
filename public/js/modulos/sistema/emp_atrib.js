$( document ).ready(function() {

    jQuery.validator.setDefaults({
        debug: true,
        success: "valid",
        ignore: ""
    });

    $('#form_save_empresa_impuesto').validate({
        
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
            if(element.parent('.form-group').length) 
            {
                error.insertAfter(element.parent());
                //element.closest('.control-group').find('.help-block').html(error.text()); 
            } 
            else { 
                if(element.parent('.col-md-12').length) { error.insertAfter(element.parent());}
                else if(element.parent('.col-md-9').length) { error.insertAfter(element.parent());}
                else {}
            }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'empresa/save_empresa_impuesto',
                type: 'POST',
                data: $('#form_save_empresa_impuesto').serialize(),
                dataType: "json",
                beforeSend: function() {},
                success: function(response) {
                    if (response.code==1) {
                        swal({
                            title : "Se guardó la configuración",
                            text: 'exitosamente!',
                            type: 'success',
                            confirmButtonText: 'Listo!',
                            confirmButtonColor: '#3085d6',
                            }).then(function () {
                              location.reload();
                            });
                    }
                    else
                    {
                      alerta('No se pudo guardar!','Contacte con soporte!','error');
                    }
                },
                complete: function() {}
            });
        }
    });

    $('.inicio_vigencia').datetimepicker({
        format: 'DD-MM-YYYY',
        locale: moment.locale('es')
    });
    $('.fin_vigencia').datetimepicker({
        format: 'DD-MM-YYYY',
        locale: moment.locale('es'),
        useCurrent: false
    });
});

$(document).on('click','.add_igv',function()
{
    var pasa = true;
    var fecha='';
    $('tbody#cont_igv tr input').each(function( index, value ) {
        if($(this).val() == '')
            pasa = false;
    });

    if(pasa ==true)
    {
        var c = 1;
        var c2 = 0;
        $('tbody#cont_igv tr').each(function( index, value ) {
            c2++;
            if($(this).hasClass('gen_igv'))
                c++;

            fecha = $(this).find('input.fin_vigencia').val();
        });
        fecha = (fecha.length>0) ? moment(fecha, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY') : fecha;
        var rOnly = (c2>=1) ? "readonly" : ''; 

        var txt =   "<tr class='gen_igv'>"+
                        "<td><input type='text' id='igvgen_"+c+"' name='igvgen[g_"+c+"]' class='form-control'></td>"+
                        "<td><input type='text' id='inivigen_"+c+"' name='inivigen[g_"+c+"]' class='form-control inicio_vigencia' value='"+fecha+"' "+rOnly+"></td>"+
                        "<td><input type='text' id='finvigen_"+c+"'name='finvigen[g_"+c+"]' class='form-control fin_vigencia'></td>"+
                        "<td><center><a href='javascript:void(0);'' class='btn btn-danger delete btn-xs'><i class='fa fa-trash-o'></i></a></center></td>"+
                    "</tr>";
        $('#cont_igv').append(txt);

        $('.inicio_vigencia').datetimepicker({
            format: 'DD-MM-YYYY',
            locale: moment.locale('es')
        });

        $('.fin_vigencia').datetimepicker({
            format: 'DD-MM-YYYY',
            locale: moment.locale('es'),
            useCurrent: false
        });

        $("#inivigen_"+c).on("dp.change", function (e) {
            $("#finvigen_"+c).data("DateTimePicker").minDate(e.date);
        });

        $("#finvigen_"+c).on("dp.change", function (e) {
            $("#inivigen_"+c).data("DateTimePicker").maxDate(e.date);
        });
    }
    else
    {
        alerta('Aún hay campos','sin rellenar','error');
    }
});

$(document).on('click','.delete',function(){
    var atttr = $(this).closest('tr').prop('class');
    if(atttr) // Solo los TR que tienen clase son "genericos" , los que no tienen forman parte de la BD y necesitan una consulta para ser eliminados.
    {
        $(this).parents('tr').remove();
    }
    else
    {
        var div_ = $(this).closest('table').parent().prop('id');
        var id = $(this).parents('tr').find('input').eq(0).prop('id');
        console.log(div_);
        switch(div_)
        {
            case 'div_igv':
                var nomb = "IGV";
                var func = "delete_impxemp";
                var param = "id_empresa_impuesto";
                id = id.replace('igvgen_','');

            break;
            case 'div_isc':
                var nomb = "ISC";
                var func = "delete_impxemp";
                var param = "id_empresa_impuesto";
                id = id.replace('iscgen_','');
            break;
            case 'div_reg':
                var nomb = "Régimen";
                var func = "delete_regxemp";
                var param = "id_empresa_regimen";
                id = id.replace('inivigenreg_','');
            break;
        }

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
                    url: $('base').attr('href') + 'empresa/'+func,
                    type: 'POST',
                    data: param+'='+id,
                    dataType: "json",
                    beforeSend: function() {
                    
                    },
                    success: function(response) {
                        if (response.code==1) 
                        {
                            location.reload();
                        }
                    },
                    complete: function() {
                  
                    }
                });
            }
            else{};
        });   
    }
});

$(document).on('click','.add_isc',function()
{
    var pasa = true;
    var fecha='';
    $('tbody#cont_isc tr input').each(function( index, value ) {
         if($(this).val() == '')
            pasa = false;
    });

    if(pasa ==true)
    {
        var c = 1;
        var c2 = 0;
        $('tbody#cont_isc tr').each(function( index, value ) {
            c2++;
            if($(this).hasClass('gen_isc'))
                c++;

            fecha = $(this).find('input.fin_vigencia').val();
        });

        fecha = (fecha.length>0) ? moment(fecha, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY') : fecha;
        var rOnly = (c2>=1) ? "readonly" : ''; 

        var txt =   "<tr class='gen_isc'>"+
                        "<td><input type='text' id='iscgen_"+c+"' name='iscgen[g_"+c+"]' class='form-control'></td>"+
                        "<td><input type='text' id='inivigenisc_"+c+"' name='inivigenisc[g_"+c+"]' class='form-control inicio_vigencia' value='"+fecha+"' "+rOnly+"></td>"+
                        "<td><input type='text' id='finvigenisc_"+c+"'name='finvigenisc[g_"+c+"]' class='form-control fin_vigencia'></td>"+
                        "<td><center><a href='javascript:void(0);'' class='btn btn-danger delete btn-xs'><i class='fa fa-trash-o'></i></a></center></td>"+
                    "</tr>";
        $('#cont_isc').append(txt);

        $('.inicio_vigencia').datetimepicker({
            format: 'DD-MM-YYYY',
            locale: moment.locale('es')
        });
        $('.fin_vigencia').datetimepicker({
            format: 'DD-MM-YYYY',
            locale: moment.locale('es'),
            useCurrent: false
        });

        $("#inivigenisc_"+c).on("dp.change", function (e) {
            $("#finvigenisc_"+c).data("DateTimePicker").minDate(e.date);
        });

        $("#finvigenisc_"+c).on("dp.change", function (e) {
            $("#inivigenisc_"+c).data("DateTimePicker").maxDate(e.date);
        });
    }
    else
    {
        alerta('Aún hay campos','sin rellenar','error');
    }
});

$(document).on('click','.add_reg',function()
{
    var pasa = true;
    var fecha='';
    $('tbody#cont_reg tr input.form-control').each(function( index, value ) {
        if($(this).val() == '')
            pasa = false;
    });

    if(pasa ==true)
    {
        var c = 1;
        var c2 = 0;
        $('tbody#cont_reg tr').each(function( index, value ) {
            c2++;
            if($(this).hasClass('gen_reg'))
                c++;

            fecha = $(this).find('input.fin_vigencia').val();
        });
        fecha = (fecha.length>0) ? moment(fecha, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY') : fecha;
        var rOnly = (c2>=1) ? "readonly" : ''; 
        var cbx = $('#cbx_regimen').val();
        var txt =   "<tr class='gen_reg'>"+
                        "<td><select class='form-control' id='reggen_"+c+"' name='reggen[g_"+c+"]'>"+cbx+"</select></td>"+
                        "<td><input type='text' id='inivigenreg_"+c+"' name='inivigenreg[g_"+c+"]' class='form-control inicio_vigencia' value='"+fecha+"' "+rOnly+"></td>"+
                        "<td><input type='text' id='finvigenreg_"+c+"'name='finvigenreg[g_"+c+"]' class='form-control fin_vigencia'></td>"+
                        "<td><center><a href='javascript:void(0);'' class='btn btn-danger delete btn-xs'><i class='fa fa-trash-o'></i></a></center></td>"+
                    "</tr>";
        $('#cont_reg').append(txt);

        $('.inicio_vigencia').datetimepicker({
            format: 'DD-MM-YYYY',
            locale: moment.locale('es')
        });

        $('.fin_vigencia').datetimepicker({
            format: 'DD-MM-YYYY',
            locale: moment.locale('es'),
            useCurrent: false
        });

        $("#inivigenreg_"+c).on("dp.change", function (e) {
            $("#finvigenreg_"+c).data("DateTimePicker").minDate(e.date);
        });

        $("#finvigenreg_"+c).on("dp.change", function (e) {
            $("#inivigenreg_"+c).data("DateTimePicker").maxDate(e.date);
        });
    }
    else
    {
        alerta('Aún hay campos','sin rellenar','error');
    }
});
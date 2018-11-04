$(document).on('click', '.guardar', function (e) {

   // var n_inputs = $('form#form_save_atributos div.form-group div.col-md-6 input').length;
   //  var inputs = $('form#form_save_atributos div.form-group div.col-md-6 input');
    var gempty = 0;
    var oempty = 0
    var n_obligatorios = 0;
    var t = 0; 
    var elm = ""; 
    $('form#form_save_atributos div.form-group div.col-md-6 input').each(function(indice, elemento) {
        //console.log('El elemento con el índice '+indice+' contiene '+$(elemento).val());
        //console.log('class: '+ $(elemento).attr('class'));
        //$(elemento).attr({ 'class':'2ez4rtz'});
        elm = $(elemento).val();
        t++;
        if (elm.trim().length) {
            gempty 
        } 
        else { 
            gempty++ 
        } 
            //console.log($(elemento).attr('class'))
        if ($(elemento).attr('class') == "form-control obligatorio" ) {
            n_obligatorios ++;
            if (($(elemento).val()).trim().length) {}
            else {oempty++;}
        } 
    });
    /*console.log('general: '+gempty);
    console.log('obligatorio: '+oempty);
    console.log('obligatorio_c: '+n_obligatorios);
    console.log('total: '+t); */

    //Si todos los campos obligarios estan vacios
    

    //Si todos los campos  estan vacios
    if (gempty>0 && t == gempty) {
        
         alerta('Alerta!', 'Todos los campos estan vacíos', 'warning');
    }

    else {
         //Si todos los campos obligatorios estan vacios
         if (oempty>0 && n_obligatorios == oempty) {

        alerta('No se puede guardar :( ', 'Faltan llenar campos obligarios', 'error');
        
        } 
        else {
               $.ajax({
                   url: $('base').attr('href') + 'activofijo/save_atributos',
                   type: 'POST',
                   data:  $('#form_save_atributos').serialize(),
                   dataType: "json",
                   beforeSend: function() {
                        //showLoader();
                   },
                   success: function(response) {
                                   
                   },
                   complete: function() {
                                
                   }
               });
        }       
    }
});   




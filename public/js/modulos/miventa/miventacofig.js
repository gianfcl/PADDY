$( document ).ready(function() {
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

    $('#form_save_config').validate({
	      rules:
	      {
	        id_grupo: {
	          required:true
	        }
	      },
	      messages: 
	      {
	        id_grupo: {required:"Grupo"}
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
	          url: $('base').attr('href') + 'miventacofig/save_miventacofig',
	          type: 'POST',
	          data: $('#form_save_config').serialize(),
	          dataType: "json",
	          beforeSend: function() {
	              //showLoader();
	          },
	          success: function(response) {
	            if (response.code==1) {
	               $('#id_miventaconfig').val(response.data.id)                               
	            }
	          },
	          complete: function(response) {
	            var id_miventaconfig = parseInt($('#id_miventaconfig').val());
	            id_miventaconfig = (id_miventaconfig>0) ? (id_miventaconfig) : ("0");
	            var text = (id_miventaconfig=="0") ? ("Guardo!") : ("Edito!");
	            if(response.code == 0)
	            {
	              text = response.message;
	            }
	            alerta('Guardo', 'Con exito', 'success');
	          }
	        });
	      }
    });

    /*$('.demo2').colorpicker().on('changeColor', function(event){
  alert(event.color.toHex());
});*/

$('.demo2')
    .colorpicker()
    .on('change', function(e) { console.log('change'); })
    .on('changeColor', function(e) { console.log('changeColor'); })
    .on('hidePicker', function(e) { console.log('hidePicker->'+e.color.toHex()); });

/*	
hidePicker
destroy
	$('.demo2').colorpicker()
		.on('changeColor', function(ev){
		bodyStyle.backgroundColor = ev.color.toHex(); alert(ev.color.toHex())
		})
		.on('change', function (ev) {
			alert($(this).val())
		})
	);

	$('.demo2')
    .attr('data-value', $(this).val())
    .colorpicker()
    .on('change', function() {
        if( $(this).val() !== $(this).attr('data-value') ) {
            alert('change');
            //$(this).attr('data-value', $(this).val());
        }
    });
*/

});


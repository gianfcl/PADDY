$(document).on("click","#id_entrar",function(){
	var nm_usu=$("#nombre_usuario").val();  
	var cl_usu=$("#clave_usuario").val();
	var temp ="";
	if (nm_usu.trim().length) {
		temp = 'usuario='+nm_usu;
	}
	if (cl_usu.trim().length) {
		temp = temp +'&clave='+cl_usu;
	}
	if (nm_usu.trim().length && cl_usu.trim().length) {
		console.log(temp);
		$.ajax({
			url:'ingresar.php',
			type: 'POST',
	    	data: temp,
	    	dataType: "json",
	    	beforeSend: function() {
	    	},
	        success: function(response) {
	        	console.log(response.data);
	        	var us=response.data.usuario;
	        	if (response.error_code==1) {
	        		alerta("Bienvenido usuario "+ us);
	        		window.location.href = "../public/mapa.php";
	        	}else{
	        		alerta("Usuario o Clave incorrecta");
	        	}

	        },
	        complete: function() {
	        }
		});
	}
});

$(document).on("click","#id_registrar",function(){
	//$('#registro').modal('show');
});

$(document).on("click",".registrar_datos",function(){
	var f =$('#fecha_hoy').val();
	var nom =$('#nombres').val();
	var docu_usu =$('#nombres').val();
	var ape =$('#apellidos').val();
	var usu =$('#usuario').val();
	var cla =$('#clave').val();
	var fecha_naci =$('#fecha_naci').val();
	var cor =$('#correo').val();

	var temp = 'fecha_hoy='+f;
	if (nom && ape && cla && usu && fecha_naci) {

	temp = temp +'&nombre='+nom;
	temp = temp +'&apellido='+ape;
	temp = temp +'&usuario='+usu;
	temp = temp +'&clave='+cla;
	temp = temp +'&fecha_nacimiento='+fecha_naci;
	if (cor.trim().length) {
		temp = temp +'&correo='+cor;
	}
	console.log(temp);
		$.ajax({
			url:'registrar.php',
			type: 'POST',
        	data: temp,
        	dataType: "json",
        	beforeSend: function() {
	        },
	        success: function(response) {
	        	if (response.error_code==1) {
	        		console.log(response);
	        		swal({
					    title: 'Confirm',
					    text: 'Estas registrado',
					    type: 'success',
					    confirmButtonColor: '#3085d6',
					    cancelButtonColor: '#d33',
					    confirmButtonText: 'SI'
					  }).then(function(isConfirm) {
					  	if (isConfirm) {$('#hacer_registro').modal('hide');}
					  });
					window.location.href = "../public/mapa.php";
	        	}else{
	        		alerta("Error","No se pudo registrar, intenta nuevamente","warning");
	        	}
	        },
	        complete: function() {
	        }
		});
	}else{
		alerta("Llene los datos faltantes");
	}
});
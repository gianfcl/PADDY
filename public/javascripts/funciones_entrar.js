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

$(document).on("click",".registrar_datos",function(){
	var f =$('#fecha_hoy').val();
	var nom =$('#nombres').val();
	var docu_usu =$('#docu_usu').val();
	var ape =$('#apellidos').val();
	var cla =$('#clave').val();
	var fecha_naci =$('#fecha_naci').val();
	var cor =$('#correo').val();

	var temp = 'fecha_hoy='+f;
	if (nom && ape && cla && fecha_naci && parseInt(docu_usu)) {

	temp = temp +'&nombre='+nom;
	temp = temp +'&apellido='+ape;
	temp = temp +'&dni='+docu_usu;
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
					    confirmButtonText: 'SI',
					  }).then(function(isConfirm) {
					  	if (isConfirm) {$('#hacer_registro').modal('hide');}
					  });
					window.location.href = "../public/mapa.php";
	        	}else{
	        		alerta("Error","No se pudo registrar, intenta nuevamente","warning");
	        	}
	        },
	        complete: function() {
	        	$('#iniciarregistro').modal('hide');
	        }
		});
	}else if (!parseInt(docu_usu)){
		alerta("El DNI no es correcto");
	}else{
		alerta("Llene los datos faltantes");
	}
});

$(document).on("click",".registrar_datos_emp",function(){
	var f =$('#fecha_hoy_emp').val();
	var nom =$('#nombres_emp').val();
	var docu_usu =$('#docu_usu_emp').val();
	var cla =$('#clave_emp').val();
	var cor =$('#correo').val();

	var temp = 'fecha_hoy='+f;
	if (nom && cla && parseInt(docu_usu)) {

	temp = temp +'&nombre='+nom;
	temp = temp +'&dni='+docu_usu;
	temp = temp +'&clave='+cla;	
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
					    confirmButtonText: 'SI',
					  }).then(function(isConfirm) {
					  	if (isConfirm) {$('#hacer_registro').modal('hide');}
					  });
					window.location.href = "../public/mapa.php";
	        	}else{
	        		alerta("Error","No se pudo registrar, intenta nuevamente","warning");
	        	}
	        },
	        complete: function() {
	        	$('#iniciarregistro').modal('hide');
	        }
		});
	}else if (!parseInt(docu_usu)){
		alerta("El RUC no es correcto");
	}else{
		alerta("Llene los datos faltantes");
	}
});
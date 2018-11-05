<?php
require "conexion.php";
$conn=conectar();

if (isset($_POST)) {
    $data['success'] = true;
    $data['error_msg'] = "ERROR";
    $data['error_code'] = "0";
    $data['data'] = "";
	//print_r($_POST);die();
	$fe_cre=date('Y-m-d H:i:s',strtotime($_POST['fecha_hoy']));
	$dni=!empty($_POST['dni']) ? $_POST['dni'] : "";
	$nom=!empty($_POST['nombre']) ? $_POST['nombre'] : "";
	$ape=!empty($_POST['apellido']) ? $_POST['apellido'] : "";
	$cla=!empty($_POST['clave']) ? $_POST['clave'] : "";
	$corr=!empty($_POST['correo']) ? $_POST['correo'] : "";
	$fec_na=date('Y-m-d H:i:s',strtotime($_POST['fecha_nacimiento']));
	$sql = "INSERT INTO tb_usuarios (dni_usuario, nombre_usuario, apellido_usuario,clave,correo,fecha_nacimiento,fecha_creacion)
	VALUES ('".$dni."','".$nom."','".$ape."','".$cla."','".$corr."','".$fec_na."','".$fe_cre."') ";

	if (mysqli_query($conn,$sql)) {
        $data['success'] = true;
        $data['error_msg'] = "OK";
        $data['error_code'] = "1";
        $data['data'] = "Guardo";
	}
	echo json_encode($data);
}

?>
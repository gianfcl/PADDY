<?php
require "conexion.php";
$conn=conectar();

if (isset($_POST)) {
    $data['success'] = true;
    $data['error_msg'] = "ERROR";
    $data['error_code'] = "0";
    $data['data'] = "";
	//print_r($_POST);die();
	$usuario=!empty($_POST['usuario']) ? trim($_POST['usuario']) : "";
	$clave=!empty($_POST['clave']) ? trim($_POST['clave']) : "";
	$sql = "SELECT * FROM tb_usuarios WHERE usuario='$usuario' AND clave='$clave'";
	$result=$conn->query($sql);
	$row=$result->fetch_assoc();//print_r($row);

	if (mysqli_query($conn,$sql) && ($result->num_rows > 0)) {
        $data['success'] = true;
        $data['error_msg'] = "OK";
        $data['error_code'] = "1";
        $data['data'] = $row;
	}
	echo json_encode($data);
}

?>
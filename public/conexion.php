<?php
function conectar(){
	//$cnx=mysqli_connect("127.0.0.1:33065","root","","paddybd");
	$con=new mysqli("127.0.0.1","root","","paddybd") or die ("Error en la conexion".mysqli_connect_error());
	return $con;
}
?>
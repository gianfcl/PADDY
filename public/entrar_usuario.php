<?php
require "conexion.php";
conectar();
?>
<!DOCTYPE html>
<html>
<head>
	<title>PADDY</title>
	<script href="https://code.jquery.com/jquery-3.3.1.min.js" type="text/javascript"></script>
	<script src="javascripts/jquery-3.3.1.js" type="text/javascript"></script>
	<script src="javascripts/funciones_entrar.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<link rel="stylesheet" href="css/bootstrap.css">
	<link rel="stylesheet" href="stylesheets/style.css">
	<link rel="stylesheet" href="css/custom.css">
	<link rel="stylesheet" href="css/bootstrap.min.css">
	<link rel="stylesheet" href="css/datatables/css/jquery.datatables.css">
	<link rel="stylesheet" href="css/login/style.css">
	<link rel="stylesheet" href="css/login/form-elements.css">
	<link rel="stylesheet" href="css/editable/bootstrap-editable.css">
	<link rel="stylesheet" href="fonts/css/font-awesome.css">
	<link rel="stylesheet" href="css/datatables/buttons.bootstrap.min.css">
	<link rel="stylesheet" href="css/datatables/fixedHeader.bootstrap.min.css">
	<link rel="stylesheet" href="css/datatables/jquery.dataTables.min.css">
	<link rel="stylesheet" href="css/datatables/responsive.bootstrap.min.css">
	<link rel="stylesheet" href="css/datatables/scroller.bootstrap.min.css">
	<link rel="stylesheet" href="css/tagsinput/bootstrap-tagsinput.css">
	<link rel="stylesheet" href="css/sweetalert/sweetalert-30-05-2017.css">
	<script src="js/textarea/autosize.min.js"></script>
	<script src="js/tags/jquery.tagsinput.min.js"></script>
	<script src="js/jquery.min.js"></script>
	<script src="js/jquery-2.1.3.js"></script>
	<script src="js/moment/moment.min.js"></script>
	<script src="js/sweetalert/sweetalert_30-05-2017.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<!--script src="js/login/jquery-1.11.1.min.js"></script-->
	<script src="js/sweetalert/sweetalert.min.js"></script>
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
	<script src="javascripts/main.js"></script>
	<style>
		.head_index{
			background: black;
		}
		.cuerpo{
			background-image: url('images/fondo2.jpg');
			color: #09A4F2;
			height:100%;
		}
		.footer_index{
			background: #02fff5e8;
			color: black;
			height: 8%;
		}
		.h1_index{
			background:#14E7EA;
			text-align: center;
			font-family: Arial, Helvetica, sans-serif;
			margin-top:0px;
		}
	</style>
<h1 class="h1_index"><img style="margin-bottom:65px;" src="images/paddy_logo.png" alt="Logo">ADDY</h1>
</head>
<body>
<div class="top-content forminicio cuerpo">
	<div class="col-sm-4 col-sm-offset-4 form-box">
		<div class="inner-bg">
		<div class="row">
			<div class="form-top">
				<h1>BIENVENIDO</h1>
			</div>
			<div class="form-bottom">
				<form role="form" class="login-form" method="POST" action="" id="login-form">
					<div class="form-group">
						<div class="input-group">
							<label>NOMBRE: </label>
							<input type="text" class="form-control" name="nombre_usuario" id="nombre_usuario" placeholder="Nombre">
						</div>
					</div>
					<div class="form-group">
						<div class="input-group">
							<label>Clave: </label>
							<input type="password" class="form-control" name="clave_usuario" id="clave_usuario" placeholder="Clave">
						</div>
					</div>
				</form>
				<div class="btn-toolbar">
					<div class="btn-group pull-right">
						<button type="submit" id="id_entrar" class="btn btn-info"><i>Entrar</i></button>
					</div>
					<div class="btn-group pull-right">
						<button type="button" data-toggle="modal" data-target="#iniciarregistro" id="iniciar_re" class="btn btn-info"><i>Registrar</i></button>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</div><div class="clearfix"></div>


</body>
<footer class="footer_index">
	<div style="margin-left: 15px;" class="pull-left">
		<button class="fa fa-3x fa-facebook-square" onClick="location.href='https://www.facebook.com/PaddyPeru/'"></button>
	</div>
</footer>
</html>
<?php require "iniciar_registro.php"; ?>
<?php require "registro.php"; ?>
<?php require "registro_emp.php"; ?>
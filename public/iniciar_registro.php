<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
<div class="modal fade" id="iniciarregistro" tabindex="-1" role="document" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" data-backdrop="false" aria-hidden="true">&times;</button>
        <h4 class="modal-title" style="color: black;">Seleccionar Tipo Persona</h4>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
            <form class="form-horizontal" id="form_iniciaringreso" name="forminiciaringreso" role="form" style="color: black;">
              <div class="form-group">
                <label for="id_registrar_per" class="control-label col-md-3 col-sm-3 col-xs-12">Persona Natural</label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <button type="button" data-toggle="modal" data-target="#hacer_registro" data-dismiss="modal" data-backdrop="false" id="id_registrar_per" class="btn btn-success btn-sm">&nbsp;<i class="fa fa-save"></i><span class="hide-on-phones"></span></button>
                </div>
              </div>

              <div class="form-group">
                <label for="id_registrar_emp" class="control-label col-md-3 col-sm-3 col-xs-12">Persona Juridica</label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <button type="button" data-toggle="modal" data-target="#hacer_registro_emp" id="id_registrar_emp"  data-dismiss="modal" data-backdrop="false" class="btn btn-success btn-sm">&nbsp;<i class="fa fa-save"></i><span class="hide-on-phones"></span></button>
                </div>
              </div>
            </form>
        </div>
      </div>
      <div class="modal-footer"></div>
    </div>
  </div>
</div>
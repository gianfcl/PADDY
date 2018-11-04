<?php
  if(isset($tipo) && strlen(trim($tipo))>0)
  {
    switch ($tipo) {
      case 'main':

        if(isset($datos_cuerpo) && is_array($datos_cuerpo))
        {   
          foreach ($datos_cuerpo as $key => $value) 
          {
?>
            <div class='col-md-12 col-sm-6 col-xs-6 panel panel-primary ' style="margin-bottom: 2%;">

              <div class='form-group col-md-12 col-sm-12 col-xs-12 panel-heading'>
                <h4 class="panel-title"><?php echo $value['pregunta']; ?></h4>
              </div>
     
              <div class='form-group col-md-12 col-sm-12 col-xs-12' style="background-color: <?php echo $value['color']; ?> ">
<?php  
                switch (intval($value['tipo_alternativa'])) 
                {
                  case 1:
                    foreach ($value['alternativas'] as $k => $v) 
                    {
?>
                      <div class='form-group col-md-12 col-sm-12 col-xs-12 form-inline form-check'>
                        <input type="checkbox" id="alt_<?php echo $v['id_pregunta_alternativa']; ?>" value="<?php echo $v['id_pregunta_alternativa']; ?>" name="pre_<?php echo "[".$value['id_eplantilla_pregunta']."][]";?>" class="form-check-input"> <?php echo $v['alternativa'] ?>
                      </div>
<?php                      
                    }
                  break;
                  case 2:
                    foreach ($value['alternativas'] as $k => $v) 
                    {
?>
                      <div class='form-group col-md-12 col-sm-12 col-xs-12 form-inline'>
                        <input type="radio" id="alt_<?php echo $v['id_pregunta_alternativa']; ?>" name="pre_<?php echo "[".$value['id_eplantilla_pregunta']."][]";?>" value="<?php echo $v['id_pregunta_alternativa']; ?>" class="form-check-input"> <?php echo $v['alternativa'] ?>
                      </div>
<?php                      
                    }
                  break;
                  case 3:
?>
                    <div class='form-group col-md-6 col-sm-12 col-xs-12'>  
                      <input type="text" name="pre_<?php echo "[".$value['id_eplantilla_pregunta']."]";?>" class="form-control" maxlength="<?php if(!empty($value['max_caracter'])){ echo $value['max_caracter'];} ?>">
                    </div>
<?php
                  break;
                  case 4:
?>
                    <div class='form-group col-md-6 col-sm-12 col-xs-12'>
                      <textarea name="pre_<?php echo "[".$value['id_eplantilla_pregunta']."]";?>" class="form-control" maxlength="<?php if(!empty($value['max_caracter'])){ echo $value['max_caracter'];} ?>"></textarea>
                    </div>
<?php
                  break;
                }
?>
              </div>
            </div>
<?php            
          }    
        }
      break;
    }      
  }        
?>
import { Component, OnInit } from '@angular/core';
import { Examen } from 'src/app/models/examen';
import { ExamenService } from 'src/app/services/examen.service';
import { RespuestaService } from 'src/app/services/respuesta.service';
import Swal from 'sweetalert2';
import { CommonListarComponent } from '../common-listar.component';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css']
})
export class ExamenesComponent extends CommonListarComponent<Examen, ExamenService> implements OnInit {


  constructor(
    service: ExamenService,
    private respuestaService: RespuestaService) {
    super(service);
    this.titulo = 'Listado de Examenes';
    this.nombreModel ="Examenes";
    
   }
   public eliminarConRespuestas(examen: Examen): void{
    Swal.fire({
      title: 'Cuidado:',
      width: 400,
      text: `¿Seguro que quieres eliminar a ${examen.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.respuestaService.eliminarRespuestasByExamen(examen)
        .subscribe(()=>{          
          //filtro los examenes y quito el examen actual: Estatico
          //this.lista= this.lista.filter(e=> e.id!==examen.id);
          //Dinamico          
            this.service.eliminar(examen.id).subscribe(()=>{                      
              Swal.fire('Eliminado:',`${this.nombreModel} ${examen.nombre} eliminado con exito.`, 'success');
            });
            this.calcularPaginacion();
          Swal.fire('Eliminado: ', `Examen ${examen.nombre} y sus respuestas relacionadas eliminadas correctamente.`, 'success');
        });
      }
    });     
   
   }
}

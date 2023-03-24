import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from 'src/app/services/alumno.service';
import Swal from 'sweetalert2';
import { CommonFormComponent } from '../common-form.component';

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.css']
})
export class AlumnosFormComponent 
extends CommonFormComponent<Alumno, AlumnoService> implements OnInit {

  private foto: File;
  
  constructor(service: AlumnoService,
    router: Router,
    route: ActivatedRoute) {
    super(service, router, route)
    this.titulo = 'Crear Alumnos';
    this.model = new Alumno();
    this.redirect = '/alumnos';
    this.nombreModel = 'Alumno';
  }

  public seleccionarFoto(event): void{
    this.foto = event.target.files[0];
    console.info(this.foto);
    if(this.foto.type.indexOf('image') <0 ){
      this.foto=null;
      Swal.fire('Error al seleccionar la foto:',
      'El archivo debe de ser del tipo imagen',
       'error');
    }
  }

  //override
  public crear(): void{
    if(!this.foto){
      super.crear();
    }else{
      this.service.crearConFoto(this.model, this.foto)
      .subscribe(alumno =>{
        console.log(alumno);
        Swal.fire('Nuevo:',`${this.nombreModel} ${alumno.nombre} creado con exito`, 'success');
        this.router.navigate([this.redirect]);
      }, err=>{
          if(err.status === 400){
            this.error=err.error;
            console.log(this.error);
          }
      });
    }
  }

    //override
    public editar(): void{
      if(!this.foto){
        super.editar();
      }else{
        this.service.editarConFoto(this.model, this.foto)
        .subscribe(alumno =>{
          console.log(alumno);
          Swal.fire('Modificado:',`${this.nombreModel} ${alumno.nombre} actualizado con exito`, 'success');
          this.router.navigate([this.redirect]);
        }, err=>{
            if(err.status === 400){
              this.error=err.error;
              console.log(this.error);
            }
        });
      }
    }
}

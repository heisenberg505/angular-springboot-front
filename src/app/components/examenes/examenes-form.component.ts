import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura } from 'src/app/models/asignatura';
import { Examen } from 'src/app/models/examen';
import { Pregunta } from 'src/app/models/pregunta';
import { ExamenService } from 'src/app/services/examen.service';
import Swal from 'sweetalert2';
import { CommonFormComponent } from '../common-form.component';

@Component({
  selector: 'app-examenes-form',
  templateUrl: './examenes-form.component.html',
  styleUrls: ['./examenes-form.component.css']
})
export class ExamenesFormComponent 
extends CommonFormComponent<Examen, ExamenService> implements OnInit {
  asignaturasPadre: Asignatura[]=[];
  asignaturasHijo: Asignatura[]=[];
  errorPreguntas: string;

  constructor(service: ExamenService, 
    router: Router, 
    route: ActivatedRoute) { 
    super(service, router, route);
    this.titulo = 'Crear Examen';
    this.model = new Examen();
    this.redirect = '/examenes';
    this.nombreModel = 'Examen';
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params =>{
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(m =>{ 
          this.model = m;
          this.titulo = 'Editar ' + this.nombreModel;
          //ir por asignaturas hijas al editar, al back o tomarlo del model
          this.cargarHijos();
          /*
          this.service.findAllAsignaturas().subscribe(asignaturas => 
            this.asignaturasHijo=asignaturas
              .filter(a => a.padre && a.padre.id===this.model.asignaturaPadre.id));
            */
        });
      }
    });

    this.service.findAllAsignaturas()
    .subscribe(asignaturas => 
      this.asignaturasPadre = asignaturas.filter(a=>!a.padre));
  }

  public crear(): void{
    if(this.model.preguntas.length===0){
      this.errorPreguntas='El examen debe de tener preguntas';
      //Swal.fire('Error preguntas','El examen debe de tener preguntas','error');
      return;
    }
    this.errorPreguntas=undefined;
    this.eliminarPreguntaVacias();
    super.crear();
  }

  public editar(): void{
    if(this.model.preguntas.length===0){
      this.errorPreguntas='El examen debe de tener preguntas';
      //Swal.fire('Error preguntas','El examen debe de tener preguntas','error');
      return;
    }
    this.errorPreguntas=undefined;
    this.eliminarPreguntaVacias();
    super.editar();
  }
  public cargarHijos(): void{
    //this.model.asignaturaPadre viene del examenes-form.component.html en el select
    this.asignaturasHijo =  
      this.model.asignaturaPadre? this.model.asignaturaPadre.hijos :[];
  }

  public compararAsignatura(a1: Asignatura, a2: Asignatura): boolean{
    if (a1 === undefined && a2 === undefined) {
      return true;
    }
    if (a1 === null || a2 === null || a1 === undefined || a2 === undefined) {
      return false;
    }
    if (a1.id === a2.id) {
      return true;
    }
  }

  public agregarPregunta(): void {
    this.model.preguntas.push(new Pregunta());
  }
  public asignarTexto(pregunta: Pregunta, event: any): void {
    pregunta.texto = event.target.value as string;
    console.log(this.model);
  }

  public eliminarPregunta(pregunta: Pregunta, i: any): void {
    //devuelve una lista de todas las preguntas diferentes de pregunta.texto
    this.model.preguntas = this.model.preguntas.filter(p => pregunta.texto !== p.texto);
  }
  public eliminarPreguntaVacias(){
    this.model.preguntas = this.model.preguntas.filter(p => p.texto!= null && p.texto.length>0 );
  }
}

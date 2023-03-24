import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { Alumno } from '../models/alumno';
import { Curso } from '../models/curso';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { Examen } from '../models/examen';

@Injectable({
  providedIn: 'root'
})
export class CursoService extends CommonService<Curso>{

  protected baseEndPoint = BASE_ENDPOINT + '/cursos';
  constructor(http: HttpClient) {
    super(http);
  }
  public asignarAlumnos(curso: Curso, alumnos: Alumno[]): Observable<Curso> {
    return this.http.put<Curso>(`${this.baseEndPoint}/${curso.id}/asignar-alumnos`,
      alumnos,
      { headers: this.cabeceras });
  }
  public eliminarAlumno(curso: Curso, alumno: Alumno): Observable<Curso> {
    return this.http.put<Curso>(`${this.baseEndPoint}/${curso.id}/eliminar-alumno`,
      alumno,
      { headers: this.cabeceras });
  }
  public asignarExamenes(curso: Curso, examenes: Examen[]): Observable<Curso> {
    return this.http.put<Curso>(`${this.baseEndPoint}/${curso.id}/asignar-examenes`,
      examenes,
      { headers: this.cabeceras });
  }

  public eliminarExamen(curso: Curso, examen: Examen): Observable<Curso> {
    return this.http.put<Curso>(`${this.baseEndPoint}/${curso.id}/eliminar-examen`,
    examen,
      { headers: this.cabeceras });
  }

  public obtenerCursoByAlumnoId(alumno: Alumno): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseEndPoint}/alumno/${alumno.id}`);
  }
}

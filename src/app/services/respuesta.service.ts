import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Alumno } from '../models/alumno';
import { Examen } from '../models/examen';
import { Respuesta } from '../models/respuesta';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {

  private cabeceras: HttpHeaders= new HttpHeaders({'Content-Type':'application/json'});
  protected baseEndPoint = BASE_ENDPOINT + '/respuestas';

  constructor(private http: HttpClient) {

  }
  public crear(respuestas: Respuesta[]): Observable<Respuesta[]>{
    return this.http.post<Respuesta[]>(this.baseEndPoint,
       respuestas,
       {headers: this.cabeceras});
  } 
  public obtenerRespuestasPorAlumnoPorExamen(alumno: Alumno, examen:Examen): Observable<Respuesta[]>{
    return this.http.get<Respuesta[]>(`${this.baseEndPoint}/alumno/${alumno.id}/examen/${examen.id}`);
  }

  public eliminarRespuestas(alumno: Alumno, examen:Examen): Observable<Respuesta[]>{
    return this.http.delete<Respuesta[]>(`${this.baseEndPoint}/alumno/${alumno.id}/examen/${examen.id}`);
  }

  public eliminarRespuestasByExamen(examen: Examen): Observable<void>{
    return this.http.delete<void>(`${this.baseEndPoint}/examen/${examen.id}`);
  }
}

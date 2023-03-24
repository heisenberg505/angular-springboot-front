import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno';
import { CommonService } from './common.service';
import { BASE_ENDPOINT } from '../config/app';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService extends CommonService<Alumno>{
  
  protected baseEndPoint = BASE_ENDPOINT+'/alumnos';
    
  constructor(http: HttpClient){
    super(http);
  }

  public crearConFoto(alumno: Alumno, file: File): Observable<Alumno>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nombre', alumno.nombre);
    formData.append('apellido', alumno.apellido);
    formData.append('email', alumno.email);
    //guardamos los datos en el form data y se envia. No se envia un Content-Type: application/json como en crear o editar
    return this.http.post<Alumno>(this.baseEndPoint+'/crear-con-foto',
     formData);
  }

  public editarConFoto(alumno: Alumno, file: File): Observable<Alumno>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nombre', alumno.nombre);
    formData.append('apellido', alumno.apellido);
    formData.append('email', alumno.email);
    //guardamos los datos en el form data y se envia. No se envia un Content-Type: application/json como en crear o editar
    return this.http.put<Alumno>(`${this.baseEndPoint}/editar-con-foto/${alumno.id}`,
     formData);
  }
  
  public filtrarPorNombre(nombre: string): Observable<Alumno[]>{
    return this.http.get<Alumno[]>(`${this.baseEndPoint}/filtrar/${nombre}`);
  }
}

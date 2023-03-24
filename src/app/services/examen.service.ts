import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Asignatura } from '../models/asignatura';
import { Examen } from '../models/examen';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ExamenService extends CommonService<Examen>{
  //sobre escribe el baseEndPoint, cuando se inyecta ya tiene este valor
  protected baseEndPoint = BASE_ENDPOINT+'/examenes';

  constructor(http: HttpClient) { 
    super(http); 
  }

  public findAllAsignaturas(): Observable<Asignatura[]>{
    return this.http.get<Asignatura[]>(`${this.baseEndPoint}/asignaturas`);
  }

  public filtrarPorNombre(nombre: string): Observable<Examen[]>{
    return this.http.get<Examen[]>(`${this.baseEndPoint}/filtrar/${nombre}`);
  }
}

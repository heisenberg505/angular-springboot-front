import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService extends CommonService<Alumno>{
  
  protected baseEndPoint = 'http://localhost:8090/api/alumnos';
    
  constructor(http: HttpClient){
    super(http);
  }
}

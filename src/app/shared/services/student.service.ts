import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Student } from '../models/student.model';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class StudentService {

    constructor(private http: HttpClient, private auth: AuthService) { 
    }
    
    getStudents(): Observable<Student[]>{
        return this.http.get<Student[]>(environment.apiurl + '/students', this.auth.getHttpOptions);
    }

    getGroups(): Observable<String[]>{
        return this.http.get<String[]>(environment.apiurl + '/groups', this.auth.getHttpOptions);
    }

    getStudentsByGroup(group: String): Observable<Student[]>{
        return this.http.get<Student[]>(environment.apiurl + '/groups/' + group, this.auth.getHttpOptions);
    }

    addStudent(student: Student): Observable<any>{
        return this.http.post(environment.apiurl + '/students', student, this.auth.getHttpOptions);
    }


}
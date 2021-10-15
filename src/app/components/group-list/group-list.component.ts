import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Student } from 'src/app/shared/models/student.model';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  groups$!: Observable<String[]>;

  constructor(private studentService: StudentService, private router: Router) { 

  }

  ngOnInit(): void {
    this.groups$ = this.studentService.getGroups();
  }

  clickDetails(group: String){
    this.router.navigate(['group',group]);
  }

}

import { Component, OnInit } from '@angular/core';
import { StudentService } from './shared/services/student.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'template-frontend-h9-routing-lab';

  constructor(){}

  ngOnInit(): void {
  }


}

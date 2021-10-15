import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Student } from 'src/app/shared/models/student.model';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  addForm!: FormGroup;
  isSubmitted: boolean = false;
  constructor(private fb: FormBuilder, private studentService: StudentService, private router: Router) { }

  ngOnInit(): void {
    this.isSubmitted = false;
    this.addForm = this.fb.group({
      name: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.pattern('[0-9]+')]],
      group: ['',  [Validators.required, Validators.minLength(3), Validators.maxLength(12)]]
    });
  }

  get addFormControls() {
    return this.addForm.controls;
  }

  onSubmit(): void{
    let newStudent = new Student(this.addForm.value["name"], this.addForm.value["age"], this.addForm.value["group"]);
    this.studentService.addStudent(newStudent).subscribe(() => {
      this.isSubmitted = true;  
      this.router.navigate(['home']);
    });
  }


}

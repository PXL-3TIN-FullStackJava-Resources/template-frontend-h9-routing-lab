import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  key: String = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.key = this.authService.getKey;
  }

  onSubmit(myForm: any): void{
    this.authService.setKey = myForm.value["key"];
  }

}

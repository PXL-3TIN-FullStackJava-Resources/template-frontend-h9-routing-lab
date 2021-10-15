import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apikey: string;
  private httpOptions: any;

  constructor() {
    this.apikey = '2TINDEVOPS';
    this.httpOptions = {
      headers: new HttpHeaders({
        'Key': this.apikey,
      })
    };
  }


  set setKey(value: string){
    this.apikey = value;
    this.setHttpOptions();
  }

  get getKey(): String{
    return this.apikey;
  }

  setHttpOptions(): void{
    this.httpOptions.headers = this.httpOptions.headers.set('Key', this.apikey);
  }

  get getHttpOptions(): Object{
    return this.httpOptions;
  }

}

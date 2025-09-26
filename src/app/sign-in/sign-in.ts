import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-sign-in',
  imports: [
    Button,
    FormsModule,
    InputText,
    Password,
    Divider
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss'
})
export class SignIn {
  email: string = "";
  username: string = "";
  password: string = "";
  isRegistering: boolean = false;
}

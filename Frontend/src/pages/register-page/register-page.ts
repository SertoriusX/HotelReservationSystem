import { Component } from '@angular/core';
import { AuthService } from '../../service/AuthService/auth-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RegisterModel } from '../../model/AuthModel/register-model';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  constructor(private authSer: AuthService, private router: Router){}

  register(form: NgForm){
    const dto: RegisterModel = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      Roles: "User"
    }
    this.authSer.register(dto).subscribe({
      next: () => {
        this.router.navigate(['/login'])
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
}

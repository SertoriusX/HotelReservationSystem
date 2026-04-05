import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RegisterModel } from '../../model/AuthModel/register-model';
import { AuthService } from '../../service/AuthService/auth-service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-owner-page',
  imports: [FormsModule,RouterModule],
  templateUrl: './register-owner-page.html',
  styleUrl: './register-owner-page.css',
})
export class RegisterOwnerPage {
  constructor(private authSer: AuthService, private router: Router){}

  register(form: NgForm){
    const dto: RegisterModel = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      Roles: "OwnerHotel"
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

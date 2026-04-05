import { Component } from '@angular/core';
import { AuthService } from '../../service/AuthService/auth-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginModel } from '../../model/AuthModel/login-model';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule,RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  constructor(private authSer: AuthService, private router: Router){}

 login(form: NgForm) {
  const dto: LoginModel = form.value;

    this.authSer.login(dto).subscribe({
      next: (res: any) => {
        console.log("Login response:", res);
        this.authSer.saveToken(res.token, res.roles, res.userId);

        if (res.roles === "OwnerHotel") {
          this.router.navigate(['/dash-owner']);
        } else {
          this.router.navigate(['/homapage']);
        }
      },
      error: (err) => {
        console.log("Login error:", err);
      }
    });
}
}

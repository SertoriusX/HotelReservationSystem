import { Component } from '@angular/core';
import { AuthService } from '../../service/AuthService/auth-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule,RouterModule,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private authSer: AuthService, private router: Router){}

  get isLoggedIn(): boolean {
    return !! this.authSer.getToken() ;
  }

  get isUser(): boolean {
    return this.authSer.getRole() === "User";
  }

  get isOwner(): boolean {
    return this.authSer.getRole() === "OwnerHotel";
  }

  logout(): void{
    this.authSer.logout()
    this.router.navigate(['/login'])
  }
}

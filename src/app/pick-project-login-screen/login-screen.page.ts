import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
//import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.page.html',
  styleUrls: ['./login-screen.page.scss'],
})
export class LoginScreenPage implements OnInit {

  constructor(
    // private  authService:  AuthService, 
    private router: Router,
  ) { }

  ngOnInit() {
  }

  pickProject(form) {
    this.router.navigateByUrl('tabs');
    //this.router.navigateByUrl('pick-user-login');
    // this.authService.register(form.value).subscribe((res) => {
    //   this.router.navigateByUrl('home');
    // });
  }

}

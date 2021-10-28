import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-pick-user-login',
  templateUrl: './pick-user-login.page.html',
  styleUrls: ['./pick-user-login.page.scss'],
})
export class PickUserLoginPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  pickUser(form){
    this.router.navigateByUrl('tabs');
  }

}

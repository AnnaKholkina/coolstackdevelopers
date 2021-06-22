import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  aSub: Subscription

  constructor(private auth: AuthService,
              private router: Router) {
    this.form = new FormGroup({
      'email': new FormControl(''),
      'password': new FormControl('')
    })
    this.aSub = new Subscription()
  }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }
  onSubmit(){
    const user = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.form.disable()
    this.aSub = this.auth.register(user).subscribe(
      ()=>{
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        })
      },
      error=> {
        MaterialService.toast(error.error.message)

        this.form.enable()
      }
    )
  }
  ngOnDestroy() {
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy{

  form: FormGroup
  aSub: Subscription //переменная отвечающая за утечку памяти

  constructor(private auth:AuthService,
              private router: Router,
              private route: ActivatedRoute) {

    this.form = new FormGroup({
      'email': new FormControl(''),
      'password': new FormControl('')
    })
    this.aSub = new Subscription()
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.route.queryParams.subscribe((params:Params)=>{
      if(params['registered']){
        MaterialService.toast('Теперь вы можете войти в систему используя свои данные')

      }
      else if (params['accessDenied']){
        MaterialService.toast('Для начала авторизуйтесь в системе')

      }
      else if (params['sessionFailed']){
        MaterialService.toast('Cначала авторизуйтесь в системе')
      }
    })
  }

  onSubmit(){
    const user = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.form.disable()
    this.aSub = this.auth.login(user).subscribe(
      ()=>this.router.navigate(['/overview']),
      error=> {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

  ngOnDestroy() { //когда будем переходить на другую страницу
    if(this.aSub){
      this.aSub.unsubscribe() //отлючаемся от текущего стрима, переходим на другую страницу
    }
  }
}

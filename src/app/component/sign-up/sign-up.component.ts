import {Component, OnInit, ViewChild} from '@angular/core';
import { User } from 'src/app/entity/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import {NgForm} from "@angular/forms";
import {FOCUSABLE_ELEMENTS_SELECTOR} from "@ng-bootstrap/ng-bootstrap/util/focus-trap";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit{
  @ViewChild('formSignUp') formSignUp: NgForm;
  user: User = new User();
  confirmPassword: string;
  submitted:boolean=false;
  invalidUser:boolean=false;
  showMessage:boolean=false;
  lowerCaseLetter:boolean=false;
  upperCaseLetter:boolean=false;
  number:boolean=false;
  length:boolean=false;
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user.gender="MALE"
  }

  saveUser(): void {
    this.submitted=true;
    if (this.formSignUp.invalid){
      this.invalidUser=true;
      return;
    }
    const validationMsg = this.user.validate();
    if (validationMsg !== '') {
      alert(validationMsg);
      return;
    }
    this.userService.addUser(this.user).subscribe({
      next: () => {
        this.router.navigate(['Sign-in']);
      },
      error: (err: any) => {
        alert(err.message);
        console.log('User saving failed');
        this.invalidUser=true;
      }
    })
  }
  hidePasswordSuggestion():void{
    this.showMessage=false;
  }
  showPasswordSuggestion():void{
    this.showMessage=true;
  }

  ValidatePassword():void{
    if(this.user.password.match(/[a-z]/g))
      this.lowerCaseLetter=true;
    else
      this.lowerCaseLetter=false;

    if(this.user.password.match(/[A-Z]/g))
      this.upperCaseLetter=true;
    else
      this.upperCaseLetter=false;

    if(this.user.password.match(/[0-9]/g))
      this.number=true;
    else
      this.number=false;

    if(this.user.password.length >=8)
      this.length=true;
    else
      this.length=false;
  }


}


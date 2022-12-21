import {Component, OnInit, HostListener} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {LoginRequest} from 'src/app/entity/login-request';
import {UserService} from 'src/app/services/user.service';
import {AppData} from "../../settings/app-data";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  loginRequest: LoginRequest = new LoginRequest();
  productId: number | undefined;
  submitted: boolean = false;
  invalidLoginRequest: boolean = false;
  forgetPasswordDialogue: boolean = false;
  forgetPasswordDialogueEmail = '';
  resetPasswordRequestIsSent: boolean = false;

  constructor(
      private userService: UserService,
      private router: Router,
      private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      this.productId = params.params.idProduct;
    })
  }

  loginUser(): void {
    this.submitted = true;
    this.userService.login(this.loginRequest).subscribe({
      next: (res) => {
        this.userService.setLoginDetails(res.token)
        this.userService.saveUserInLocalStorage(res.token)
        this.invalidLoginRequest = false;
        if (this.productId === undefined) {
          this.router.navigate([''], {queryParams: {user: AppData.username}})
        } else {
          this.router.navigate(['/details/' + this.productId], {queryParams: {user: AppData.username}})
        }
      },
      error: (err: any) => {
        localStorage.removeItem('token');
        console.log("user Not authorized")
        this.invalidLoginRequest = true;

      }
    })
  }

  createAccountButton() {
    if (this.productId !== undefined) {
      this.router.navigate(['/Sign-up/'], {queryParams: {idProduct: this.productId}})
    } else {
      this.router.navigate(['/Sign-up/']);
    }
  }

  reset(): void {
    this.submitted = false;
    this.invalidLoginRequest = false;
  }

  showForgetPasswordDialogue(): void {
    this.forgetPasswordDialogueEmail = ''
    this.forgetPasswordDialogue = true;
  }

  sendForgetPassword():void{
    this.userService.forgetPassword(this.forgetPasswordDialogueEmail);
    this.resetPasswordRequestIsSent=true;
  }
  closeResetPasswordDialog():void{
    this.resetPasswordRequestIsSent=false;
    this.forgetPasswordDialogueEmail='';
    this.forgetPasswordDialogue=false;
}
}

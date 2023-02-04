import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from 'src/app/dto/reset-password';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmPasswordValidator } from 'src/app/validators/confirm-password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  failureModalVisibility: boolean = false;
  passwordResetForm!: FormGroup;
  modalContent: string = '';
  modalHeader: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => this.token = params['token']);
  }
  
  ngOnInit(): void {
    this.passwordResetForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      });
  }
  updatePassword(): void {
    let updateRequest: ResetPassword = {
      token: this.token,
      password: this.passwordResetForm.value.password,
      confirmPassword : this.passwordResetForm.value.confirmPassword,
    };
    this.userService.resetPassword(updateRequest)
    .subscribe({
      next : (data) => this.router.navigate(['login']),
      error: (error) => this.displayFailureModal("Oops!", error.error.message)
    })
  }
  displayFailureModal(header: string, content: string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.failureModalVisibility = true;
  }
  reload() {
    window.location.reload();
  }
  compareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value)
        return { match_error: 'Passwords do not match' };
      return null;
    };
  }
}

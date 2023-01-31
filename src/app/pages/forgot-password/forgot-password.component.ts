import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ForgotPassword } from 'src/app/dto/forgot-password';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  modalVisibility: boolean = false;
  forgotPasswordForm!: FormGroup;
  modalContent: string = '';
  modalHeader: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }
  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['']
    });
  }
  sendPasswordResetRequest(): void {
    let request: ForgotPassword = {
      email: this.forgotPasswordForm.value.email
    };
    this.userService.forgotPassword(request)
    .subscribe({
      next : (data) => this.displayModal("Success!", data.message),
      error: (error) => this.displayModal("Oops!", error.error.message)
    })
  }
  displayModal(header: string, content: string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.modalVisibility = true;
  }
  reload() {
    window.location.reload();
  }
}

import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { ContextData } from 'src/app/dto/context-data';
import { UpdatePassword } from 'src/app/dto/update-password';
import { UpdateUser } from 'src/app/dto/update-user';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmPasswordValidator } from 'src/app/validators/confirm-password.validator';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input() user!: ContextData;
  successModalVisibility: boolean = false;
  failureModalVisibility: boolean = false;
  modalHeader: string = '';
  modalContent: string = '';
  uploadedFile!: File;
  userUpdateForm!: FormGroup;
  passwordUpdateForm!: FormGroup;
  url: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) { }


  ngOnInit(): void {
    this.userUpdateForm = this.fb.group({
      displayName: [this.user.displayName],
      username: [this.user.username],
      phoneNumber: [this.user.phoneNumber],
      city: [this.user.city]
    });
    this.passwordUpdateForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      });
  }
  updateUser(): void {
    let updateRequest: UpdateUser = {
      displayName: this.userUpdateForm.value.displayName,
      username: this.userUpdateForm.value.username,
      phoneNumber: this.userUpdateForm.value.phoneNumber,
      city: this.userUpdateForm.value.city
    };
    this.userService.updateUser(updateRequest)
    .subscribe({
      next : (data) => this.displaySuccessModal("Success!", "You have successfully changed your information."),
      error: (error) => this.displayFailureModal("Oops!", error.error.message)
    })
  }
  updatePassword(): void {
    let updateRequest: UpdatePassword = {
      password: this.passwordUpdateForm.value.password,
      confirmPassword : this.passwordUpdateForm.value.confirmPassword,
    };
    this.userService.updatePassword(updateRequest)
    .subscribe({
      next : (data) => this.displaySuccessModal("Success!", "You have successfully changed your password."),
      error: (error) => this.displayFailureModal("Oops!", error.error.message)
    })
  }
  displaySuccessModal(header: string, content: string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.successModalVisibility = true;
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

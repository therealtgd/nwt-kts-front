import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { ApiResponse } from 'src/app/dto/api-response';
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
  url: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) { }


  ngOnInit(): void {
    this.userUpdateForm = this.fb.group({
      displayName: [this.user.displayName],
      username: [this.user.username]
    });
  }
  updateUser(): void {
    let updateRequest: UpdateUser = {
      displayName: this.userUpdateForm.value.displayName,
      username: this.userUpdateForm.value.username
    };
    console.log(updateRequest);
    
    this.userService.updateUser(updateRequest)
    .subscribe({
      next : (data) => this.displaySuccessModal("Success!", "You have successfully changed your information."),
      error: (error) => this.displayFailureModal("Oops!", error)
    })
  }
  displaySuccessModal(header: string, content: Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.successModalVisibility = true;
  }
  displayFailureModal(header: string, content: Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.failureModalVisibility = true;
  }
  reload() {
    window.location.reload();
  }
}

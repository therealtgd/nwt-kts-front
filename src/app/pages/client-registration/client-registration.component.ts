import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload/fileupload';
import { RegistrationRequest } from 'src/app/dto/registration-request';
import { ApiResponse } from 'src/app/models/api-response';
import { ImageService } from 'src/app/services/image/image.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmPasswordValidator } from '../../validators/confirm-password.validator';

@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.css']
})
export class ClientRegistrationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private imageService: ImageService
  ) { }

  @ViewChild('fileUpload')
  fileUpload!: FileUpload;

  successModalVisibility: boolean = false;
  failureModalVisibility: boolean = false;
  modalHeader: string = '';
  modalContent: string = '';
  uploadedFile!: File;
  form!: FormGroup;
  url: any;

  ngOnInit(): void {
    this.form = this.fb.group({
      displayName: [''],
      email: [''],
      username: [''],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      });
  }

  uploadFile(event: any) {
    for (let file of event.files) {
      this.uploadedFile = file
    }
    this.fileUpload.clear();
    this.showImage();
  }
  showImage() {
    if (this.uploadedFile === undefined) { return; }
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.url = event.target.result;
    };
    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };
    reader.readAsDataURL(this.uploadedFile);
  }
  getImageData(email: string): FormData {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', this.uploadedFile);
    return formData;
  }
  save() {
    console.log(this.uploadedFile);
    let registrationData: RegistrationRequest = {
      displayName: this.form.value.displayName,
      email: this.form.value.email,
      username: this.form.value.username,
      password: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
      socialProvider: 'LOCAL'
    };
    this.userService.registerClient(registrationData)
      .subscribe({
        next: (data) => this.handleRegistrationSuccess(data),
        error: (error) => this.handleRegistrationError(error.error)
      });
  }
  handleRegistrationSuccess(response: ApiResponse<null>) {
    const image: FormData = this.getImageData(response.message);
    if(!this.uploadedFile) {
      this.handleImageSuccess();
      return;
    }
    this.imageService.upload(this.getImageData(response.message))
      .subscribe({
        next: (data) => this.handleImageSuccess(),
        error: (error) => this.handleRegistrationError(error.error)
      });
  }
  handleImageSuccess() {
    this.displaySuccessModal("Success!", "You have successfully registered.");
  }
  handleRegistrationError(error: ApiResponse<null>) {
    this.displayErrorModal("Oops!", error.message);
  }
  displaySuccessModal(header: string, content: string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.successModalVisibility = true;
  }
  displayErrorModal(header: string, content: string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.failureModalVisibility = true;
  }
  redirect(pageName: string = '') {
    this.router.navigate([`${pageName}`]);
  }

  invalidateFields(errorObject: Object) {
    const invalidFields: string[] = Object.keys(errorObject);
    invalidFields.forEach(fieldName => {
      this.form.controls[fieldName].setErrors({ 'invalid': true });
    });
  }

  compareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value)
        return { match_error: 'Passwords do not match' };
      return null;
    };
  }
}

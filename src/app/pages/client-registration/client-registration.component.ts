import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload/fileupload';
import { ApiResponse } from 'src/app/dto/api-response';
import { RegistrationRequest } from 'src/app/dto/registration-request';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ImageService } from 'src/app/services/image/image.service';
import { ConfirmPasswordValidator } from '../../validators/confirm-password.validator'; 
​
@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.css']
})
export class ClientRegistrationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private imageService: ImageService
    ) {}
  
  @ViewChild('fileUpload')
  fileUpload!: FileUpload;

  modalVisibility: boolean = false;
  modalHeader: string = '';
  modalContent: string = '';
  uploadedFile!: File;
  form!: FormGroup;
  url : any;

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: [''],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['']
    },
    {
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    });
  }
  
  uploadFile(event : any) {
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
  save(){
    let registrationData: RegistrationRequest = {
      displayName: this.form.value.firstName + ' ' + this.form.value.lastName,
      email: this.form.value.email,
      username: this.form.value.username,
      password: this.form.value.password,
      confirmPassword : this.form.value.confirmPassword,
      phoneNumber: this.form.value.phoneNumber,
      socialProvider: 'LOCAL'
    };
    console.log(registrationData);
    
    this.authService.registerClient(registrationData)
    .subscribe(
      data => { 
        console.log();
        const response: ApiResponse = data as ApiResponse;
        this.imageService.upload(this.getImageData(response.message))
        .subscribe(
          data => { this.displayModal("Success!", "You have successfully registered."); this.router.navigate(['/login']); },
          error => { this.displayModal("Oops!", error); console.log(error); }
        )
      },
      error => {this.displayModal("Oops!", error.error.message); console.log(error);}
      );
  }
  getImageData(email: string): FormData {
    const formData = new FormData();
    formData.append('email', email);
    formData.append(
      'image', 
      this.uploadedFile
    );
    console.log(formData);
    return formData;
  }
  displayModal(header : string, content : Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.modalVisibility = true;
  }

  invalidateFields(errorObject: Object) {
    const invalidFields: string[] = Object.keys(errorObject);
    invalidFields.forEach(fieldName => {
      this.form.controls[fieldName].setErrors({'invalid': true});
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

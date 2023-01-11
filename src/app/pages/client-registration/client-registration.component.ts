import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload/fileupload';
import { RegistrationRequest } from 'src/app/dto/RegistrationRequest';
import { ClientService } from 'src/app/services/ClientService';
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
    private clientService: ClientService
    ) {}
  
  @ViewChild('fileUpload')
  fileUpload!: FileUpload;

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
      phoneNumber: [''],
      myFile: new FormControl(),
    },
    {
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    });
  }
  uploadFile(event : any) {
    for (let file of event.files) {
      this.form.patchValue({ myFile: file });
      this.form.get('myFile')?.updateValueAndValidity();
    }
  }
  showImage() {
    if (this.form.value.myFile === null) { return; }
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.url = event.target.result;
    };
    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };
    reader.readAsDataURL(this.form.value.myFile);
  }
  save(){
    this.fileUpload.upload();
    this.showImage();
    let registrationData: RegistrationRequest = {
      "firstName": this.form.value.firstName,
      "lastName": this.form.value.lastName,
      "email": this.form.value.email,
      "username": this.form.value.username,
      "password": this.form.value.password,
      "confirmPassword" : this.form.value.confirmPassword,
      "phoneNumber": this.form.value.phoneNumber,
      "image": ""
    };
    this.clientService.registerClient(registrationData).subscribe(response => {
      console.log(response);
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

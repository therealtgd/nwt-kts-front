import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileUpload } from 'primeng/fileupload/fileupload';
import { ContextData } from 'src/app/dto/context-data';
import { ApiResponse } from 'src/app/models/api-response';
import { ImageService } from 'src/app/services/image/image.service';
import { getSession } from 'src/app/util/context';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileUploader!: FileUpload;
  failureModalVisibility: boolean = false;
  selectedItem: string = 'Statistics';
  modalContent: string = '';
  modalHeader: string = '';
  image!: SafeResourceUrl;
  uploadedFile!: File;
  user!: ContextData;

  constructor(
    private _sanitizer: DomSanitizer,
    private imageService: ImageService
    ) { }

  ngOnInit(): void {
    this.user = getSession() || { image: '', displayName: '', username: '', email: '', role: '', phoneNumber: '', city: '' };
    this.image = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.user.image);
  }
  getImageData(): FormData {
    const formData = new FormData();
    formData.append('email', this.user.email);
    formData.append('image', this.uploadedFile);
    return formData;
  }
  uploadFile(event: any) {
    this.uploadedFile = event.target.files[0];
    this.imageService.upload(this.getImageData())
      .subscribe({
        next: (data) => window.location.reload(),
        error: (error) => this.handleRegistrationFailure(error.error)
      });
  }
  handleRegistrationFailure(error: ApiResponse<null>) {
    this.displayFailureModal("Oops!", error.message);
  }
  displayFailureModal(header: string, content: string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.failureModalVisibility = true;
  }
}

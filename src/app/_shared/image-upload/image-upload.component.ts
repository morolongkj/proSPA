import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
  LoadedImage,
} from 'ngx-image-cropper';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [ImageCropperComponent],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css',
})
export class ImageUploadComponent {
  @Input() width: number = 200;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  transform: ImageTransform = {
  };

  @Output() uploadImage = new EventEmitter<any>();
  imageBlob: any = {};

  constructor(private sanitizer: DomSanitizer) {}

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: any) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    // event.blob can be used to upload the cropped image
    console.log(event.blob);
    this.imageBlob = event.blob;
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  upload() {
    this.uploadImage.emit(this.imageBlob);
  }
}

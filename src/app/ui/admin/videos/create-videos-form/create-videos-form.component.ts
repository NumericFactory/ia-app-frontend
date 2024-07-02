import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { EditorModule } from 'primeng/editor';
import { DialogRef } from '@angular/cdk/dialog';
import { VideoGateway } from '../../../../core/ports/video.gateway';

@Component({
  selector: 'app-create-videos-form',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule],
  templateUrl: './create-videos-form.component.html',
  styleUrl: './create-videos-form.component.scss'
})
export class CreateVideoFormComponent {

  newVideoForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private videoService: VideoGateway,
    public dialogRef: DialogRef<any>,
  ) { }

  ngOnInit() {
    this.newVideoForm = this.fb.group({
      videoid: ['', Validators.required],
      videotype: 'vimeo',
      title: ['', Validators.required],
      desc: ''
    });
  }

  createVideo() {
    this.isSubmitted = true;
    this.newVideoForm.markAllAsTouched();
    if (this.newVideoForm.valid) {
      this.videoService.createVideo(this.newVideoForm.value).subscribe();
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }

}

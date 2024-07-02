import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { CategoryModel } from '../../../../core/models/category.model';
import { VideoGateway } from '../../../../core/ports/video.gateway';
import { VideoModel } from '../../../../core/models/video.model';

@Component({
  selector: 'app-update-videos-form',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule],
  templateUrl: './update-videos-form.component.html',
  styleUrl: './update-videos-form.component.scss'
})
export class UpdateVideoFormComponent {

  updateVideoForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private videoService: VideoGateway,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: VideoModel,
  ) { }

  ngOnInit() {

    this.updateVideoForm = this.fb.group({
      id: [this.data.id, Validators.required],
      title: [this.data.title, Validators.required],
      videoid: [this.data.videoid, Validators.required],
      desc: this.data.desc ? this.data.desc : '',
      videotype: this.data.videotype ? this.data.videotype : '',
    });
  }

  updateVideo() {
    this.isSubmitted = true;
    this.updateVideoForm.markAllAsTouched();
    if (this.updateVideoForm.invalid || this.data.id === undefined) return;
    this.videoService.updateVideo(this.data.id, this.updateVideoForm.value).subscribe();
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}

import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { VideoModel } from '../../../../core/models/video.model';
import { CreateVideoFormComponent } from '../create-videos-form/create-videos-form.component';
import { AsyncPipe } from '@angular/common';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { UpdateVideoFormComponent } from '../update-videos-form/update-videos-form.component';
import { VideoGateway } from '../../../../core/ports/video.gateway';

@Component({
  selector: 'app-videos-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './videos-list.component.html',
  styleUrl: './videos-list.component.scss'
})
export class VideoListComponent {

  videos$ = this.videoService.videos$;

  constructor(
    public dialogRef: DialogRef<any>,
    public dialog: Dialog,
    private videoService: VideoGateway,
    private confirmationService: ConfirmDialogService,
    @Inject(DIALOG_DATA) public data: VideoModel[],
  ) { }

  ngOnInit() {
    this.videoService.fetchVideos().subscribe();
  }

  close() {
    this.dialogRef.close();
  }

  openDialogCreateVideo() {
    // open dialog
    this.dialog.open(CreateVideoFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '900px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var'
    });
  }

  openDialogUpdateVideo(event: Event, video: VideoModel) {
    event.stopPropagation();
    // open dialog
    this.dialog.open(UpdateVideoFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '900px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: video
    });
  }

  async deleteVideo(event: Event, video: VideoModel) {
    event.stopPropagation();
    if (video.id === undefined) {
      return;
    }
    const deleteVideoConfirmation = await this.confirmationService
      .confirm('Supprimer', 'Confirmer pour supprimer cette video')
    if (!deleteVideoConfirmation) {
      return;
    }
    this.videoService.deleteVideo(video.id).subscribe();
  }

}

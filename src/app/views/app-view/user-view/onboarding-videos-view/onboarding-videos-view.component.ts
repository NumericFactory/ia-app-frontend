import { Component, Input } from '@angular/core';
import { VideoGateway } from '../../../../core/ports/video.gateway';
import { AuthGateway } from '../../../../core/ports/auth.gateway';
import { AsyncPipe } from '@angular/common';
import { VideoModel } from '../../../../core/models/video.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-onboarding-videos-view',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './onboarding-videos-view.component.html',
  styleUrl: './onboarding-videos-view.component.scss'
})
export class OnboardingVideosViewComponent {

  user$ = this.authService.user$;

  @Input() videos$ = this.videoService.videos$;
  videoId!: string;
  subscription: Subscription = new Subscription();

  constructor(
    private videoService: VideoGateway,
    private authService: AuthGateway,
    private router: Router,
    private sanitize: DomSanitizer
  ) { }

  ngOnInit() {
    this.videoService.fetchVideos().subscribe();
    this.subscription = this.videos$.subscribe(videos => {
      this.videoId = videos[0].videoid;
    });
  }

  getVideoImage(video: VideoModel) {
    return 'https://www.tiz.fr/app/uploads/2017/11/video-entreprise-tiz.jpeg';
  }

  getVideoUrl(): SafeResourceUrl {
    return this.sanitize.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + this.videoId + "?h=8269758839&amp;title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479");
  }

  close() {
    this.router.navigate(['/dashboard']);
  }

  selectVideo(video: VideoModel) {
    console.log(video);
    this.videoId = video.videoid;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

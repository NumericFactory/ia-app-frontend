import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { VideoModel } from "../models/video.model";
import { VideoGateway } from "../ports/video.gateway";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class VideoService implements VideoGateway {

    private apiUrl: string = environment.apiUrl;
    private videosSubject = new BehaviorSubject<VideoModel[]>([]);
    videos$ = this.videosSubject.asObservable();

    constructor(private http: HttpClient) { }

    fetchVideos(): Observable<VideoModel[]> {
        const endpoint = '/admin/videos';
        return this.http.get<VideoModel[]>(`${this.apiUrl}${endpoint}`).pipe(
            tap((apiResponse: any) => {
                this.videosSubject.next(apiResponse.data as VideoModel[])
            })
        );
    }

    createVideo(video: VideoModel): Observable<VideoModel> {
        const endpoint = `/admin/videos`;
        return this.http.post<VideoModel>(`${this.apiUrl}${endpoint}`, video).pipe(
            tap((apiResponse: any) => {
                this.videosSubject.next([...this.videosSubject.getValue(), apiResponse.data as VideoModel])
            })
        );
    }

    updateVideo(id: number, video: VideoModel): Observable<VideoModel> {
        const endpoint = `/admin/videos/${id}`;
        return this.http.put<VideoModel>(`${this.apiUrl}${endpoint}`, video).pipe(
            tap((apiResponse: any) => {
                const updatedVideos = this.videosSubject.getValue().map((video: VideoModel) => {
                    if (video.id === id) {
                        return apiResponse.data as VideoModel;
                    }
                    return video;
                });
                this.videosSubject.next(updatedVideos);
            })
        );
    }

    deleteVideo(id: number): Observable<VideoModel> {
        const endpoint = `/admin/videos/${id}`;
        return this.http.delete<VideoModel>(`${this.apiUrl}${endpoint}`).pipe(
            tap((apiResponse: any) => {
                const updatedVideos = this.videosSubject.getValue().filter((video: VideoModel) => video.id !== id);
                this.videosSubject.next(updatedVideos);
            })
        );
    }
}
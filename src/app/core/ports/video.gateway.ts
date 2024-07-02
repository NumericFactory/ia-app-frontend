import { Observable } from "rxjs";
import { PlanModel } from "../models/plan.model";
import { VideoModel } from "../models/video.model";

// PlanGateway interface contract
export abstract class VideoGateway {

    abstract videos$: Observable<VideoModel[]>;

    abstract fetchVideos(): Observable<VideoModel[]>

    abstract createVideo(video: VideoModel): Observable<VideoModel>

    abstract updateVideo(id: number, video: VideoModel): Observable<VideoModel>

    abstract deleteVideo(id: number): Observable<VideoModel>

}
export interface VideoModel {
    id: number
    videoid: string
    videotype: 'vimeo' | 'youtube'
    title: string
    desc: string
}
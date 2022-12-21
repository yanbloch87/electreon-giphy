export type View = 'table' | 'scroll'

export type Rating = 'g' | 'pg' | 'pg-13' | 'r'

export interface GifVM {
    rating: Rating;
    userName: string;
    imgUrl: string;
    tinyImgUrl: string;
}

interface Gif {
    images: {
        downsized: {
            url: string
        }
        downsized_small: {
            mp4: string
        }
    }
    rating: Rating
    username: string;
}

export interface GiphyResponse {
    data: Gif[];
    pagination: {
        count: number;
        offset: number;
        total_count: number;
    }
}

export interface GiphyResult {
    data: GifVM[];
    totalCount: number;
}

export interface Option {
    value: string;
    label: string;
}

export interface RatingOption extends Option {
    value: Rating;
}

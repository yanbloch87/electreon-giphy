export type View = 'table' | 'scroll'

export type Rating = 'g' | 'pg' | 'pg-13' | 'r'

export interface GiTableRow {
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
    data: GiTableRow[];
    pagination: {
        count: number;
        offset: number;
        totalCount: number;
    }
}

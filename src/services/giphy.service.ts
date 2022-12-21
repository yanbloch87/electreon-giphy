import {GiphyResponse, GiphyResult, Rating} from "../lib/types";
import {map} from "lodash";

export const getGifsData = async (search: string, limit: number, offset: number, rating: Rating | null = 'r'): Promise<GiphyResult> => {
    try {
        const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=gWgWqsXoiN8s2js7cc1hkAHrnehQ2GN5&q=${search}&limit=${limit}&offset=${offset}&rating=${rating}&lang=en`, {
            method: 'GET',
        });
        const resJson: GiphyResponse = await res.json();
        if (res.status === 200) {
            return {
                data: map(resJson.data, data => ({
                    rating: data.rating,
                    userName: data.username,
                    imgUrl: data.images.downsized.url,
                    tinyImgUrl: data.images.downsized_small.mp4,
                })),
                pagination: {
                    count: resJson.pagination.count,
                    offset: resJson.pagination.offset,
                    totalCount: resJson.pagination.total_count,
                }
            };
        } else {
            return {
                data: [],
                pagination: {
                    count: 0,
                    offset: 0,
                    totalCount: 0,
                }
            };
        }
    } catch (err) {
        console.log(err);
        return {
            data: [],
            pagination: {
                count: 0,
                offset: 0,
                totalCount: 0,
            }
        };
    }
};

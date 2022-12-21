import {GiphyResponse, GiphyResult, Rating} from "../shared/types";
import {map} from "lodash";

const cache: Record<string, GiphyResult> = {};

export const getGifsData = async (search: string, limit: number, offset: number, rating: Rating, language: string): Promise<GiphyResult> => {
    const key = `${search}_${limit}_${offset}_${rating}_${language}`;
    if (cache[key]) {
        return cache[key];
    }

    try {
        const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=gWgWqsXoiN8s2js7cc1hkAHrnehQ2GN5&q=${search}&limit=${limit}&offset=${offset}&rating=${rating}&lang=${language}`, {
            method: 'GET',
        });
        const resJson: GiphyResponse = await res.json();
        if (res.status === 200) {
            const result = {
                data: map(resJson.data, data => ({
                    rating: data.rating,
                    userName: data.username,
                    imgUrl: data.images.downsized.url,
                    tinyImgUrl: data.images.downsized_small.mp4,
                })),
                totalCount: resJson.pagination.total_count,
            };
            cache[key] = result;
            return result;
        } else {
            return {
                data: [],
                totalCount: 0,
            };
        }
    } catch (err) {
        console.log(err);
        return {
            data: [],
            totalCount: 0,
        };
    }
};

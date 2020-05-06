import axios, {AxiosError} from "axios";
import {Live, LiveStatus} from "./models";

export const getLive = async (liveSlug: string):Promise<Live> => {
    const {data} = await axios.get(`${process.env.REACT_APP_MICRO_GENERATOR_URL}/lives/${liveSlug}`);
    if (data.status === LiveStatus.DONE) {
        const e = new Error('Live já foi realizada');
        e.name = 'LiveNotPending';
        throw e;
    }
    return data;
};

export function handleLiveError(e: AxiosError | Error) {
    let newError;
    if ('request' in e) {
        const errorType: AxiosError = e;
        newError = {message: 'Ocorreu um erro', name: 'HttpError'};
        if (errorType.response?.status === 404) {
            newError = {message: 'Live não encontrada', name: 'LiveNotFound'};
        }
    } else {
        newError = {message: e.message, name: e.name};
    }
    return newError;
}

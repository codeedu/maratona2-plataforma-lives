import {MutableRefObject, useCallback, useEffect, useMemo, useRef, useState} from "react";
import Peer from "peerjs";
import {Live} from "../utils/models";
import {useSnackbar} from "notistack";
import io from "socket.io-client";
import {getLive, handleLiveError} from "../utils/get-live";
import getIceServers from "../utils/get-ice-servers";

interface UseViewerOptions {
    start: boolean;
    liveSlug: string;
    videoRef: MutableRefObject<any>;
}

const useViewer = (options: UseViewerOptions) => {
    const {start, liveSlug, videoRef} = options;
    const socket = useMemo(() => {
        if (!start) {
            return null;
        }
        return io(`${process.env.REACT_APP_MICRO_GENERATOR_URL}/live`)
    }, [start]);
    const peerRef = useRef() as MutableRefObject<Peer>;
    const [live, setLive] = useState<Live>();
    const [error, setError] = useState<{ message: string, name: string } | null>(null);
    const {enqueueSnackbar} = useSnackbar();
    const [usersConnected, setUsersConnected] = useState(0);

    const connectBroadcaster = useCallback((data: any) => {
        console.log(data);
        if (!data.peer_id) {
            return;
        }
        console.log('new-broadcaster', data.peer_id);

        const iceServers = getIceServers();
        // @ts-ignore
        peerRef.current = new Peer({
            ...(iceServers !== null && {
                config: {
                    iceServers: [...iceServers]
                }
            }),
            host: process.env.REACT_APP_MICRO_GENERATOR_PEER_DOMAIN,
            // @ts-ignore
            port: parseInt(process.env.REACT_APP_MICRO_GENERATOR_PEER_PORT)
        });

        const _peer = peerRef.current;
        _peer.on('open', (peer_id) => {
            console.log('viewer_id', peer_id);
            var conn = _peer.connect(data.peer_id);
            if (conn) {
                conn.on('error', console.error);
                conn.on('open', function () {
                    console.log('connection opened with broadcaster: ' + _peer.id);
                });
            }
        });

        _peer.on('call', function (call: any) {
            call.answer();
            call.on('stream', function (stream: any) {
                console.log('new stream received', stream);
                if (!videoRef.current.srcObject || videoRef.current.srcObject.id !== stream.id) {
                    videoRef.current.srcObject = stream;
                }
            });
        });
    }, [peerRef, videoRef]);

    useEffect(() => {
        if (error) {
            return;
        }

        async function load() {
            try {
                setLive(await getLive(liveSlug));
            } catch (e) {
                console.error(e);
                setError(handleLiveError(e));
            }
        }

        load();
    }, [liveSlug, error]);

    useEffect(() => {
        if (!start || !socket) {
            return;
        }

        socket.on('connect', () => {
            socket.on('get-broadcaster', connectBroadcaster);

            socket.on('count-users', (count: number) => setUsersConnected(count));

            socket.on('finish-live', (live: Live) => {
                setLive(live);
                enqueueSnackbar('A live terminou!', {variant: 'success'});
                peerRef.current.disconnect();
                socket.disconnect();
            });
            socket.emit('join', {slug: liveSlug});
        });
        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        }
    }, [start, socket, peerRef, liveSlug, connectBroadcaster, enqueueSnackbar]);

    useEffect(() => {
        if (error || !socket) {
            return;
        }

        socket.on('error', (e: { message: string, name: string }) => {
            console.error(e);
            !error && setError(e);
            if (peerRef.current) {
                peerRef.current.disconnect();
            }

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        });
    }, [error, socket, peerRef, videoRef]);

    const unload = useCallback(() => {
        if (socket && socket.connected) {
            socket.emit('leave');
        }
    }, [socket]);

    useEffect(() => {
        window.addEventListener('beforeunload', unload);
        return () => {
            unload();
            window.removeEventListener('beforeunload', unload);
        }
    }, [unload, socket]);

    return {live, error, usersConnected}
};

export default useViewer;

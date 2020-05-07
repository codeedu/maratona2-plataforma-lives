import {MutableRefObject, useCallback, useEffect, useMemo, useRef, useState} from "react";
import Peer from "peerjs";
import {Live} from "../utils/models";
import io from "socket.io-client";
import {getLive, handleLiveError} from "../utils/get-live";
import getIceServers from "../utils/get-ice-servers";

interface UseBroadcasterOptions {
    start: boolean;
    stop: boolean;
    liveSlug: string;
    password: string;
    videoRef: MutableRefObject<any>;
}

const useBroadcaster = (options: UseBroadcasterOptions) => {
    const {
        start,
        stop,
        liveSlug,
        password,
        videoRef
    } = options;
    const socket = useMemo(() => {
        if (!start) {
            return null;
        }
        return io(`${process.env.REACT_APP_MICRO_GENERATOR_URL}/live`)
    }, [start]);
    const [error, setError] = useState<{ message: string, name: string } | null>(null);
    const peerRef = useRef() as MutableRefObject<Peer>;
    const [viewers, setViewers] = useState<Peer.MediaConnection[]>([]);
    const [stream, setStream] = useState<MediaStream>();
    const streamRef = useRef(stream);
    const [live, setLive] = useState<Live>();
    const [usersConnected, setUsersConnected] = useState(0);

    useEffect(() => {
        if (error) {
            return;
        }

        async function load() {
            try {
                setLive(await getLive(liveSlug));
            } catch (e) {
                console.error(e);
                stopStream();
                setError(handleLiveError(e));
            }
        }

        load();
    }, [liveSlug, error]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on('connect', () => {
            socket.on('count-users', (count: number) => setUsersConnected(count));
            socket.emit('join', {slug: liveSlug});
        });
    }, [liveSlug, socket]);

    useEffect(() => {
        if (!stream || !start || !socket || peerRef.current) {
            return;
        }

        console.log('initialize peer connection');

        const iceServers = getIceServers(); //stun server e turn server
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
        peerRef.current.on('open', (peer_id) => {
            console.log('broadcaster_id', peer_id);
            socket.emit('set-broadcaster', {peer_id, password})
        });
        peerRef.current.on('connection', (conn: Peer.DataConnection) => {
            const call = peerRef.current.call(conn.peer, streamRef.current as MediaStream);
            if (call) {
                console.log('new call', call);
                setViewers((prevState) => [...prevState, call]);
            }
        });
    }, [start, password, stream, socket, peerRef]);

    useEffect(() => {

        if (!peerRef.current || !stream || !viewers.length) {
            return;
        }

        const viewersConnected: Peer.MediaConnection[] = [];
        let hasNewCall = false;
        for (const viewer of viewers) {
            const localStream = (viewer as any).localStream;
            if (localStream && localStream.id === stream.id) {
                viewersConnected.push(viewer);
                break;
            }
            const call = peerRef.current.call(viewer.peer, stream);
            if (call) {
                hasNewCall = true;
                viewersConnected.push(call);
            }
        }
        if (hasNewCall) {
            setViewers(viewersConnected);
        }

    }, [peerRef, viewers, stream]);

    const loadStream = useCallback(({audioInputId, videoId}: { audioInputId: string, videoId: string }) => {

        navigator
            .mediaDevices
            .getUserMedia({
                audio: {
                    deviceId: {exact: audioInputId}
                },
                video: {
                    deviceId: {exact: videoId}, width: {ideal: 1280}, height: {ideal: 720},
                }
            })
            .then(stream => {
                if (error || !stream) {
                    return;
                }
                stopStream();
                streamRef.current = stream;
                setStream(stream);
                videoRef.current.srcObject = stream;
            })
            .catch(console.error);

    }, [error, videoRef]);

    function stopStream() {
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach((track) => track.stop());
        }
    }

    useEffect(() => {
        if (!peerRef.current || !stop || peerRef.current.disconnected || !socket) {
            return;
        }

        socket.emit('finish-live', {password});

        viewers.forEach(viewer => viewer.close());

        peerRef.current.disconnect();

    }, [peerRef, stop, socket, password, viewers]);

    useEffect(() => {
        if (error || !socket) {
            return;
        }
        socket.on('error', (e: { message: string, name: string }) => {
            console.error(e);
            !error && setError(e);
            stopStream();

            if (peerRef.current) {
                peerRef.current.disconnect();
            }

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        });

        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        }
    }, [socket, peerRef, videoRef, error]);

    return {
        live, error, loadStream, usersConnected,
    }
};

export default useBroadcaster;

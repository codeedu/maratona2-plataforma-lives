import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    TextField
} from '@material-ui/core';
import {useEffect, useState} from "react";

interface DeviceSelectProps {
    value: string,
    label: string;
    devices: MediaDeviceInfo[]
    onChange: (selected: string) => void;
}

const DeviceSelect : React.FC<DeviceSelectProps> = (props) => {
    const {value, label ,devices, onChange} = props;
    return (
        <TextField
            select
            label={label}
            fullWidth={true}
            value={value}
            onChange={(event) => onChange(event.target.value)}
        >
            {
                devices.map((device, key) => (
                    <MenuItem key={key} value={device.deviceId}>
                        {device.label}
                    </MenuItem>
                ))
            }
        </TextField>
    )
};

interface Devices {
    audioInputs: MediaDeviceInfo[];
    videos: MediaDeviceInfo[];
}

interface DevicesDialogProps {
    open: boolean;
    onChange: (devices: {audioInputId: string, videoId: string}) => void;
    onClose: () => void;
}

const DevicesDialog: React.FC<DevicesDialogProps> = (props) => {
    const {open, onChange, onClose} = props;

    const [audioInputId, setAudioInputId] = useState<string>('');
    const [videoId, setVideoId] = useState<string>('');
    const [devices, setDevices] = useState<Devices>({
        audioInputs: [],
        videos: []
    });

    useEffect(() => {
        navigator
            .mediaDevices
            .getUserMedia({ audio: true, video: true, })
            .finally(() => loadDevices())
    }, []);

    async function loadDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter(device => device.kind === 'audioinput');
            const videos = devices.filter(device => device.kind === 'videoinput');
            setDevices({audioInputs: audioInputs, videos});

        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if(devices.audioInputs.length && audioInputId === ''){
            setAudioInputId(devices.audioInputs[0].deviceId);
        }
        if(devices.videos.length && videoId === '') {
            setVideoId(devices.videos[0].deviceId);
        }
    }, [devices, audioInputId, videoId]);

    useEffect(() => {
        if(audioInputId === '' || videoId === ''){
            return;
        }
        onChange({audioInputId, videoId})
    }, [onChange, audioInputId, videoId]);

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth={true}>
            <DialogTitle>Aúdio e vídeo</DialogTitle>
            <DialogContent>
                <form>
                    <Grid container>
                        <Grid item xs={12}>
                            <DeviceSelect
                                value={audioInputId}
                                label={'Microfone'}
                                devices={devices.audioInputs}
                                onChange={(selected) => setAudioInputId(selected)}
                            />
                            <DeviceSelect
                                value={videoId}
                                label={'Câmera'}
                                devices={devices.videos}
                                onChange={(selected) => setVideoId(selected)}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Concluído
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DevicesDialog;

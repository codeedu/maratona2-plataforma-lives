import * as React from 'react';
import {AppBar, Box, IconButton, MuiThemeProvider, Theme, Toolbar, Typography} from '@material-ui/core';
import {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";
import DevicesDialog from "../components/DeviceDialog";
import {makeStyles} from "@material-ui/core/styles";
import useBroadcaster from "../hooks/useBroadcaster";
import ContainerVideoChat from "../components/ContainerVideoChat";
import Video from "../components/Video";
import {useParams} from 'react-router';
import BroadcasterInfoDialog from "../components/BroadcasterInfoDialog";
import LiveInformation from "../components/LiveInformation";
import LiveError from "../components/LiveError";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StopIcon from '@material-ui/icons/Stop';
import {blue, teal} from "@material-ui/core/colors";
import LiveStopDialog from "../components/LiveStopDialog";
import Chat from "../components/Chat";


const localTheme = (theme: Theme): Theme => ({
    ...theme,
    palette: {
        ...theme.palette,
        primary: {
            ...theme.palette.primary,
            main: teal['500'],
            contrastText: theme.palette.common.white
        },
        secondary: {
            ...theme.palette.secondary,
            main: blue['500'],
            contrastText: theme.palette.common.white
        },
    }
});

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%', height: '100%',
    },
    videoContent: {
        display: 'flex',
        flexDirection: 'column'
    },
    appBarTitle: {
        flexGrow: 1
    },
    chat: {
        [theme.breakpoints.down(1000)]: {
            width: '100%',
        },
        [theme.breakpoints.up(1000)]: {
            maxWidth: '400px',
        },
        flexGrow: 1,
    }
}));


const Broadcaster = () => {
    const classes = useStyles();
    const {slug} = useParams<{ slug: string }>();
    const videoRef = useRef(null) as MutableRefObject<any>;
    const [openBroadcasterDialog, setOpenBroadcasterDialog] = useState(false);
    const [openDevicesDialog, setOpenDevicesDialog] = useState(false);
    const [openLiveStopDialog, setOpenLiveStopDialog] = useState(false);
    const [stopLive, setStopLive] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
        is_broadcaster: true
    });
    const [finishRoom, setFinishRoom] = useState(false);

    const {
        live,
        error,
        loadStream,
        usersConnected,
    }
    = useBroadcaster({
        start: userInfo.name !== "",
        stop: stopLive,
        password: userInfo.password,
        liveSlug: slug,
        videoRef
    });

    useEffect(() => {
        setOpenBroadcasterDialog(live!== null && !error);
    }, [live, error]);

    const onDevicesChange = useCallback((devices) => {
        loadStream(devices);
    }, [loadStream]);

    return (
        <MuiThemeProvider theme={localTheme}>
            <div className={classes.root}>
                <DevicesDialog
                    open={openDevicesDialog}
                    onChange={onDevicesChange}
                    onClose={() => {
                        setOpenDevicesDialog(false)
                    }}
                />
                <BroadcasterInfoDialog
                    open={openBroadcasterDialog}
                    onClose={(formData) => {
                        setUserInfo((prevState => ({...prevState, ...formData})));
                        setOpenBroadcasterDialog(false);
                    }}
                />
                <LiveStopDialog
                    open={openLiveStopDialog}
                    onClose={(stop) => {
                        setOpenLiveStopDialog(false);
                        if(stop) {
                            setStopLive(true);
                            setFinishRoom(true);
                        }
                    }}
                />
                <AppBar position="static">
                    <Toolbar>
                        <Typography className={classes.appBarTitle} variant="h6">
                            Codelive Streaming Broadcaster
                        </Typography>
                        <IconButton
                            edge="end"
                            onClick={() => setOpenLiveStopDialog(true)}
                        >
                            <StopIcon/>
                        </IconButton>
                        <IconButton
                            edge="end"
                            onClick={() => setOpenDevicesDialog(true)}
                        >
                            <MoreVertIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <LiveError message={error?.message}/>
                <ContainerVideoChat>
                    <Box className={classes.videoContent}>
                        <Video
                            autoPlay
                            muted
                            controls
                            style={{
                                display: 'inline-block',
                                verticalAlign: 'top',
                                marginLeft: 0,
                            }}
                            ref={videoRef}
                        />
                        {live && <LiveInformation live={live} usersConnected={usersConnected}/>}
                    </Box>
                    <Chat
                        className={classes.chat}
                        user={userInfo}
                        room={slug}
                        finishRoom={finishRoom}
                        disabled={error!==null}
                    />
                </ContainerVideoChat>
            </div>
        </MuiThemeProvider>
    );
};

export default Broadcaster;

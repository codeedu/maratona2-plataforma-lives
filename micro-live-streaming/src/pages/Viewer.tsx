import * as React from 'react';
import {MutableRefObject, useRef, useState} from "react";
import useViewer from "../hooks/useViewer";
import {AppBar, Box, MuiThemeProvider, Theme, Toolbar, Typography} from "@material-ui/core";
import ContainerVideoChat from "../components/ContainerVideoChat";
import Video from "../components/Video";
import {makeStyles} from "@material-ui/core/styles";
import ViewerInfoDialog from "../components/ViewerInfoDialog";
import {useParams} from "react-router";
import LiveInformation from "../components/LiveInformation";
import LiveError from "../components/LiveError";
import {blue, teal} from "@material-ui/core/colors";
import {useEffect} from "react";
import Chat from "../components/Chat";

const localTheme = (theme: Theme): Theme => ({
    ...theme,
    palette: {
        ...theme.palette,
        primary: {
            ...theme.palette.primary,
            main: blue['500'],
            contrastText: theme.palette.common.white
        },
        secondary: {
            ...theme.palette.secondary,
            main: teal['500'],
            contrastText: theme.palette.common.white
        },
    }
});

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%', height: '100%'
    },
    error: {
        textAlign: 'center',
        marginTop: theme.spacing(1)
    },
    appBarTitle: {
        flexGrow: 1
    },
    videoContent: {
        display: 'flex',
        flexDirection: 'column'
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

const Viewer = () => {
    const classes = useStyles();
    const {slug} = useParams<{ slug: string }>();
    const videoRef = useRef() as MutableRefObject<any>;
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        is_broadcaster: false
    });
    const [openUserInfoDialog, setOpenUserInfoDialog] = useState(false);

    const {live, error, usersConnected} = useViewer({
        start: userInfo?.name !== "",
        liveSlug: slug,
        videoRef
    });

    useEffect(() => {
        setOpenUserInfoDialog(live !== null && !error && userInfo.name === "");
    }, [live, error, userInfo]);

    useEffect(() => {
        userInfo?.name !== "" && videoRef.current.play();
    }, [userInfo, videoRef]);

    return (
        <MuiThemeProvider theme={localTheme}>
            <div className={classes.root}>
                <ViewerInfoDialog
                    open={openUserInfoDialog}
                    onClose={(formData) => {
                        setUserInfo((prevState => ({...prevState, ...formData})));
                        setOpenUserInfoDialog(false);
                    }}
                />
                <AppBar position="static">
                    <Toolbar>
                        <Typography className={classes.appBarTitle} variant="h6">Codelive Streaming Viewer</Typography>
                    </Toolbar>
                </AppBar>
                <LiveError message={error?.message}/>
                <ContainerVideoChat>
                    <Box className={classes.videoContent}>
                        <Video
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
                        disabled={error !== null}
                    />
                </ContainerVideoChat>
            </div>
        </MuiThemeProvider>
    );
};

export default Viewer;

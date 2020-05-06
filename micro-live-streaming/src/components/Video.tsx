// @flow
import * as React from 'react';
import {useMediaQuery, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginLeft: 0,
        backgroundColor: 'black',
        [theme.breakpoints.down(1000)]: {
            width: '100%',
            height: 'auto',
        },

        [theme.breakpoints.up(1763)]: {
            width: '1280px',
            height: '720px',
        },
    },
}));


interface VideoProps extends React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement> {

}

function getVideoSize() {
    const width = window.innerWidth * 0.60;
    return {
        width,
        height: width / 1.7777
    }
}

const Video = React.forwardRef<any, VideoProps>((props, ref) => {
    const {className, style} = props
    const classes = useStyles();
    const theme = useTheme();
    const isUp1000 = useMediaQuery(theme.breakpoints.between(1000, 1763));
    const [size, setSize] = useState(getVideoSize());
    const videoSize = {width: `${size.width}px`, height: `${size.height}px`};

    useEffect(() => {
        function resize() {
            setSize(getVideoSize())
        }

        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <video
            autoPlay
            {...props}
            className={clsx(classes.root, className)}
            style={isUp1000 ? {...style,...videoSize, } : {...style}}
            ref={ref}
        />
    );
});

export default Video;

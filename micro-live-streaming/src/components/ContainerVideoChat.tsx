import * as React from 'react';
import {Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CSSProperties} from "react";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        marginTop: theme.spacing(2)
    },
    boxContentInner: {
        display: 'flex',
        width: '97%',
        flexDirection: 'row',
        [theme.breakpoints.down(1000)]: {
            flexDirection: 'column',
            '&>*': {
                marginTop: theme.spacing(2)
            }
        },
        [theme.breakpoints.up(1000)]: {
            '&>*:not(:first-child)': {
                marginLeft: theme.spacing(2)
            }
        }
    },
}));


interface ContainerVideoChatProps {
    style?: CSSProperties;
}

const ContainerVideoChat:React.FC<ContainerVideoChatProps> = (props) => {
    const {style} = props;
    const classes = useStyles();

    return (
        <Box className={classes.root} style={{...style}}>
            <Box className={classes.boxContentInner}>
                {props.children}
            </Box>
        </Box>
    );
};

export default ContainerVideoChat;

// @flow
import * as React from 'react';
import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        textAlign: 'center',
        marginTop: theme.spacing(1)
    }
}));

interface LiveErrorProps {
    message: any;
}
export const LiveError:React.FC<LiveErrorProps> = (props) => {
    const {message} = props;
    const classes = useStyles();
    return (
        <Typography hidden={!message} className={classes.root} variant={"h4"} color={"error"}>
            {message}
        </Typography>
    );
};

export default LiveError;

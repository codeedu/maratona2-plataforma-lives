import * as React from 'react';
import {Avatar, ListItemAvatar} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import md5 from 'md5';

const useStyles = makeStyles(theme => ({
    itemAvatar: {
        minWidth: theme.spacing(5)
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    }
}));

interface ChatAvatarProps {
    email: string;
}
export const ChatAvatar:React.FC<ChatAvatarProps> = (props) => {
    const {email} = props;
    const classes = useStyles();
    return (
        <ListItemAvatar className={classes.itemAvatar}>
            <Avatar className={classes.avatar} src={`https://www.gravatar.com/avatar/${md5(email)}`}/>
        </ListItemAvatar>
    );
};

// @flow
import * as React from 'react';
import {
    Card,
    CardActions,
    CardContent,
    CardHeader, IconButton,
    List,
    ListItem,
    ListItemText, TextField
} from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import {makeStyles} from "@material-ui/core/styles";
import {ChatAvatar} from "./ChatAvatar";
import {grey, yellow} from "@material-ui/core/colors";
import clsx from "clsx";
import {MutableRefObject, useEffect, useMemo, useRef, useState} from "react";
import io from "socket.io-client";
import {ChatMessage} from "../../utils/models";

const useStyles = makeStyles(theme => ({
    root: {
        border: `1px solid ${grey["800"]}`,
        flexGrow: 1
    },
    header: {
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(1)
    },
    headerTitle: {
        color: theme.palette.primary.contrastText,
    },
    item: {
        padding: theme.spacing(0.3),
    },
    itemUserName: {
        flex: 'none',
        marginRight: theme.spacing(1)

    },
    itemUserNameText: {
        fontWeight: 500,
        fontSize: '0.8rem'
    },
    itemUserNameTextBroadcaster: {
        borderRadius: '4px',
        paddingLeft: '2px',
        paddingRight: '2px',
        backgroundColor: yellow['600'],
        color: 'black'
    },
    itemMessage: {
        fontSize: '0.8rem'
    },
    actions: {
        padding: '16px',
        backgroundColor: grey['900']
    }
}));

interface ChatProps {
    user?: { name: string, email: string, is_broadcaster: boolean, password?: string }
    room: string;
    className?: any;
    finishRoom?: boolean;
    disabled?: boolean;
}

export const Chat: React.FC<ChatProps> = (props) => {

    const {user, className, room, finishRoom, disabled: disabledProp} = props;
    const classes = useStyles();
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [disabled, setDisabled] = useState(disabledProp);
    const socket = useMemo(() => {
        if (!user || user.name === "" || user.email === "") {
            return null;
        }
        return io(`${process.env.REACT_APP_MICRO_CHAT_URL}/room`)
    }, [user]);
    const messagesContainerRef = useRef() as MutableRefObject<any>;
    const messageRef = useRef() as MutableRefObject<any>;

    useEffect(() => {
        if (!socket || socket.connected || !user || user.name === "" || user.email === "") {
            return;
        }

        socket.on('connect', () => {
            console.log('chat connected');
            socket.on('get-messages', (data: ChatMessage[]) => setChatMessages(data));
            socket.on('new-message', (data: ChatMessage) =>
                setChatMessages((prevState => [...prevState, data]))
            );
            socket.on('finish-room', () => {
                setDisabled(true);
                socket.disconnect();
            });
            socket.emit('join', {
                user_name: user?.name,
                email: user?.email,
                room: room,
                ...(user.password && {password: user.password})
            });
        });

        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        }
    }, [socket, room, user]);

    useEffect(() => {
        setDisabled(disabledProp);
    }, [disabledProp]);

    useEffect(() => {
        if (!finishRoom || !socket) {
            return;
        }
        socket.emit('finish-room', {});
        setTimeout(() => {
            socket.disconnect();
        }, 500)
    }, [socket, finishRoom]);

    useEffect(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }, [messagesContainerRef, chatMessages]);

    function sendMessage() {
        const message = messageRef.current.value;
        if (!user || message === "" || !socket) {
            return;
        }

        socket.emit('send-message', {content: message});

        messageRef.current.value = "";

        if (message.startsWith('/')) {
            return;
        }


        setChatMessages(
            prevState => [
                ...prevState,
                {
                    user_name: user.name,
                    email: user.email,
                    content: message,
                    is_broadcaster: user.is_broadcaster
                }
            ]
        );

    }

    return (
        <Card className={clsx(classes.root, className)}>
            <CardHeader
                classes={{
                    root: classes.header,
                    subheader: classes.headerTitle
                }}
                subheader={'Chat'}
            />
            <CardContent style={{height: '550px', overflowY: 'scroll'}} ref={messagesContainerRef}>
                <List>
                    {chatMessages.map((message, key) => (
                        <ListItem key={key} className={classes.item}>
                            <ChatAvatar email={message.email}/>
                            <ListItemText
                                classes={{
                                    root: classes.itemUserName,
                                    primary: clsx(
                                        classes.itemUserNameText,
                                        message.is_broadcaster ? classes.itemUserNameTextBroadcaster : undefined
                                    ),
                                }}
                                primary={message.user_name}
                            />
                            <ListItemText classes={{primary: classes.itemMessage}} primary={message.content}/>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
            {
                !finishRoom && !disabled && <CardActions className={classes.actions}>
                    <ListItem className={classes.item}>
                        <ChatAvatar email={user?.email ?? ''}/>
                        <TextField
                            inputRef={messageRef}
                            style={{width: '100%'}}
                            label={user?.name}
                            placeholder={'Digite algo'}
                            InputLabelProps={{shrink: true}}
                            InputProps={{
                                onKeyDown: (event) => {
                                    if (event.keyCode === 13) {
                                        sendMessage();
                                    }
                                },
                                endAdornment: (
                                    <IconButton size={"small"} onClick={() => sendMessage()}>
                                        <SendIcon/>
                                    </IconButton>
                                )
                            }}
                        />
                    </ListItem>
                </CardActions>
            }
        </Card>
    );
};

export default Chat;

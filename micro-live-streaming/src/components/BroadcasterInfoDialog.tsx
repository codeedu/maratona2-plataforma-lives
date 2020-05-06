import * as React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@material-ui/core";
import {useState} from "react";

interface BroadcasterInfoDialogProps {
    open: boolean;
    onClose: (formData: { name: string, email: string, password: string }) => void;
}

const BroadcasterInfoDialog: React.FC<BroadcasterInfoDialogProps> = (props) => {
    const {open, onClose} = props;
    const [name, setName] = useState("Broadcaster");
    const [email, setEmail] = useState("broadcaster@fullcycle.com.br");
    const [password, setPassword] = useState("123456");

    const handleClose = () => {
        onClose({name, email, password});
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={'sm'}
            fullWidth={true}
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
        >
            <DialogTitle>
                Digite seu nome e e-mail e a senha para transmitir a live
            </DialogTitle>
            <DialogContent>
                <form>
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                label={'Nome'}
                                defaultValue={name}
                                onChange={(event) => setName(event.target.value)}
                                fullWidth={true}
                            />
                            <TextField
                                margin={'normal'}
                                label={'E-mail'}
                                defaultValue={email}
                                onChange={(event) => setEmail(event.target.value)}
                                fullWidth={true}
                            />
                            <TextField
                                margin={'normal'}
                                label={'Senha'}
                                defaultValue={password}
                                onChange={(event) => setPassword(event.target.value)}
                                fullWidth={true}
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
    )
};

export default BroadcasterInfoDialog;

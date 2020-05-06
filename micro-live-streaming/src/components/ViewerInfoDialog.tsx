import * as React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@material-ui/core";
import {useState} from "react";

interface ViewerInfoDialogProps {
    open: boolean;
    onClose: (formData: { name: string, email: string }) => void;
}

const ViewerInfoDialog: React.FC<ViewerInfoDialogProps> = (props) => {
    const {open, onClose} = props;

    const [name, setName] = useState("Viewer");
    const [email, setEmail] = useState("viewer@fullcycle.com.br");

    const handleClose = () => {
        onClose({name, email});
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
            <DialogTitle>Digite seu nome e e-mail para ver a live</DialogTitle>
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

export default ViewerInfoDialog;

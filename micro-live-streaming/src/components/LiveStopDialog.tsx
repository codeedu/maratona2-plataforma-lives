import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";

interface LiveStopDialogProps {
    open: boolean;
    onClose: (stop: boolean) => void;
}

const LiveStopDialog: React.FC<LiveStopDialogProps> = (props) => {
    const {open, onClose} = props;

    const handleClose = (stop:boolean) => {
        onClose(stop);
    };

    return (
        <Dialog
            open={open}
            onClose={() => handleClose(false)}
            maxWidth={'sm'}
            fullWidth={true}
        >
            <DialogTitle>Deseja encerrar a live</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Ao parar a live, todos os espectadores serão desconectados e a live não poderá ser reativada.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)} color="default">
                    Cancelar
                </Button>
                <Button onClick={() => handleClose(true)} color="primary">
                    Parar
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default LiveStopDialog;

import './App.css';
import React, {lazy, Suspense} from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {CssBaseline, MuiThemeProvider} from "@material-ui/core";
import theme from "./theme";
import {makeStyles} from "@material-ui/core/styles";
import {SnackbarProvider} from 'notistack';

const Broadcaster = lazy(() => import('./pages/Broadcaster'));
const Viewer = lazy(() => import('./pages/Viewer'));

const useStyles = makeStyles(theme => ({
    footer: {
        ...theme.mixins.toolbar,
    }
}));

function App() {
    const classes = useStyles();
    const snackbarProviderProps : any= {
        autoHideDuration: 3000,
        maxSnack: 3,
        anchorOrigin: {
            horizontal: 'right',
            vertical: 'top'
        },
    };
    return (
        <MuiThemeProvider theme={theme}>
            <SnackbarProvider {...snackbarProviderProps}>
                <CssBaseline/>
                <Suspense fallback={<div>Loading...</div>}>
                    <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
                        <Switch>
                            <Route path={'/broadcaster/:slug'} component={Broadcaster} exact={true}/>
                            <Route path={'/viewer/:slug'} component={Viewer} exact={true}/>
                        </Switch>
                    </BrowserRouter>
                </Suspense>
                <div className={classes.footer}/>
            </SnackbarProvider>
        </MuiThemeProvider>
    );
}

export default App;

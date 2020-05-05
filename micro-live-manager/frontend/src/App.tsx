import React from 'react';
import {BrowserRouter, Switch, Route, Redirect, Link} from "react-router-dom";
import {
    AppBar,
    CssBaseline,
    Drawer,
    List,
    ListItem, ListItemIcon,
    ListItemText,
    MuiThemeProvider,
    Toolbar,
    Typography
} from "@material-ui/core";
import theme from "./theme";
import LiveList from "./pages/live/List";
import LiveForm from "./pages/live/Form";
import LiveTvIcon from '@material-ui/icons/LiveTv';
import {makeStyles} from "@material-ui/core/styles";

const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        flexShrink: 0,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function App() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
                    <AppBar className={classes.appBar} position="fixed">
                        <Toolbar>
                            <Typography variant="h6">
                                Codelive Manager
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        classes={{
                            root: classes.drawer,
                            paper: classes.drawer,
                        }}
                        variant="permanent"
                        open
                    >
                        <List>
                            <ListItem button component={Link} to={"/lives"}>
                                <ListItemIcon>
                                    <LiveTvIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'Lives'}/>
                            </ListItem>
                        </List>
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar}/>

                        <Switch>
                            <Route path={'/lives'} component={LiveList} exact={true}/>
                            <Route path={'/lives/create'} component={LiveForm} exact={true}/>
                            <Redirect exact from="/" to="/lives"/>
                        </Switch>
                    </main>
                </BrowserRouter>
            </MuiThemeProvider>
        </div>
    );
}

export default App;

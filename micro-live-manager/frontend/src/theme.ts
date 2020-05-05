import {createMuiTheme, ThemeOptions} from "@material-ui/core";
import {teal} from "@material-ui/core/colors";

const defaultTheme = createMuiTheme({
    palette: {
        background: {
            default: '#1f1f1f',
            paper: '#1f1f1f'
        },
        primary: {
            main: teal['500']
        },
        type: "dark"
    },


});

const theme: ThemeOptions = {
    ...defaultTheme,
};

export default theme;

import {createMuiTheme, ThemeOptions} from "@material-ui/core";

const defaultTheme = createMuiTheme({
    palette: {
        background: {
            default: '#1f1f1f',
            paper: '#1f1f1f'
        },
        type: "dark",
    },
});

const theme: ThemeOptions = {
    ...defaultTheme,
    palette: {
        ...defaultTheme.palette,
        text: {
            primary: defaultTheme.palette.common.white,
            secondary: '#8c8c8d',
        },
        action: {
            active: defaultTheme.palette.common.white
        },
    },
    overrides: {
        MuiSnackbarContent: {
            root: {
                '&[class*="variant"]': {
                    color: defaultTheme.palette.common.white
                },
            }
        },
    }
};

export default theme;

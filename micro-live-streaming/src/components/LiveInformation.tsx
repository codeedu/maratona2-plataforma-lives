// @flow
import * as React from 'react';
import {Box, Divider, Typography} from "@material-ui/core";
import {Live, LiveStatus} from "../utils/models";
import {format, parseISO} from 'date-fns';

interface LiveInformationProps {
    live: Live,
    usersConnected: number;
}

const LiveInformation: React.FC<LiveInformationProps> = (props) => {
    const {live, usersConnected} = props;
    return (
        <Box margin={1}>
            <Typography gutterBottom variant={'h4'}>
                {
                    `${live.title} `
                    + (live.status === LiveStatus.DONE
                        ? ` - Feita em ${format(parseISO(live.date), "dd/MM/yyyy HH:mm")}`
                        : "")
                }
            </Typography>
            <Typography gutterBottom variant={'body2'} color={"textSecondary"}>
                {usersConnected} assistindo
            </Typography>
            <Divider/>
            <Box marginTop={1}>
                <Typography variant={'body2'} color={"textSecondary"}>
                    {live.description}
                </Typography>
            </Box>
        </Box>
    );
};

export default LiveInformation;

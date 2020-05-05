// @flow
import * as React from 'react';
import {
    Box,
    Link as MuiLink,
    Container, Fab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {useEffect, useState} from "react";
import axios from 'axios';
import {Live} from "../../utils/models";
import {format, parseISO} from 'date-fns';
import {Link} from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';

export const List = () => {

    const [data, setData] = useState<Live[]>([]);

    useEffect(() => {
        async function load() {
            const {data} = await axios.get(`${process.env.REACT_APP_MICRO_GENERATOR_URL}/lives`);
            setData(data);
        }

        load();
    }, []);

    return (
        <Container>
            <Typography variant={"h4"}>Listagem de lives</Typography>
            <Box dir={'rtl'} paddingBottom={2}>
                <Fab
                    title="Adicionar nova live"
                    color="primary"
                    size={'small'}
                    component={Link}
                    to="/lives/create"
                >
                    <AddIcon/>
                </Fab>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Título</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, key) => (
                        <TableRow key={key}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{format(parseISO(item.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>
                                <MuiLink
                                    href={`${process.env.REACT_APP_MICRO_STREAMING_URL}/broadcaster/${item.slug}`}
                                    target="_blank"
                                >
                                    Fazer live
                                </MuiLink>{' | '}
                                <MuiLink
                                    href={`${process.env.REACT_APP_MICRO_STREAMING_URL}/viewer/${item.slug}`}
                                    target="_blank"
                                >
                                    Convite
                                </MuiLink>
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </Container>
    );
};

export default List;

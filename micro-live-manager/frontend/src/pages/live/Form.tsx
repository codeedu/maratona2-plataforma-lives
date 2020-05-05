// @flow
import * as React from 'react';
import {Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import {useForm} from "react-hook-form";
import * as yup from 'yup';
import axios from "axios";
import {useHistory} from "react-router";

const Form = () => {
    const {register, handleSubmit, errors} = useForm({
        validationSchema: yup.object({
            title: yup.string()
                .required('O campo é requerido')
                .max(255, 'O campo deve ter no máximo 255 caracteres'),
            date: yup.date()
                .required('O campo é requerido'),
            password: yup.string()
                .required('O campo é requerido')
                .min(6, 'O campo precisa ter no mínimo 6 caracteres'),
        }),
    });

    const history = useHistory();

    const onSubmit = async (values: any) => {
        await axios.post(`${process.env.REACT_APP_MICRO_GENERATOR_URL}/lives`, values);

        history.push('/lives');
    };

    return (
        <Container>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h4">Nova live</Typography>
                    <form method="post" onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            name="title"
                            label="Título"
                            margin="normal"
                            fullWidth
                            inputRef={register}
                            InputLabelProps={{shrink: true}}
                            error={errors.title !== undefined}
                            helperText={errors.title && errors.title.message}
                        />

                        <TextField
                            multiline
                            name="description"
                            label="Descrição"
                            margin="normal"
                            fullWidth
                            inputRef={register}
                            InputLabelProps={{shrink: true}}
                        />

                        <TextField
                            type={"datetime-local"}
                            name="date"
                            label="Data"
                            margin="normal"
                            fullWidth
                            inputRef={register}
                            InputLabelProps={{shrink: true}}
                            error={errors.date !== undefined}
                            helperText={errors.date && errors.date.message}
                        />

                        <TextField
                            type={"password"}
                            name="password"
                            label="Senha"
                            margin="normal"
                            fullWidth
                            inputRef={register}
                            InputLabelProps={{shrink: true}}
                            error={errors.password !== undefined}
                            helperText={errors.password && errors.password.message}
                        />

                        <Button type="submit" variant="contained" color="primary">Enviar</Button>
                    </form>
                </Grid>
            </Grid>
        </Container>
    )
};

export default Form;

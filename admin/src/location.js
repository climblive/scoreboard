import React from 'react';
import { List, Edit, Create, SimpleForm, DisabledInput, TextInput, Datagrid, TextField } from 'react-admin';

export const LocationList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="longitude" />
            <TextField source="latitude" />
        </Datagrid>
    </List>
);

export const LocationEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <TextInput source="name" />
            <TextInput source="longitude" />
            <TextInput source="latitude" />
        </SimpleForm>
    </Edit>
);

export const LocationCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="longitude" />
            <TextInput source="latitude" />
        </SimpleForm>
    </Create>
);
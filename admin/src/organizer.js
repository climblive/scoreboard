import React from 'react';
import { List, Edit, Create, SimpleForm, TextInput, DisabledInput, Datagrid, TextField, UrlField } from 'react-admin';

export const OrganizerList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <UrlField source="homepage" />
        </Datagrid>
    </List>
);

export const OrganizerEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <TextInput source="name" />
            <TextInput source="homepage" />
        </SimpleForm>
    </Edit>
);

export const OrganizerCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="homepage" />
        </SimpleForm>
    </Create>
);
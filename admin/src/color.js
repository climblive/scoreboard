import React from 'react';
import { List, Edit, Create, SimpleForm, TextInput, DisabledInput, Datagrid, TextField } from 'react-admin';
import { ColorField, ColorInput } from 'react-admin-color-input';

export const ColorList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <ColorField source="rgbPrimary" />
            <ColorField source="rgbSecondary" />
        </Datagrid>
    </List>
);

export const ColorEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <TextInput source="name" />
            <ColorInput source="rgbPrimary" picker="Swatches" />
            <ColorInput source="rgbSecondary" picker="Swatches" />
        </SimpleForm>
    </Edit>
);

export const ColorCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ColorInput source="rgbPrimary" picker="Swatches" />
            <ColorInput source="rgbSecondary" picker="Swatches" />
        </SimpleForm>
    </Create>
);
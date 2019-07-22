import React from 'react';
import { List, Edit, Create, SimpleForm, TextInput, DisabledInput, Datagrid, TextField, ReferenceField, ReferenceInput, SelectInput } from 'react-admin';
import { ColorField, ColorInput } from 'react-admin-color-input';

export const ColorList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="organizerId" reference="organizer">
                <TextField source="name" />
            </ReferenceField>
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
            <ReferenceInput source="organizerId" reference="organizer">
                <SelectInput optionText="name"/>
            </ReferenceInput>
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
            <ReferenceInput source="organizerId" reference="organizer">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ColorInput source="rgbPrimary" picker="Swatches" />
            <ColorInput source="rgbSecondary" picker="Swatches" />
        </SimpleForm>
    </Create>
);
import React from 'react';
import { List, Edit, Create, SimpleForm, DisabledInput, TextInput, Datagrid, TextField, ReferenceField, ReferenceInput, SelectInput } from 'react-admin';

export const LocationList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="organizerId" reference="organizer">
                <TextField source="name" />
            </ReferenceField>
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
            <ReferenceInput source="organizerId" reference="organizer">
                <SelectInput optionText="name"/>
            </ReferenceInput>
            <TextInput source="name" />
            <TextInput source="longitude" />
            <TextInput source="latitude" />
        </SimpleForm>
    </Edit>
);

export const LocationCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="organizerId" reference="organizer">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="name" />
            <TextInput source="longitude" />
            <TextInput source="latitude" />
        </SimpleForm>
    </Create>
);
import React from 'react';
import { List, Edit, Create, SimpleForm, DisabledInput, TextInput, Datagrid, TextField, ReferenceField, ReferenceInput, SelectInput } from 'react-admin';

export const SeriesList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="organizerId" reference="organizer">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="name" />
        </Datagrid>
    </List>
);

export const SeriesEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <ReferenceInput source="organizerId" reference="organizer">
                <SelectInput optionText="name"/>
            </ReferenceInput>
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);

export const SeriesCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="organizerId" reference="organizer">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);
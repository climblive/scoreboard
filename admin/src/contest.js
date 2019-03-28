import React from 'react';
import { List, Edit, Create, SimpleForm, DisabledInput, ReferenceInput, SelectInput, TextInput, NumberInput, Datagrid, TextField, ReferenceField, NumberField, RichTextField } from 'react-admin';

export const ContestList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="locationId" reference="location">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="organizerId" reference="organizer">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="name" />
            <RichTextField source="description" />
            <NumberField source="qualifyingProblems" />
            <RichTextField source="rules" />
        </Datagrid>
    </List>
);

export const ContestEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <ReferenceInput source="locationId" reference="location">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="organizerId" reference="organizer">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="name" />
            <TextInput source="description" />
            <NumberInput source="qualifyingProblems" />
            <TextInput source="rules" />
        </SimpleForm>
    </Edit>
);

export const ContestCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="locationId" reference="location">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="organizerId" reference="organizer">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="name" />
            <TextInput source="description" />
            <NumberInput source="qualifyingProblems" />
            <TextInput source="rules" />
        </SimpleForm>
    </Create>
);
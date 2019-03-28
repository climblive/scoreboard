import React from 'react';
import { List, Edit, Create, SimpleForm, TextInput, DisabledInput, ReferenceInput, SelectInput, Datagrid, TextField, DateField, ReferenceField, DateTimeInput } from 'react-admin';

export const ContenderList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="compClassId" reference="compClass">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="contestId" reference="contest">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="registrationCode" />
            <TextField source="name" />
            <DateField source="entered" showTime />
        </Datagrid>
    </List>
);

export const ContenderEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <ReferenceInput source="compClassId" reference="compClass">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="contestId" reference="contest">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="registrationCode" />
            <TextInput source="name" />
            <DateTimeInput source="entered" type="datetime-local" />
        </SimpleForm>
    </Edit>
);

export const ContenderCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="compClassId" reference="compClass">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="contestId" reference="contest">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="registrationCode" />
            <TextInput source="name" />
            <DateTimeInput source="entered" type="datetime-local" />
        </SimpleForm>
    </Create>
);
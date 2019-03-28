import React from 'react';
import { List, Edit, Create, SimpleForm, DisabledInput, SelectInput, TextInput, DateTimeInput, ReferenceInput, Datagrid, TextField, DateField, ReferenceField, RichTextField } from 'react-admin';

export const CompClassList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="contestId" reference="contest">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="name" />
            <RichTextField source="description" />
            <DateField source="timeBegin" showTime />
            <DateField source="timeEnd" showTime />
        </Datagrid>
    </List>
);

export const CompClassEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <ReferenceInput source="contestId" reference="contest">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="name" />
            <TextInput source="description" />
            <DateTimeInput source="timeBegin" />
            <DateTimeInput source="timeEnd" />
        </SimpleForm>
    </Edit>
);

export const CompClassCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="contestId" reference="contest">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="name" />
            <TextInput source="description" />
            <DateTimeInput source="timeBegin" />
            <DateTimeInput source="timeEnd" />
        </SimpleForm>
    </Create>
);
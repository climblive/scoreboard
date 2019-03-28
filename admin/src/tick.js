import React from 'react';
import { List, Edit, Create, SimpleForm, TextInput, Datagrid, DateTimeInput, ReferenceInput, SelectInput, BooleanInput, TextField, BooleanField, DateField, ReferenceField, NumberField } from 'react-admin';

export const TickList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <DateField source="timestamp" showTime />
            <ReferenceField source="contenderId" reference="contender">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="problemId" reference="problem">
                <NumberField source="number" />
            </ReferenceField>
            <BooleanField source="flash" />
        </Datagrid>
    </List>
);

export const TickEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <DateTimeInput source="timestamp" />
            <ReferenceInput source="contenderId" reference="contender">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="problemId" reference="problem">
                <SelectInput optionText="number" />
            </ReferenceInput>
            <BooleanInput source="flash" />
        </SimpleForm>
    </Edit>
);

export const TickCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <DateTimeInput source="timestamp" />
            <ReferenceInput source="contenderId" reference="contender">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="problemId" reference="problem">
                <SelectInput optionText="number" />
            </ReferenceInput>
            <BooleanInput source="flash" />
        </SimpleForm>
    </Create>
);

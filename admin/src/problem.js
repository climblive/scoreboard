import React from 'react';
import { List, Edit, Create, SimpleForm, TextInput, ReferenceInput, SelectInput, NumberInput, Datagrid, TextField, NumberField, ReferenceField } from 'react-admin';
import { ColorField } from 'react-admin-color-input';

export const ProblemList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="colorId" reference="color">
                <ColorField source="rgb"/>
            </ReferenceField>
            <ReferenceField source="contestId" reference="contest">
                <TextField source="name" />
            </ReferenceField>
            <NumberField source="number" />
            <NumberField source="points" />
            <NumberField source="flashBonus" />
        </Datagrid>
    </List>
);

export const ProblemEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <ReferenceInput source="colorId" reference="color">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="contestId" reference="contest">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <NumberInput source="number" />
            <NumberInput source="points" />
            <NumberInput source="flashBonus" />
        </SimpleForm>
    </Edit>
);

export const ProblemCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="colorId" reference="color">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="contestId" reference="contest">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <NumberInput source="number" />
            <NumberInput source="points" />
            <NumberInput source="flashBonus" />
        </SimpleForm>
    </Create>
);
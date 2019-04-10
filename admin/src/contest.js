import React from 'react';
import { List, Edit, Create, SimpleForm, ReferenceInput, SelectInput, TextInput, NumberInput, Datagrid, TextField, ReferenceField, NumberField, RichTextField } from 'react-admin';
import {API_URL} from './dataProvider.js'
import { saveAs } from 'file-saver';

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

export class ContestEdit extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        console.log("DATA_API " + API_URL);
    }

    batchCreateContenders = () => {
        console.log("batchCreateContenders");
    }

    onChange = (evt) => {
        console.log(evt);
        const files = Array.from(evt.target.files);
        var reader = new FileReader();
        reader.readAsArrayBuffer(files[0]);
        reader.onload = (evt) => {
            var arrayBuffer = evt.currentTarget.result;
            console.log("ArrayBuffer", arrayBuffer);
            // Send stuff:
            fetch(API_URL + "/contest/" + this.props.id + "/pdf",
                {
                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            "Content-Type": "application/pdf",
                        },
                        redirect: "follow", // manual, *follow, error
                        referrer: "no-referrer", // no-referrer, *client
                        body: arrayBuffer, // body data type must match "Content-Type" header
                    }
            )
                .then(response => {
                    response.blob().then(blob => {
                        console.log(blob)
                        saveAs(blob, "contest.pdf");
                    })
                })
                .catch(error => {
                    console.log(error);
                })
        }
        reader.onerror = function (evt) {
            console.log("onerror", evt);
        }
    };

    exportResults = () => {
        console.log("exportResults");
        fetch(API_URL + "/contest/export/" + this.props.id)
            .then(response => {
                response.blob().then(blob => {
                    console.log(blob)
                    saveAs(blob, "contest.xls");
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        return (
            <div>
                <Edit {...this.props}>
                    <SimpleForm>
                        <TextInput source="id"/>
                        <ReferenceInput source="locationId" reference="location">
                            <SelectInput optionText="name"/>
                        </ReferenceInput>
                        <ReferenceInput source="organizerId" reference="organizer">
                            <SelectInput optionText="name"/>
                        </ReferenceInput>
                        <TextInput source="name"/>
                        <TextInput source="description"/>
                        <NumberInput source="qualifyingProblems"/>
                        <TextInput source="rules"/>
                    </SimpleForm>
                </Edit>
                <div>
                    <div>Batch create contenders:</div>
                    <div>
                        <button onClick={this.batchCreateContenders}>Create</button>
                    </div>
                </div>
                <div>
                    <div>Create PDF:</div>
                    <div>
                        <input type='file' id='multi' onChange={this.onChange} />
                    </div>
                </div>
                <div>
                    <div>Export results:</div>
                    <div>
                        <button onClick={this.exportResults}>Export</button>
                    </div>
                </div>
            </div>
        )
    }
}

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
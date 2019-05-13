import React from 'react';
import { List, Edit, Create, SimpleForm, ReferenceInput, SelectInput, TextInput, NumberInput, Datagrid, TextField, ReferenceField, NumberField, RichTextField } from 'react-admin';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MuiTextField from '@material-ui/core/TextField';
import {API_URL} from './App.js'
import { saveAs } from 'file-saver';
import RichTextInput from 'ra-input-rich-text';

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
            <NumberField source="gracePeriod"/>
        </Datagrid>
    </List>
);

export class ContestEdit extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({numberOfContenders: '0'});
    }

    onNumberOfContendersChange = (evt) => {
        console.log(evt);
        this.setState({
            numberOfContenders: evt.target.value
        });
    }

    getAuthorization = () => {
        const token = localStorage.getItem('token');
        return `Basic ${token}`;
    }

    batchCreateContenders = () => {
        console.log("batchCreateContenders");
        // Send stuff:
        fetch(API_URL + "/contest/" + this.props.id + "/createContenders",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.getAuthorization()

                },
                body: JSON.stringify({count: parseInt(this.state.numberOfContenders)})
            }).then(response => {
                console.log("Created stuff");
            }).catch(error => {
                console.log(error);
            })

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
                    method: "POST",
                    headers: {
                        "Content-Type": "application/pdf",
                        "Authorization": this.getAuthorization()
                    },
                    body: arrayBuffer, // body data type must match "Content-Type" header
                }).then(response => {
                    response.blob().then(blob => {
                        console.log(blob)
                        saveAs(blob, "contest.pdf");
                    })
                }).catch(error => {
                    console.log(error);
                })
        }
        reader.onerror = function (evt) {
            console.log("onerror", evt);
        }
    };

    exportResults = () => {
        console.log("exportResults");
        fetch(API_URL + "/contest/export/" + this.props.id,
            {
                headers: {
                    "Content-Type": "application/pdf",
                    "Authorization": this.getAuthorization()
                }
            }).then(response => {
                response.blob().then(blob => {
                    console.log(blob)
                    saveAs(blob, "contest.xls");
                })
            }).catch(error => {
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
                        <RichTextInput source="rules"/>
                        <NumberInput source="gracePeriod"/>
                    </SimpleForm>
                </Edit>
                <div style={{display:'flex', marginTop:16}}>
                    <Paper style={{padding:'16px 24px', flexBasis:0, marginRight:16, flexGrow:1}}>
                        <div style={{marginBottom:16}}>1. Batch create contenders</div>
                        <div>
                            <MuiTextField label="Number of contenders" value={this.state ? this.state.numberOfContenders : '0'} onChange={this.onNumberOfContendersChange}/>
                            <Button variant="outlined" style={{marginTop:10, display:'block'}} onClick={this.batchCreateContenders}>Create</Button>
                        </div>
                    </Paper>
                    <Paper style={{padding:'16px 24px', flexBasis:0, marginRight:16, flexGrow:1}}>
                        <div style={{marginBottom:16}}>2. Create PDF</div>
                        <div>
                            <input type='file' id='multi' onChange={this.onChange} />
                        </div>
                    </Paper>
                    <Paper style={{padding:'16px 24px', flexBasis:0, flexGrow:1}}>
                        <div style={{marginBottom:16}}>3. Export results</div>
                        <div>
                            <Button variant="outlined" onClick={this.exportResults}>Export</Button>
                        </div>
                    </Paper>
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
            <RichTextInput source="rules" />
            <NumberInput source="gracePeriod"/>
        </SimpleForm>
    </Create>
);

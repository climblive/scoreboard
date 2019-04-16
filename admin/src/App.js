import React from 'react';
import { Admin, Resource, fetchUtils } from 'react-admin';
import { UserList, UserEdit, UserCreate } from './user';
import { ContenderList, ContenderEdit, ContenderCreate } from "./contender";
import { ContestList, ContestEdit, ContestCreate } from "./contest";
import { CompClassList, CompClassEdit, CompClassCreate } from "./compClass";
import { TickList, TickEdit, TickCreate } from "./tick";
import { ProblemList, ProblemEdit, ProblemCreate } from "./problem";
import { ColorList, ColorEdit, ColorCreate } from "./color";
import { LocationList, LocationEdit, LocationCreate } from "./location";
import { OrganizerList, OrganizerEdit, OrganizerCreate } from "./organizer";
import Dashboard from './Dashboard';
import dataProvider from './dataProvider';
import authProvider from './authProvider';
import FaceIcon from '@material-ui/icons/Face';
import UserIcon from '@material-ui/icons/Group';
import ClassIcon from '@material-ui/icons/Class';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import DateRangeIcon from '@material-ui/icons/DateRange';
import CheckIcon from '@material-ui/icons/Check';
import HomeIcon from '@material-ui/icons/Home';

export const API_URL = 'http://localhost:8080/api';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', `Basic ${token}`);
    return fetchUtils.fetchJson(url, options);
}

const App = () => (
    <Admin title="Scoreboard" authProvider={authProvider} dashboard={Dashboard} dataProvider={dataProvider(API_URL, httpClient)}>
        <Resource name="user" icon={UserIcon} list={UserList} edit={UserEdit} create={UserCreate} />
        <Resource name="contender" icon={FaceIcon} list={ContenderList} edit={ContenderEdit} create={ContenderCreate} />
        <Resource name="compClass" icon={ClassIcon} list={CompClassList} edit={CompClassEdit} create={CompClassCreate} options={{ label: 'Comp Classes' }} />
        <Resource name="contest" icon={DateRangeIcon} list={ContestList} edit={ContestEdit} create={ContestCreate} />
        <Resource name="tick" icon={CheckIcon} list={TickList} edit={TickEdit} create={TickCreate} />
        <Resource name="problem" icon={ReportProblemIcon} list={ProblemList} edit={ProblemEdit} create={ProblemCreate} />
        <Resource name="color" icon={ColorLensIcon} list={ColorList} edit={ColorEdit} create={ColorCreate} />
        <Resource name="organizer" icon={HomeIcon} list={OrganizerList} edit={OrganizerEdit} create={OrganizerCreate} />
        <Resource name="location" icon={LocationOnIcon} list={LocationList} edit={LocationEdit} create={LocationCreate} />
    </Admin>
);

export default App;
import * as React from 'react';
import './ProblemList.css';
import { Problem } from '../model/problem';
import ProblemList from './ProblemList';

export interface Props {
   problems: Problem[];
   onToggle?: () => void;
}

function MainView({ problems, onToggle }: Props) {
   return (
      <ProblemList problems={problems} onToggle={onToggle} />
   );
}

export default MainView;
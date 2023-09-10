import { FC } from 'react';
import Batch from './Batch';
import Form from './Form';

import './style.css';

export const App: FC<{ name: string }> = ({ name }) => {
  return (
    <div>
      <h1>Hello {name}!</h1>
      <p>Start editing to see some magic happen :)</p>
      <Form />
      <Batch />
    </div>
  );
};

import Check from './Check';
import Close from './Close';
import Xls from './Xls';
import Unknown from './Unknown';

import React from 'react';

export default function Icon({ name, ...rest }) {
  switch (name) {
    case "CHECK":
      return <Check {...rest} />;

    case "CLOSE":
      return <Close {...rest} />;

    case "XLS":
      return <Xls {...rest} />;

    case "XLSX":
    return <Xls {...rest} />;

    default:
      return <Unknown {...rest} />;
  }
}

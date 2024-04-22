import React from 'react';
import TextField from '@mui/material/TextField';

export default function DataPersonalForm({ fields, data, onChange, validationErrors }) {

  
  return (
    <>
      {fields.map((field) => (
        <TextField
          key={field}
          margin="dense"
          label={field[0].toUpperCase() + field.slice(1)}
          type="text"
          fullWidth
          name={field}
          value={data[field]}
          onChange={onChange}
          error={!!validationErrors[field]}
          helperText={validationErrors[field]}
        />
      ))}
    </>
  );
}



import React from 'react';
import { TextField, InputAdornment, Grid } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function FormTextField ({
  xs,
  label,
  name,
  placeholder,
  value,
  onChange,
  disabled,
  cepValid
}) {
  return (
    <Grid item xs={xs}>
      <TextField
        
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fullWidth
        variant="outlined"
        name={name}
        disabled={disabled}
        InputProps={{
          endAdornment: cepValid ? (
            <InputAdornment position="end">
              <CheckIcon color="success" />
            </InputAdornment>
          ) : null,
        }}
      />
    </Grid>
  );
}
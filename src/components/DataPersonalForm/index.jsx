import React from 'react';
import { TextField } from '@mui/material';

function DataPersonalForm({ name, setName, email, setEmail, phone, setPhone, cpf, setCpf, validationErrors }) {
  // Função para lidar com mudanças nos campos
  const handleChange = (fieldName) => (event) => {
    const { value } = event.target;
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'cpf':
        setCpf(value);
        break;
      default:
        break;
    }
  };

  // Lista de campos para mapear, incluindo os estados e funções de setter correspondentes
  const fields = [
    { name: 'name', value: name, setter: setName },
    { name: 'email', value: email, setter: setEmail },
    { name: 'phone', value: phone, setter: setPhone },
    { name: 'cpf', value: cpf, setter: setCpf }
  ];

  return (
    <div>
      {fields.map(({ name, value, setter }) => (
        <TextField
          key={name}
          margin="dense"
          label={name.charAt(0).toUpperCase() + name.slice(1)}
          type="text"
          fullWidth
          name={name}
          value={value}
          onChange={handleChange(name)}
          error={!!validationErrors[name]}
          helperText={validationErrors[name]}
        />
      ))}
    </div>
  );
}

export default DataPersonalForm;

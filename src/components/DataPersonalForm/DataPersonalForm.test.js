import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataPersonalForm from './index.jsx'; 

describe('DataPersonalForm Component', () => {
  const fields = ['name', 'email'];
  const data = { name: 'John Doe', email: 'john@example.com' };
  const validationErrors = { name: '', email: 'Invalid email' };
  const handleChange = jest.fn();

  // Teste para verificar se os campos são renderizados corretamente
  test('renders text fields for each field provided', () => {
    render(<DataPersonalForm fields={fields} data={data} onChange={handleChange} validationErrors={{}} />);
    fields.forEach((field) => {
      expect(screen.getByLabelText(field[0].toUpperCase() + field.slice(1))).toBeInTheDocument();
    });
  });

  // Teste para verificar a exibição dos erros de validação
  test('displays validation errors when provided', () => {
    render(<DataPersonalForm fields={fields} data={data} onChange={handleChange} validationErrors={validationErrors} />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  // Teste para verificar se o evento onChange é chamado
  test('calls onChange when input value is changed', () => {
    render(<DataPersonalForm fields={fields} data={data} onChange={handleChange} validationErrors={{}} />);
    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'new@example.com' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

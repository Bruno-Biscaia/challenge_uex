import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdressForm from './index.jsx'; // Ajuste o caminho do import conforme necessário

describe('AdressForm Component', () => {
  // Teste para verificar se o TextField renderiza corretamente
  test('renders with correct placeholder and value', () => {
    render(<AdressForm placeholder="Enter your name" value="John Doe" onChange={() => {}} />);
    
    const inputElement = screen.getByPlaceholderText("Enter your name");
    expect(inputElement.value).toBe("John Doe");
  });

  // Teste para verificar a funcionalidade onChange
  test('calls onChange function when input changes', () => {
    const handleChange = jest.fn();
    render(<AdressForm value="" onChange={handleChange} />);

    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'Jane Doe' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Teste para verificar se o ícone de validação aparece quando cepValid é true
  test('displays check icon when cepValid is true', () => {
    render(<AdressForm cepValid={true} />);
    
    const checkIcon = screen.getByTestId('check-icon');
    expect(checkIcon).toBeInTheDocument();
  });
});

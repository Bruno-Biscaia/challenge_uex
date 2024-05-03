import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './index.jsx';

describe('Modal Component', () => {
  const handleClose = jest.fn();
  const handleCancel = jest.fn();
  const handleConfirm = jest.fn();

  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(
      <Modal
        open={true}
        close={handleClose}
        title="Confirm Action"
        textContent="Are you sure you want to proceed?"
        handleCancel={handleCancel}
        labelCancel="Cancel"
        handleConfirm={handleConfirm}
        labelConfirm="Confirm"
      />
    );
  });

  // Teste para verificar se o modal renderiza corretamente
  test('renders the modal with title and content', () => {
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to proceed?")).toBeInTheDocument();
  });

  // Teste para verificar as ações dos botões
  test('calls handleCancel and handleConfirm when buttons are clicked', () => {
    const cancelButton = screen.getByText("Cancel");
    const confirmButton = screen.getByText("Confirm");

    fireEvent.click(cancelButton);
    expect(handleCancel).toHaveBeenCalledTimes(1);

    fireEvent.click(confirmButton);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  // Teste para verificar a função de fechar o modal
  test('calls close function on dialog close', () => {
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1); // Supondo que o evento de tecla Escape feche o modal
  });
});

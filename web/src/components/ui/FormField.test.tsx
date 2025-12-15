import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FormField from './FormField';

describe('FormField', () => {
  it('renderiza el label correctamente', () => {
    render(
      <FormField id="test-field" label="Campo de Prueba">
        <input id="test-field" />
      </FormField>
    );
    
    const label = screen.getByText('Campo de Prueba');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-field');
  });

  it('muestra asterisco cuando es required', () => {
    render(
      <FormField id="required-field" label="Campo Requerido" required>
        <input id="required-field" />
      </FormField>
    );
    
    expect(screen.getByText('Campo Requerido *')).toBeInTheDocument();
  });

  it('renderiza children correctamente', () => {
    render(
      <FormField>
        <input data-testid="test-input" placeholder="Input de prueba" />
      </FormField>
    );
    
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
  });

  it('muestra texto de ayuda cuando se proporciona', () => {
    render(
      <FormField help="Este es un texto de ayuda">
        <input />
      </FormField>
    );
    
    const helpText = screen.getByText('Este es un texto de ayuda');
    expect(helpText).toBeInTheDocument();
    expect(helpText).toHaveClass('form-text');
  });

  it('muestra error cuando se proporciona', () => {
    render(
      <FormField error="Este campo es requerido">
        <input />
      </FormField>
    );
    
    expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
  });

  it('muestra feedback cuando no hay error', () => {
    render(
      <FormField feedback="Formato válido">
        <input />
      </FormField>
    );
    
    expect(screen.getByText('Formato válido')).toBeInTheDocument();
  });

  it('prioriza error sobre feedback', () => {
    render(
      <FormField error="Error de validación" feedback="Formato válido">
        <input />
      </FormField>
    );
    
    expect(screen.getByText('Error de validación')).toBeInTheDocument();
    expect(screen.queryByText('Formato válido')).not.toBeInTheDocument();
  });

  it('aplica clases CSS correctamente', () => {
    const { container } = render(
      <FormField 
        className="custom-field" 
        labelClassName="custom-label"
        inputWrapperClassName="custom-wrapper"
        label="Test"
      >
        <input />
      </FormField>
    );
    
    const fieldContainer = container.firstChild;
    expect(fieldContainer).toHaveClass('mb-3', 'custom-field');
    
    const label = screen.getByText('Test');
    expect(label).toHaveClass('form-label', 'custom-label');
    
    const wrapper = container.querySelector('.custom-wrapper');
    expect(wrapper).toBeInTheDocument();
  });
});
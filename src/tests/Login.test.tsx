import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Login from '../../pages/Login';

// Mock API to prevent errors during render
vi.mock('../../src/api/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    }
}));

describe('Login Page', () => {
    it('renders login form', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        expect(screen.getByText('EduDocs')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('nome@edu.gov.br')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
        expect(screen.getByText('Acessar')).toBeInTheDocument();
    });
});

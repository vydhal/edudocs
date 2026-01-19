import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import PublicHome from '../../pages/PublicHome';

// Mock API
vi.mock('../../src/api/api', () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: [] })),
    }
}));

describe('PublicHome Page', () => {
    it('renders main elements', () => {
        render(
            <BrowserRouter>
                <PublicHome />
            </BrowserRouter>
        );
        expect(screen.getByText(/Transparência e/i)).toBeInTheDocument();
        expect(screen.getByText(/Acesso Rápido/i)).toBeInTheDocument();
        // Check for presence of search input
        expect(screen.getByPlaceholderText(/Busque por editais/i)).toBeInTheDocument();
    });
});

// src/main.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/main.css";


import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initDataLoaders } from "./utils/dataLoaders";
import { runApiStartupChecks } from "./services/health";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { seedUsersFromJson } from './utils/seedUsers';

/**
 * Main es el punto de entrada de la app.
 * - Monta <App />. en #root
 *  - StrictMode ayuda a detectar practicas inseguras en desarrollo (no se como jajaja)
 */

async function bootstrap() {
    try {
        await initDataLoaders();
    } catch {
        // If initialization fails, continue rendering; pages can handle empty data gracefully
    }

    // Non-blocking API health checks to surface backend issues in console
    runApiStartupChecks().catch(() => {});

    createRoot(document.getElementById("root") as HTMLElement).render(
        <StrictMode>
            <AuthProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </StrictMode>
    )
}

bootstrap();

// Seed dev users into localStorage on development builds so the demo accounts are available
if (import.meta.env.DEV) {
    try {
        seedUsersFromJson();
    } catch {
        // ignore seed errors in dev
    }
}

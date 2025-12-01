"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryCliente = new QueryClient();

export const ReactQueryProvider = ({ children }) => {
    return (
        <QueryClientProvider client={queryCliente}>
            {children}
        </QueryClientProvider>
    )
 }
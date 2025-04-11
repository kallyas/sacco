import React, { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useRouteError,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "~/components/ui/toaster";
import { Button } from "~/components/ui/button";
import { Shield, AlertTriangle, Home, RefreshCw } from "lucide-react";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="ModernSACCO - Your trusted partner in financial growth"
        />
        <meta name="theme-color" content="#1e3a8a" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

function ErrorContent() {
  const error = useRouteError();
  const navigate = useNavigate();

  // Log errors to console in development mode
  useEffect(() => {
    if (import.meta.env.DEV && error instanceof Error) {
      console.error("Route error:", error);
    }
  }, [error]);

  // Determine error details based on error type
  let status: number | string = "Error";
  let title = "Something went wrong";
  let message = "An unexpected error has occurred. Our team has been notified.";
  let isNotFound = false;
  let errorDetails: string | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    isNotFound = error.status === 404;
    title = isNotFound ? "Page not found" : `Error ${error.status}`;
    message =
      error.statusText ||
      (isNotFound
        ? "The page you're looking for doesn't exist or has been moved."
        : "There was a problem processing your request.");

    // Additional details for specific status codes
    if (error.status === 401) {
      message =
        "You don't have permission to access this resource. Please log in and try again.";
    } else if (error.status === 403) {
      message =
        "You don't have sufficient permissions to access this resource.";
    } else if (error.status === 500) {
      message =
        "A server error occurred. Our team has been notified and is working on it.";
    }

    // Get data from error response if available
    if (error.data?.message) {
      errorDetails = error.data.message;
    }
  } else if (error instanceof Error) {
    title = "Application Error";
    message = "The application encountered an unexpected error.";
    errorDetails = import.meta.env.DEV ? error.message : undefined;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        {isNotFound ? (
          <AlertTriangle className="h-10 w-10 text-warning" />
        ) : (
          <Shield className="h-10 w-10 text-primary" />
        )}
      </div>

      {status && (
        <p className="text-lg font-semibold text-muted-foreground mb-2">
          Status: {status}
        </p>
      )}
      <h1 className="text-4xl font-bold mb-4 text-foreground">{title}</h1>
      <p className="text-xl text-muted-foreground max-w-md mb-8">{message}</p>

      {errorDetails && import.meta.env.DEV && (
        <div className="w-full max-w-2xl mb-8">
          <details className="bg-secondary/50 border border-border rounded-lg overflow-hidden">
            <summary className="px-4 py-2 font-medium cursor-pointer bg-secondary/70">
              Error Details
            </summary>
            <pre className="p-4 text-sm overflow-x-auto whitespace-pre-wrap break-words text-left">
              {errorDetails}
            </pre>
          </details>

          {error instanceof Error && error.stack && (
            <details className="bg-secondary/50 border border-border rounded-lg overflow-hidden mt-2">
              <summary className="px-4 py-2 font-medium cursor-pointer bg-secondary/70">
                Stack Trace
              </summary>
              <pre className="p-4 text-sm overflow-x-auto whitespace-pre-wrap break-words text-left">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="space-x-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          <span>Go Back</span>
        </Button>

        <Button
          onClick={() => navigate("/")}
          className="space-x-2 bg-primary text-primary-foreground"
        >
          <Home className="h-4 w-4 mr-2" />
          <span>Return Home</span>
        </Button>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <ErrorContent />
        </main>
      </div>
    </Layout>
  );
}

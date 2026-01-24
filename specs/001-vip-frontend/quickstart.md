# Quickstart Guide: VIP Todo Frontend (Phase II)

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher (or yarn/bun)
- Git
- Access to the backend API (assumed to be running on `http://localhost:8000`)

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
# If the frontend directory doesn't exist yet
mkdir frontend
cd frontend
```

### 2. Initialize Next.js Project

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 3. Install Required Dependencies

```bash
npm install @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-checkbox @radix-ui/react-toast \
  framer-motion lucide-react class-variance-authority tailwind-merge clsx \
  better-auth @better-auth/react
```

### 4. Install Development Dependencies

```bash
npm install -D tailwindcss-animate
```

### 5. Configure Tailwind CSS for Dark Mode and Glassmorphism

Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "stagger": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "stagger-item": "stagger 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 6. Set up Environment Variables

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:8000
```

### 7. Initialize Better Auth Client

Create `src/lib/auth-client.ts`:

```ts
import { createAuthClient } from "@better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8000",
  // Add JWT plugin configuration here
});
```

### 8. Create API Client with JWT Injection

Create `src/lib/api.ts`:

```ts
import { authClient } from '@/lib/auth-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Centralized API client with JWT injection and error handling
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const session = await authClient.getSession();
    const token = session?.session?.token;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Redirect to login on 401
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const session = await authClient.getSession();
    const token = session?.session?.token;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const session = await authClient.getSession();
    const token = session?.session?.token;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const session = await authClient.getSession();
    const token = session?.session?.token;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },
};
```

### 9. Run the Development Server

```bash
npm run dev
```

Your VIP Todo Frontend will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


export function corsHeaders(origin?: string): HeadersInit {
  const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];
  
  // Default allowed origins for browser extension and development
  const defaultAllowedOrigins = [
    'https://www.twitch.tv',
    'https://twitch.tv',
    'http://localhost:3000',
    'https://prediction-live.vercel.app',
    'chrome-extension://*', // Allow chrome extensions
    'moz-extension://*', // Allow firefox extensions
  ];

  const allAllowedOrigins = [...ALLOWED_ORIGINS, ...defaultAllowedOrigins];

  // Check if the origin is allowed
  const isAllowed = origin && (
    allAllowedOrigins.includes(origin) ||
    allAllowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        // Handle wildcard patterns like chrome-extension://*
        const pattern = allowed.replace(/\*/g, '.*');
        return new RegExp(pattern).test(origin);
      }
      return false;
    })
  );

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin! : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  };
}
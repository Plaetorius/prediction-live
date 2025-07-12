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

  return {
		'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin || '')
			? origin!
			: 'null',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400'
	}
}
/**
 * Shared boot-screen constants. Kept out of boot-screen.tsx on purpose:
 * that file is 'use client', and a server component (layout.tsx) can't
 * read plain values exported from a client module.
 */
export const BOOT_SESSION_KEY = 'jt-booted'
export const BOOT_EVENT = 'boot:done'

/**
 * Inline <head> script. Runs before first paint so repeat visits in the
 * same tab session (and reduced-motion visitors) never see the boot
 * screen flash:
 * - data-boot-skip → CSS hides .boot-screen immediately
 * - data-booted    → hero entrance/arrows render in their final state
 */
export const BOOT_SKIP_SCRIPT = `try{var d=document.documentElement;if(sessionStorage.getItem('${BOOT_SESSION_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-boot-skip','1');d.setAttribute('data-booted','1')}}catch(e){}`
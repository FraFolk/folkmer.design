import { defineConfig } from 'astro/config';

// GitHub Pages: set SITE and BASE when the repo name is known.
// User site (username.github.io) -> BASE='/'; project site -> BASE='/repo-name'.
export default defineConfig({
  site: process.env.SITE || 'https://folkmerdesign.com',
  base: process.env.BASE || '/',
  trailingSlash: 'ignore',
});

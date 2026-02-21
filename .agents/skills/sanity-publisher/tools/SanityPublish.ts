#!/usr/bin/env bun
/**
 * Sanity Publishing CLI
 *
 * Deterministic Sanity CMS validation and publishing tool.
 * Part of the enhanced blog writing system.
 *
 * Usage:
 *   sanity-publish validate <file>      Validate schema compliance
 *   sanity-publish preview <file>       Generate Sanity preview JSON
 *   sanity-publish push <file>          Push to Sanity CMS (requires credentials)
 *   sanity-publish status <post-id>     Check publication status
 *   sanity-publish help                 Show this help message
 *
 * Environment Variables (for push command):
 *   SANITY_PROJECT_ID    Sanity project ID
 *   SANITY_DATASET       Sanity dataset (default: production)
 *   SANITY_TOKEN         Sanity API token with write access
 *
 * Examples:
 *   bun run SanityPublish.ts validate ./sanity-ready-post.md
 *   bun run SanityPublish.ts preview ./sanity-ready-post.md
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import * as yaml from 'js-yaml';

// Sanity schema field definitions
const REQUIRED_CORE_FIELDS = ['title', 'slug', 'content', 'excerpt'];
const REQUIRED_METADATA_FIELDS = ['publishedAt', 'readingTime', 'wordCount', 'status'];
const REQUIRED_REFERENCE_FIELDS = ['author', 'categories'];
const REQUIRED_SEO_FIELDS = ['seo', 'seo.title', 'seo.description', 'seo.openGraph', 'seo.twitter'];

interface SanityPost {
  _type: string;
  title: string;
  slug: { _type: string; current: string };
  content: any;
  excerpt: string;
  coverImage?: { _type: string; asset: { _ref: string } };
  publishedAt: string;
  date?: string;
  status: string;
  readingTime: number;
  wordCount: number;
  author: { _type: string; _ref: string };
  categories: Array<{ _type: string; _ref: string }>;
  seo: {
    title: string;
    description: string;
    openGraph: {
      title: string;
      description: string;
      type: string;
      image?: string;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
      image?: string;
    };
  };
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missingFields: string[];
  presentFields: string[];
}

// Parse YAML frontmatter from markdown file
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  // Handle BOM if present
  const normalized = content.replace(/^\uFEFF/, '');

  // More robust regex for frontmatter
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (!match) {
    // Try without body
    const headerMatch = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (headerMatch) {
       try {
        const frontmatter = yaml.load(headerMatch[1]) as Record<string, any>;
        return {
           frontmatter: frontmatter || {},
           body: normalized.slice(headerMatch[0].length).trim()
        };
      } catch (e) {
        console.error('Failed to parse YAML frontmatter:', e);
        return { frontmatter: {}, body: normalized };
      }
    }

    console.error('No frontmatter found in file');
    return { frontmatter: {}, body: normalized };
  }

  const frontmatterStr = match[1];
  const body = match[2];

  try {
    const frontmatter = yaml.load(frontmatterStr) as Record<string, any>;
    return { frontmatter: frontmatter || {}, body };
  } catch (e) {
    console.error('Failed to parse YAML frontmatter:', e);
    return { frontmatter: {}, body };
  }
}

// Helper to get nested property
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

// Validate Sanity schema compliance
function validate(filePath: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    missingFields: [],
    presentFields: [],
  };

  if (!existsSync(filePath)) {
    result.valid = false;
    result.errors.push(`File not found: ${filePath}`);
    return result;
  }

  const content = readFileSync(filePath, 'utf-8');
  const { frontmatter } = parseFrontmatter(content);

  // Check all required field groups
  const allRequiredFields = [
    ...REQUIRED_CORE_FIELDS,
    ...REQUIRED_METADATA_FIELDS,
    ...REQUIRED_REFERENCE_FIELDS,
    ...REQUIRED_SEO_FIELDS,
  ];

  for (const field of allRequiredFields) {
    const value = getNestedValue(frontmatter, field);
    if (value === undefined || value === null || value === '') {
      result.missingFields.push(field);
      result.valid = false;
      result.errors.push(`Missing required field: ${field}`);
    } else {
      result.presentFields.push(field);
    }
  }

  // Validate slug format
  if (frontmatter.slug && typeof frontmatter.slug === 'string') {
    if (!/^[a-z0-9-]+$/.test(frontmatter.slug)) {
      result.warnings.push('Slug should contain only lowercase letters, numbers, and hyphens');
    }
  }

  // Validate ISO timestamp
  if (frontmatter.publishedAt) {
    const date = new Date(frontmatter.publishedAt);
    if (isNaN(date.getTime())) {
      result.valid = false;
      result.errors.push('publishedAt must be a valid ISO timestamp');
    }
  }

  // Validate author reference format
  if (frontmatter.author && typeof frontmatter.author === 'string') {
    if (!frontmatter.author.startsWith('author-') && !frontmatter.author.match(/^[a-zA-Z0-9_-]+$/)) {
      result.warnings.push('Author reference should be a valid Sanity document ID');
    }
  }

  // Validate categories array
  if (frontmatter.categories) {
    if (!Array.isArray(frontmatter.categories) && typeof frontmatter.categories === 'string') {
      result.warnings.push('Categories should be an array of references');
    }
  }

  // Validate word count and reading time
  if (frontmatter.wordCount && frontmatter.wordCount < 500) {
    result.warnings.push('Word count seems low for a blog post (< 500)');
  }
  if (frontmatter.readingTime && frontmatter.readingTime < 3) {
    result.warnings.push('Reading time seems low (< 3 minutes)');
  }

  return result;
}

// Generate Sanity preview JSON
function preview(filePath: string): SanityPost | null {
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return null;
  }

  const content = readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);

  // Build Sanity document structure
  const sanityPost: SanityPost = {
    _type: 'post',
    title: frontmatter.title || '',
    slug: {
      _type: 'slug',
      current: frontmatter.slug || frontmatter.title?.toLowerCase().replace(/\s+/g, '-') || '',
    },
    content: body, // In real implementation, convert to Portable Text
    excerpt: frontmatter.excerpt || '',
    publishedAt: frontmatter.publishedAt || new Date().toISOString(),
    date: frontmatter.date || frontmatter.publishedAt || new Date().toISOString(),
    status: frontmatter.status || 'draft',
    readingTime: frontmatter.readingTime || Math.ceil(body.split(/\s+/).length / 200),
    wordCount: frontmatter.wordCount || body.split(/\s+/).length,
    author: {
      _type: 'reference',
      _ref: frontmatter.author || 'author-default',
    },
    categories: Array.isArray(frontmatter.categories)
      ? frontmatter.categories.map((cat: string) => ({
          _type: 'reference',
          _ref: cat,
        }))
      : [{ _type: 'reference', _ref: frontmatter.categories || 'category-default' }],
    seo: {
      title: frontmatter['seo.title'] || frontmatter.seo?.title || frontmatter.title || '',
      description: frontmatter['seo.description'] || frontmatter.seo?.description || frontmatter.excerpt || '',
      openGraph: {
        title: frontmatter['seo.openGraph.title'] || frontmatter.seo?.openGraph?.title || frontmatter.title || '',
        description: frontmatter['seo.openGraph.description'] || frontmatter.seo?.openGraph?.description || frontmatter.excerpt || '',
        type: frontmatter['seo.openGraph.type'] || frontmatter.seo?.openGraph?.type || 'article',
        image: frontmatter['seo.openGraph.image'] || frontmatter.seo?.openGraph?.image,
      },
      twitter: {
        card: frontmatter['seo.twitter.card'] || frontmatter.seo?.twitter?.card || 'summary_large_image',
        title: frontmatter['seo.twitter.title'] || frontmatter.seo?.twitter?.title || frontmatter.title || '',
        description: frontmatter['seo.twitter.description'] || frontmatter.seo?.twitter?.description || frontmatter.excerpt || '',
        image: frontmatter['seo.twitter.image'] || frontmatter.seo?.twitter?.image,
      },
    },
  };

  // Add cover image if present
  if (frontmatter.coverImage) {
    sanityPost.coverImage = {
      _type: 'image',
      asset: {
        _ref: frontmatter.coverImage,
      },
    };
  }

  return sanityPost;
}

// Push to Sanity CMS
async function push(filePath: string): Promise<{ success: boolean; documentId?: string; error?: string }> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_TOKEN;

  if (!projectId || !token) {
    return {
      success: false,
      error: 'Missing SANITY_PROJECT_ID or SANITY_TOKEN environment variables',
    };
  }

  // Validate first
  const validation = validate(filePath);
  if (!validation.valid) {
    return {
      success: false,
      error: `Validation failed: ${validation.errors.join(', ')}`,
    };
  }

  // Generate document
  const document = preview(filePath);
  if (!document) {
    return { success: false, error: 'Failed to generate Sanity document' };
  }

  try {
    const response = await fetch(
      `https://${projectId}.api.sanity.io/v2024-12-02/data/mutate/${dataset}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mutations: [
            {
              create: document,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Sanity API error: ${errorText}` };
    }

    const result = await response.json();
    const documentId = result.results?.[0]?.id;

    return {
      success: true,
      documentId,
    };
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${(error as Error).message}`,
    };
  }
}

// Check publication status
async function status(postId: string): Promise<{ found: boolean; status?: string; publishedAt?: string; error?: string }> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';

  if (!projectId) {
    return { found: false, error: 'Missing SANITY_PROJECT_ID environment variable' };
  }

  try {
    const query = encodeURIComponent(`*[_id == "${postId}"][0]{status, publishedAt, _updatedAt}`);
    const response = await fetch(
      `https://${projectId}.api.sanity.io/v2024-12-02/data/query/${dataset}?query=${query}`
    );

    if (!response.ok) {
      return { found: false, error: 'Sanity API error' };
    }

    const result = await response.json();
    if (!result.result) {
      return { found: false, error: 'Document not found' };
    }

    return {
      found: true,
      status: result.result.status,
      publishedAt: result.result.publishedAt,
    };
  } catch (error) {
    return { found: false, error: (error as Error).message };
  }
}

// Main CLI handler
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const target = args[1] ? resolve(args[1]) : args[1];

  switch (command) {
    case 'validate': {
      if (!target) {
        console.error('Usage: sanity-publish validate <file>');
        process.exit(1);
      }
      const result = validate(target);
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.valid ? 0 : 1);
    }

    case 'preview': {
      if (!target) {
        console.error('Usage: sanity-publish preview <file>');
        process.exit(1);
      }
      const result = preview(target);
      if (result) {
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
      }
      process.exit(1);
    }

    case 'push': {
      if (!target) {
        console.error('Usage: sanity-publish push <file>');
        process.exit(1);
      }
      const result = await push(target);
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    }

    case 'status': {
      if (!target) {
        console.error('Usage: sanity-publish status <post-id>');
        process.exit(1);
      }
      const result = await status(target);
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.found ? 0 : 1);
    }

    case 'help':
    default:
      console.log(`
Sanity Publishing CLI - Deterministic CMS publishing tool

Commands:
  validate <file>      Validate schema compliance before publishing
  preview <file>       Generate Sanity document preview (JSON)
  push <file>          Push to Sanity CMS (requires credentials)
  status <post-id>     Check publication status of a document
  help                 Show this help message

Required Schema Fields:
  Core:       title, slug, content, excerpt
  Metadata:   publishedAt, readingTime, wordCount, status
  References: author, categories
  SEO:        seo.title, seo.description, seo.openGraph, seo.twitter

Environment Variables (for push/status):
  SANITY_PROJECT_ID    Your Sanity project ID
  SANITY_DATASET       Dataset name (default: production)
  SANITY_TOKEN         API token with write access

Examples:
  bun run SanityPublish.ts validate ./sanity-ready-post.md
  bun run SanityPublish.ts preview ./sanity-ready-post.md
  SANITY_PROJECT_ID=xxx SANITY_TOKEN=yyy bun run SanityPublish.ts push ./post.md
`);
      process.exit(command === 'help' ? 0 : 1);
  }
}

main();
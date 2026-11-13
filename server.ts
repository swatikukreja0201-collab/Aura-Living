import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  ATELIER_CHAPTERS,
  FREE_SHIPPING_THRESHOLD,
  PRODUCT_METADATA,
  STANDARD_SHIPPING_FEE,
} from './src/data/catalogMeta';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const VALID_PRODUCT_IDS = new Set(PRODUCT_METADATA.map((p) => p.id));
const VALID_CATEGORIES = new Set([
  'All',
  'Ceramics',
  'Lighting',
  'Textiles',
  'Furniture',
]);

function buildConciergeSystemInstruction(activeCategory?: string): string {
  const catalogContext = PRODUCT_METADATA.map((p) => {
    const finishes = p.finishes.map((f) => f.name).join(', ');
    return `- ID: "${p.id}" | SKU: ${p.sku} | Title: ${p.title} | Category: ${p.category} | Price: $${p.price} USD | Availability: ${p.availability} | Dimensions: ${p.dimensions} | Materials: ${p.materials} | Origin: ${p.origin} | Finishes: ${finishes} | Care: ${p.care} | Summary: ${p.description}`;
  }).join('\n');

  const atelierContext = ATELIER_CHAPTERS.map(
    (c) => `${c.index}. ${c.title}: ${c.summary}`
  ).join('\n');

  return [
    'You are the AURA Living Studio Concierge, an architectural interior and homeware specialist representing AURA Living (studios in Copenhagen, Kyoto, and Zurich).',
    'Your role is to help visitors discover, compare, and select pieces from the AURA Living catalog based on room aesthetic, dimensions, materials, budget, or care requirements.',
    'Tone: Calm, knowledgeable, concise, and editorial. Never use salesy hype or invent products not listed below.',
    `Shipping policy: Complimentary insured courier shipping on orders of $${FREE_SHIPPING_THRESHOLD} USD or more; otherwise $${STANDARD_SHIPPING_FEE} USD standard courier.`,
    activeCategory && activeCategory !== 'All'
      ? `The visitor is currently browsing the "${activeCategory}" category.`
      : 'The visitor is browsing the full AURA Living collection.',
    '',
    'AURA LIVING CATALOG:',
    catalogContext,
    '',
    'ATELIER MATERIAL PROVENANCE:',
    atelierContext,
    '',
    'Response rules:',
    '1. Answer directly and concisely (2-4 sentences typically) referencing exact product titles, materials, dimensions, and prices in USD.',
    '2. Populate `recommendedProductIds` with up to 3 exact product IDs from the catalog above that best match the request (or empty array if none apply). Never invent IDs.',
    '3. Set `suggestedCategory` to one of "All", "Ceramics", "Lighting", "Textiles", "Furniture", or "" if no single category filter is needed.',
  ].join('\n');
}

interface IncomingMessage {
  role: 'user' | 'model';
  text: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/concierge/chat', async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error:
            'GEMINI_API_KEY is not configured. Please add your key in Settings > Secrets.',
        });
      }

      const { messages, activeCategory } = req.body as {
        messages?: IncomingMessage[];
        activeCategory?: string;
      };

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          error: 'Please provide at least one message to start a conversation.',
        });
      }

      const sanitizedHistory = messages
        .filter(
          (m) =>
            m &&
            (m.role === 'user' || m.role === 'model') &&
            typeof m.text === 'string' &&
            m.text.trim().length > 0
        )
        .slice(-20)
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.text.trim().slice(0, 2000) }],
        }));

      if (
        sanitizedHistory.length === 0 ||
        sanitizedHistory[sanitizedHistory.length - 1].role !== 'user'
      ) {
        return res.status(400).json({
          error: 'Conversation must end with a valid user message.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: sanitizedHistory,
        config: {
          systemInstruction: buildConciergeSystemInstruction(activeCategory),
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description:
                  'Concise, helpful editorial guidance answering the user query using AURA Living catalog facts.',
              },
              recommendedProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Up to 3 exact product IDs from the AURA Living catalog that match the user request.',
              },
              suggestedCategory: {
                type: Type.STRING,
                description:
                  'Optional matching category: All, Ceramics, Lighting, Textiles, Furniture, or empty string.',
              },
            },
            required: ['reply', 'recommendedProductIds'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      let parsed: {
        reply?: string;
        recommendedProductIds?: string[];
        suggestedCategory?: string;
      } = {};

      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = {
          reply:
            rawText ||
            'I would be glad to help you explore our stoneware, alabaster lighting, unbleached textiles, and oak furniture.',
          recommendedProductIds: [],
        };
      }

      const validIds = Array.isArray(parsed.recommendedProductIds)
        ? Array.from(
            new Set(
              parsed.recommendedProductIds.filter((id) =>
                VALID_PRODUCT_IDS.has(id)
              )
            )
          ).slice(0, 3)
        : [];

      const suggestedCategory =
        typeof parsed.suggestedCategory === 'string' &&
        VALID_CATEGORIES.has(parsed.suggestedCategory)
          ? parsed.suggestedCategory
          : undefined;

      return res.json({
        reply:
          typeof parsed.reply === 'string' && parsed.reply.trim().length > 0
            ? parsed.reply.trim()
            : 'Here are the pieces from our archive that best suit your space.',
        recommendedProductIds: validIds,
        suggestedCategory,
      });
    } catch (error: unknown) {
      const errObj = error as { status?: number; message?: string };
      const status = typeof errObj?.status === 'number' ? errObj.status : 500;
      const message = errObj?.message ?? 'Unable to reach Studio Concierge.';

      if (
        status === 403 ||
        status === 400 ||
        message.includes('API_KEY_INVALID') ||
        message.includes('PERMISSION_DENIED')
      ) {
        return res.status(status).json({
          error:
            'The Gemini API key appears invalid or missing permissions. Please verify it in Settings > Secrets.',
        });
      }

      if (status === 429 || message.includes('RESOURCE_EXHAUSTED')) {
        return res.status(429).json({
          error:
            'Studio Concierge is currently experiencing high demand. Please try again in a moment.',
        });
      }

      return res.status(500).json({
        error: 'Unable to complete your request right now. Please try again.',
      });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURA Living server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

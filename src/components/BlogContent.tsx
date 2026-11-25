import React from 'react';
import Link from 'next/link';

interface BlogContentProps {
  content: string;
  blogTitle?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Strips YAML/front-matter, metadata headers, and stray tag lines from markdown content.
 */
export function cleanMarkdownContent(content: string): string {
  if (!content) return '';

  let clean = content;

  // 1. Strip YAML front-matter between --- and ---
  clean = clean.replace(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*/, '');

  // 2. Strip codeblock wrapper around entire markdown if pasted as ```markdown ... ```
  clean = clean.replace(/^```(?:markdown|md)?\s*[\r\n]+([\s\S]*?)[\r\n]+```\s*$/, '$1');

  // 3. Remove leading metadata fields (e.g. Tags: ..., Keywords: ..., Title: ..., etc.)
  const lines = clean.split(/\r?\n/);
  while (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (!firstLine) {
      lines.shift();
      continue;
    }
    // Match stray keywords/tags like "Solar street lights, Kerala" or metadata headers
    if (
      /^solar street lights\s*,?\s*kerala$/i.test(firstLine) ||
      /^(?:tags?|keywords?|category|meta\s*title|meta\s*description|author|slug|focus\s*keyphrase):\s*/i.test(firstLine)
    ) {
      lines.shift();
      continue;
    }
    break;
  }

  return lines.join('\n');
}

/**
 * Extracts FAQ questions and answers from article content for JSON-LD FAQPage schema.
 */
export function extractFaqsFromContent(content: string, slug?: string): FaqItem[] {
  const faqs: FaqItem[] = [];

  const isPricePost =
    slug === 'solar-street-light-price-in-kerala-what-affects-cost' ||
    content.toLowerCase().includes('solar street light price in kerala');

  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const headingMatch = trimmed.match(/^#{2,4}\s+(.+\?)\s*$/);
    const boldMatch = trimmed.match(/^\*\*(.+\?)\*\*\s*$/);
    const qText = (headingMatch ? headingMatch[1] : (boldMatch ? boldMatch[1] : null))?.trim();

    if (qText && qText.endsWith('?')) {
      const answerLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      while (
        j < lines.length &&
        lines[j].trim() &&
        !lines[j].trim().startsWith('#') &&
        !lines[j].trim().startsWith('**') &&
        !lines[j].trim().startsWith('|')
      ) {
        answerLines.push(lines[j].trim());
        j++;
      }
      if (answerLines.length > 0) {
        const answerText = answerLines
          .join(' ')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .trim();
        faqs.push({
          question: qText,
          answer: answerText,
        });
      }
    }
  }

  if (isPricePost) {
    const requiredQuestions: FaqItem[] = [
      {
        question: 'Is an all-in-one solar street light cheaper than a split type?',
        answer:
          'Usually yes, because it is quicker to install and has fewer parts. Split type can be worth the cost where there is shade.',
      },
      {
        question: 'Does a solar street light work in the monsoon?',
        answer:
          'Yes, if it is designed for it. Look for extra battery capacity and a stated number of backup days. The 600W-S1 offers about two days of rainy-day backup.',
      },
      {
        question: 'Do I need certification for panchayat work?',
        answer:
          'Government and local-body projects usually require tested, certified products. Ask for IS 15885, IS 16104 and IEC 62384 test documents, and check ANERT empanelment rules for the project.',
      },
    ];

    for (const req of requiredQuestions) {
      if (!faqs.some((f) => f.question.toLowerCase().includes(req.question.toLowerCase().slice(0, 20)))) {
        faqs.push(req);
      }
    }
  }

  return faqs;
}

/**
 * Parses inline markdown: links [text](url), bold **text**, code `text`, and italic *text*.
 */
export function renderInline(text: string): React.ReactNode {
  if (!text) return null;

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  const elements: React.ReactNode[] = [];
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(...renderBasicFormatting(text.slice(lastIndex, match.index)));
    }
    const label = match[1];
    const href = match[2];
    const isInternal = href.startsWith('/') || href.includes('frklighting.com');

    if (isInternal) {
      elements.push(
        <Link
          key={`link-${match.index}`}
          href={href}
          className="text-[#9a6f0c] hover:underline font-semibold"
        >
          {renderBasicFormatting(label)}
        </Link>
      );
    } else {
      elements.push(
        <a
          key={`ext-link-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#9a6f0c] hover:underline font-semibold"
        >
          {renderBasicFormatting(label)}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    elements.push(...renderBasicFormatting(text.slice(lastIndex)));
  }

  return elements.length === 1 ? elements[0] : <React.Fragment key={text}>{elements}</React.Fragment>;
}

function renderBasicFormatting(text: string): React.ReactNode[] {
  const formattingRegex = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
  const parts = text.split(formattingRegex);
  return parts
    .map((part, i) => {
      if (!part) return null;
      if (
        (part.startsWith('**') && part.endsWith('**')) ||
        (part.startsWith('__') && part.endsWith('__'))
      ) {
        return (
          <strong key={i} className="font-semibold text-[#1f2220]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="bg-[#f6f4ee] px-1.5 py-0.5 rounded text-xs font-mono text-[#9a6f0c] border border-[#e4e2da]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (
        (part.startsWith('*') && part.endsWith('*')) ||
        (part.startsWith('_') && part.endsWith('_'))
      ) {
        return (
          <em key={i} className="italic text-[#1f2220]">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    })
    .filter(Boolean);
}

/**
 * Main BlogContent component that renders full GFM markdown.
 */
export default function BlogContent({ content, blogTitle }: BlogContentProps) {
  const clean = cleanMarkdownContent(content);
  const lines = clean.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Code Block: ```
    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <pre
          key={`code-${blocks.length}`}
          className="bg-[#1f2220] text-[#f6f4ee] p-4 rounded-lg overflow-x-auto my-5 text-sm font-mono border border-[#303430]"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // 2. Headings: #, ##, ###, ####
    if (trimmed.startsWith('#### ')) {
      blocks.push(
        <h4 key={`h4-${blocks.length}`} className="text-lg font-bold font-serif text-[#1f2220] pt-4 pb-1 mt-6 mb-2">
          {renderInline(trimmed.slice(5))}
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="text-xl sm:text-2xl font-bold font-serif text-[#1f2220] pt-5 pb-1 mt-7 mb-3">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="text-2xl sm:text-3xl font-bold font-serif text-[#1f2220] pt-8 pb-2 border-b border-[#e4e2da] mt-10 mb-4">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      blocks.push(
        <h2 key={`h1-${blocks.length}`} className="text-2xl sm:text-3xl font-bold font-serif text-[#1f2220] pt-8 pb-2 border-b border-[#e4e2da] mt-10 mb-4">
          {renderInline(trimmed.slice(2))}
        </h2>
      );
      i++;
      continue;
    }

    // 3. Tables (GFM Tables): lines starting and ending with |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRaw = tableLines[0];
        const sepRaw = tableLines[1];
        const bodyRowsRaw = tableLines.slice(2);

        const isSeparator = /^\|?[\s\-:|]+\|?$/.test(sepRaw);
        if (isSeparator) {
          const headers = headerRaw
            .split('|')
            .map((c) => c.trim())
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          const sepCols = sepRaw
            .split('|')
            .map((c) => c.trim())
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

          const alignments = sepCols.map((col) => {
            const hasLeft = col.startsWith(':');
            const hasRight = col.endsWith(':');
            if (hasLeft && hasRight) return 'text-center';
            if (hasRight) return 'text-right';
            return 'text-left';
          });

          const bodyRows = bodyRowsRaw.map((r) =>
            r
              .split('|')
              .map((c) => c.trim())
              .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
          );

          blocks.push(
            <div
              key={`table-${blocks.length}`}
              className="overflow-x-auto my-6 rounded-lg border border-[#e4e2da] bg-white shadow-xs"
            >
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-[#f6f4ee] border-b border-[#e4e2da] text-[#1f2220] font-serif font-bold">
                  <tr>
                    {headers.map((h, colIdx) => (
                      <th
                        key={colIdx}
                        className={`py-3 px-4 font-bold border-r border-[#e4e2da] last:border-r-0 ${
                          alignments[colIdx] || 'text-left'
                        }`}
                      >
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e2da]">
                  {bodyRows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="hover:bg-[#fcfbf9] transition-colors odd:bg-white even:bg-[#faf9f5]"
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className={`py-3 px-4 text-[#5b605b] border-r border-[#e4e2da] last:border-r-0 ${
                            alignments[cellIdx] || 'text-left'
                          }`}
                        >
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }
    }

    // 4. Blockquotes: >
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="border-l-4 border-[#9a6f0c] pl-4 py-2 italic text-[#5b605b] my-5 bg-[#f6f4ee]/70 rounded-r-md text-base leading-relaxed"
        >
          {renderInline(quoteLines.join(' '))}
        </blockquote>
      );
      continue;
    }

    // 5. Unordered List: * or -
    if (/^(\*|-)\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^(\*|-)\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^(\*|-)\s+/, ''));
        i++;
      }
      blocks.push(
        <ul
          key={`ul-${blocks.length}`}
          className="list-disc pl-6 space-y-2 my-4 text-[#5b605b] text-base leading-relaxed"
        >
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // 6. Ordered List: 1. 2.
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push(
        <ol
          key={`ol-${blocks.length}`}
          className="list-decimal pl-6 space-y-2 my-4 text-[#5b605b] text-base leading-relaxed"
        >
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // 7. Standalone Image: ![alt](url)
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const rawAlt = imgMatch[1];
      const src = imgMatch[2];
      const altText =
        rawAlt && !rawAlt.includes('WhatsApp_Image')
          ? rawAlt
          : blogTitle
          ? `${blogTitle} - Solar Street Light`
          : 'FRK Lighting Solutions Solar Light';
      blocks.push(
        <div
          key={`img-${blocks.length}`}
          className="relative rounded-lg overflow-hidden my-6 border border-[#e4e2da] bg-[#f6f4ee]"
        >
          <img
            src={src}
            alt={altText}
            className="w-full h-auto object-cover max-h-[500px]"
            loading="lazy"
          />
          {rawAlt && !rawAlt.includes('WhatsApp_Image') && (
            <p className="text-xs text-center py-2 text-[#5b605b] bg-[#f6f4ee] border-t border-[#e4e2da]">
              {rawAlt}
            </p>
          )}
        </div>
      );
      i++;
      continue;
    }

    // 8. Regular Paragraph
    const paragraphLines: string[] = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('```') &&
      !/^(\*|-)\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('![')
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }

    blocks.push(
      <p key={`p-${blocks.length}`} className="text-[#5b605b] text-base leading-relaxed my-4">
        {renderInline(paragraphLines.join(' '))}
      </p>
    );
  }

  return (
    <div className="prose max-w-none text-[#1f2220] text-base leading-relaxed">
      {blocks}
    </div>
  );
}


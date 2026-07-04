/**
 * Minimal markdown-to-HTML renderer for the Handbook.
 *
 * Architectural decision: we use a lightweight custom renderer rather than
 * pulling in a heavy dependency (remark/rehype/unified ecosystem). The handbook
 * markdown is well-structured and predictable — it uses headings, paragraphs,
 * lists, tables, blockquotes, and inline formatting. This covers all of those
 * without adding dependencies that may change over 20 years.
 *
 * If the handbook content grows in complexity (e.g. embedded diagrams, math),
 * this can be replaced with a full markdown processor at that point.
 */

export function renderMarkdown(source: string): string {
  const lines = source.split("\n");
  const html: string[] = [];
  let inList = false;
  let inOrderedList = false;
  let inTable = false;
  let inBlockquote = false;
  let tableRows: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Blockquote
    if (line.startsWith("> ")) {
      if (!inBlockquote) {
        html.push('<blockquote class="handbook-blockquote">');
        inBlockquote = true;
      }
      html.push(`<p>${formatInline(line.slice(2))}</p>`);
      continue;
    } else if (inBlockquote) {
      html.push("</blockquote>");
      inBlockquote = false;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      closeList();
      html.push('<hr class="handbook-hr" />');
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const text = formatInline(headingMatch[2]);
      html.push(`<h${level} class="handbook-h${level}">${text}</h${level}>`);
      continue;
    }

    // Table
    if (line.includes("|") && line.trim().startsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
      continue;
    } else if (inTable) {
      html.push(renderTable(tableRows));
      inTable = false;
      tableRows = [];
    }

    // Unordered list
    if (/^[-*]\s/.test(line.trim()) || /^\[.\]\s/.test(line.trim()) || /^- \[.\]\s/.test(line.trim())) {
      if (!inList) {
        html.push('<ul class="handbook-list">');
        inList = true;
      }
      const content = line.replace(/^\s*[-*]\s*(\[.\]\s*)?/, "");
      const isChecklist = /\[.\]/.test(line);
      const isChecked = /\[x\]/i.test(line);
      if (isChecklist) {
        const checkbox = isChecked
          ? '<span class="handbook-check checked">&#9745;</span>'
          : '<span class="handbook-check">&#9744;</span>';
        html.push(`<li>${checkbox} ${formatInline(content)}</li>`);
      } else {
        html.push(`<li>${formatInline(content)}</li>`);
      }
      continue;
    } else if (inList) {
      html.push("</ul>");
      inList = false;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      if (!inOrderedList) {
        html.push('<ol class="handbook-list handbook-ol">');
        inOrderedList = true;
      }
      const content = line.replace(/^\s*\d+\.\s*/, "");
      html.push(`<li>${formatInline(content)}</li>`);
      continue;
    } else if (inOrderedList) {
      html.push("</ol>");
      inOrderedList = false;
    }

    // Empty line
    if (line.trim() === "") {
      continue;
    }

    // Paragraph
    html.push(`<p class="handbook-p">${formatInline(line)}</p>`);
  }

  // Close any open elements
  if (inList) html.push("</ul>");
  if (inOrderedList) html.push("</ol>");
  if (inBlockquote) html.push("</blockquote>");
  if (inTable) html.push(renderTable(tableRows));

  return html.join("\n");

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    if (inOrderedList) {
      html.push("</ol>");
      inOrderedList = false;
    }
  }
}

function renderTable(rows: string[]): string {
  if (rows.length < 2) return "";

  const parseRow = (row: string) =>
    row.split("|").slice(1, -1).map((cell) => cell.trim());

  const headers = parseRow(rows[0]);
  const isSeparator = (row: string) => /^\|[\s\-:|]+\|$/.test(row.trim());

  const dataRows = rows.filter((_, i) => i !== 0 && !isSeparator(rows[i]));

  let html = '<div class="handbook-table-wrap"><table class="handbook-table"><thead><tr>';
  for (const h of headers) {
    html += `<th>${formatInline(h)}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (const row of dataRows) {
    const cells = parseRow(row);
    html += "<tr>";
    for (const cell of cells) {
      html += `<td>${formatInline(cell)}</td>`;
    }
    html += "</tr>";
  }
  html += "</tbody></table></div>";
  return html;
}

function formatInline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="handbook-code">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
      const sanitizedHref = isSafeUrl(href) ? href : "#";
      return `<a href="${sanitizedHref}" class="handbook-link">${label}</a>`;
    });
}

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:") || trimmed.startsWith("vbscript:")) {
    return false;
  }
  return true;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

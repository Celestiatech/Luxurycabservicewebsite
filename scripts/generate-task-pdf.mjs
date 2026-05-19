import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

function escapeHtml(input) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTable(lines) {
  const rows = lines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^\|/, "").replace(/\|$/, ""))
    .map((l) => l.split("|").map((c) => c.trim()));

  if (rows.length < 2) return "";
  const header = rows[0];
  const body = rows.slice(2); // skip separator row

  const thead = `<thead><tr>${header
    .map((h) => `<th>${escapeHtml(h)}</th>`)
    .join("")}</tr></thead>`;

  const tbody = `<tbody>${body
    .map(
      (r) =>
        `<tr>${r
          .map((c) => `<td>${escapeHtml(c)}</td>`)
          .join("")}</tr>`,
    )
    .join("")}</tbody>`;

  return `<div class="table-wrap"><table>${thead}${tbody}</table></div>`;
}

function markdownToHtml(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const out = [];
  let i = 0;
  let inList = false;

  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  const flushParagraph = (buffer) => {
    const text = buffer.join(" ").trim();
    if (!text) return;
    out.push(`<p>${escapeHtml(text)}</p>`);
  };

  let paragraph = [];

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();
    const trimmed = line.trim();

    // Tables
    if (trimmed.startsWith("|")) {
      closeList();
      flushParagraph(paragraph);
      paragraph = [];

      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i += 1;
      }
      out.push(renderTable(tableLines));
      continue;
    }

    // Headings
    const headingMatch = /^(\#{1,6})\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      closeList();
      flushParagraph(paragraph);
      paragraph = [];

      const level = headingMatch[1].length;
      const content = headingMatch[2].trim();
      const cls =
        level === 1
          ? "h1"
          : level === 2
            ? "h2"
            : level === 3
              ? "h3"
              : "h4";
      out.push(`<h${level} class="${cls}">${escapeHtml(content)}</h${level}>`);
      i += 1;
      continue;
    }

    // Horizontal rule
    if (trimmed === "---") {
      closeList();
      flushParagraph(paragraph);
      paragraph = [];
      out.push('<hr class="sep" />');
      i += 1;
      continue;
    }

    // Lists
    if (trimmed.startsWith("* ")) {
      flushParagraph(paragraph);
      paragraph = [];

      if (!inList) {
        out.push('<ul class="ul">');
        inList = true;
      }
      const item = trimmed.slice(2).trim();
      out.push(`<li>${escapeHtml(item)}</li>`);
      i += 1;
      continue;
    }

    // Blank line
    if (!trimmed) {
      closeList();
      flushParagraph(paragraph);
      paragraph = [];
      i += 1;
      continue;
    }

    // Emphasis: **text**
    // Keep it minimal: only bold, no nested parsing.
    const withBold = escapeHtml(trimmed).replaceAll(
      /\*\*([^*]+)\*\*/g,
      "<strong>$1</strong>",
    );
    paragraph.push(withBold);
    i += 1;
  }

  closeList();
  flushParagraph(paragraph);

  return out.join("\n");
}

function buildHtml({ bodyHtml, title, subtitle }) {
  const now = new Date();
  const date = new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(now);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { size: A4; margin: 18mm 16mm; }
      :root{
        --ink:#0b1220;
        --muted:#516079;
        --line:#e5e7eb;
        --card:#ffffff;
        --bg:#f6f8fc;
        --brand1:#3b82f6;
        --brand2:#7c3aed;
        --good:#16a34a;
        --warn:#f59e0b;
      }
      *{ box-sizing:border-box; }
      html,body{ padding:0; margin:0; }
      body{
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Helvetica Neue", sans-serif;
        color:var(--ink);
        background:var(--bg);
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page{
        background: linear-gradient(180deg, rgba(59,130,246,0.10), rgba(124,58,237,0.06) 40%, rgba(246,248,252,1) 80%);
        padding: 0;
      }
      .header{
        padding: 18px 18px 14px;
        border: 1px solid var(--line);
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(59,130,246,0.14), rgba(124,58,237,0.12));
      }
      .brand{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap: 12px;
      }
      .badge{
        display:inline-flex;
        align-items:center;
        gap:8px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255,255,255,0.75);
        border: 1px solid rgba(255,255,255,0.65);
        font-size: 12px;
        color: var(--muted);
      }
      .title{
        margin: 8px 0 0;
        font-size: 22px;
        line-height: 1.15;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
      .subtitle{
        margin: 6px 0 0;
        font-size: 13px;
        color: var(--muted);
      }
      .content{
        margin-top: 14px;
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 18px;
      }
      .h1{ margin: 0 0 10px; }
      .h2{ margin: 18px 0 10px; font-size: 16px; }
      .h3{ margin: 14px 0 8px; font-size: 14px; color: #0f172a; }
      .h4{ margin: 12px 0 8px; font-size: 13px; color: #111827; }
      p{ margin: 8px 0; color: #0f172a; font-size: 12.5px; line-height: 1.55; }
      .ul{ margin: 8px 0 10px 18px; padding: 0; }
      li{ margin: 6px 0; color: #0f172a; font-size: 12.5px; line-height: 1.45; }
      strong{ font-weight: 800; }
      .sep{
        border: none;
        height: 1px;
        background: linear-gradient(90deg, rgba(59,130,246,0.0), rgba(59,130,246,0.5), rgba(124,58,237,0.45), rgba(124,58,237,0.0));
        margin: 14px 0;
      }
      .table-wrap{
        margin: 10px 0 12px;
        border: 1px solid var(--line);
        border-radius: 12px;
        overflow: hidden;
      }
      table{ width:100%; border-collapse: collapse; }
      th{
        text-align: left;
        padding: 10px 12px;
        font-size: 12px;
        color: #0b1220;
        background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.10));
        border-bottom: 1px solid var(--line);
      }
      td{
        padding: 9px 12px;
        font-size: 12px;
        border-bottom: 1px solid var(--line);
      }
      tbody tr:nth-child(even) td{ background: rgba(246,248,252,0.75); }
      tbody tr:last-child td{ border-bottom:none; }
      .callout{
        margin: 12px 0;
        padding: 12px 12px;
        border-radius: 12px;
        border: 1px solid rgba(22,163,74,0.25);
        background: rgba(22,163,74,0.08);
      }
      .callout h3{ margin:0 0 6px; font-size: 13px; }
      .callout p{ margin: 0; color: #0b1220; }
      .footer{
        margin-top: 12px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap: 12px;
        color: var(--muted);
        font-size: 11px;
      }
      .pill{
        display:inline-block;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(59,130,246,0.10);
        border: 1px solid rgba(59,130,246,0.18);
        color: #1d4ed8;
        font-weight: 700;
      }
      /* Keep headings with their following content */
      h1,h2,h3,h4{ break-after: avoid; }
      .table-wrap{ break-inside: avoid; }
      ul{ break-inside: avoid; }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div class="brand">
          <div class="badge">
            <span class="pill">Task</span>
            <span>${escapeHtml(date)}</span>
          </div>
          <div class="badge">Luxury Cab Service – Internal</div>
        </div>
        <div class="title">${escapeHtml(title)}</div>
        <div class="subtitle">${escapeHtml(subtitle)}</div>
      </div>
      <div class="content">
        <div class="callout">
          <h3>Instant Offer</h3>
          <p><strong>Instant 10% OFF on Prepay</strong> (plus returning-user discount where applicable)</p>
        </div>
        ${bodyHtml}
        <div class="footer">
          <div>Generated from <strong>task/task.txt</strong></div>
          <div>PDF render via <strong>Google Chrome</strong></div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function main() {
  const repoRoot = process.cwd();
  const inputPath = path.join(repoRoot, "task", "task.txt");
  const outHtmlPath = path.join(repoRoot, "task", "task-colored.html");
  const outPdfPath = path.join(repoRoot, "task", "task-colored.pdf");

  if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`);
    process.exitCode = 1;
    return;
  }

  const md = fs.readFileSync(inputPath, "utf8");
  const bodyHtml = markdownToHtml(md);
  const html = buildHtml({
    bodyHtml,
    title: "Taxi Booking Website – Task Document",
    subtitle: "Ride categories, pricing tables, passenger options, and offer notes",
  });

  fs.writeFileSync(outHtmlPath, html, "utf8");

  const chrome = process.env.CHROME_BIN || "google-chrome";
  const url = pathToFileURL(outHtmlPath).toString();

  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      `--print-to-pdf=${outPdfPath}`,
      "--print-to-pdf-no-header",
      "--virtual-time-budget=10000",
      url,
    ],
    { stdio: "inherit" },
  );

  // eslint-disable-next-line no-console
  console.log(`\nCreated:\n- ${outHtmlPath}\n- ${outPdfPath}\n`);
}

main();


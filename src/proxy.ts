import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Password gate for Fulfen Primary School while the site is in client review.
 *
 * Renders a branded, password-only login page and stores a signed session
 * cookie. The cookie has no expiry, so the session ends when the browser
 * closes. The password comes from the SITE_AUTH_PASSWORD env var (set in
 * Vercel); the cookie value is an HMAC of it, so it cannot be forged and
 * changing the password invalidates every existing session.
 *
 * robots.txt and the logo stay public: robots.txt so crawlers can still read
 * Disallow: /, and the logo because the login page displays it anyway.
 *
 * TODO(go-live): delete this file when the site goes public.
 */

const COOKIE_NAME = "site_preview_auth";
const AUTH_PATH = "/__auth";
const TOKEN_MESSAGE = "site-preview-auth-v1";

const BRAND = {
  name: "Fulfen Primary School",
  logo: "/fulfen/logo.png",
  primary: "#0407a5",
  accent: "#f9d504",
  tint: "#eef0fb",
  ink: "#242a57",
  fontStack: '\'Outfit\', system-ui, -apple-system, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif',
};

export async function proxy(request: NextRequest) {
  const password = process.env.SITE_AUTH_PASSWORD;

  // Fail closed: never serve the site unprotected because the var is missing.
  if (!password) {
    return new NextResponse("Password protection is not configured.", {
      status: 503,
      headers: baseHeaders("text/plain; charset=utf-8"),
    });
  }

  const expected = await signToken(password);

  if (request.method === "POST" && request.nextUrl.pathname === AUTH_PATH) {
    const form = await request.formData();
    const supplied = String(form.get("password") ?? "");
    const next = safeNext(String(form.get("next") ?? "/"));

    if (!timingSafeEqual(supplied, password)) {
      return loginPage(next, true);
    }

    const response = NextResponse.redirect(new URL(next, request.url), 303);
    response.cookies.set(COOKIE_NAME, expected, {
      httpOnly: true,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      path: "/",
      // No maxAge/expires: a session cookie, so it dies when the browser closes.
    });
    return response;
  }

  if (timingSafeEqual(request.cookies.get(COOKIE_NAME)?.value ?? "", expected)) {
    return NextResponse.next();
  }

  return loginPage(safeNext(request.nextUrl.pathname + request.nextUrl.search), false);
}

/** HMAC-SHA256 of a fixed message, keyed by the password. */
async function signToken(password: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(TOKEN_MESSAGE));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Comparison that does not short-circuit, so a guess leaks no timing signal. */
function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Only allow same-origin paths, so the form cannot become an open redirect. */
function safeNext(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith(AUTH_PATH)) return "/";
  return value;
}

function baseHeaders(contentType: string) {
  return {
    "Content-Type": contentType,
    "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
    "Cache-Control": "no-store",
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loginPage(next: string, failed: boolean) {
  return new NextResponse(renderLogin(next, failed), {
    status: 401,
    headers: baseHeaders("text/html; charset=utf-8"),
  });
}

function renderLogin(next: string, failed: boolean) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<meta name="color-scheme" content="light" />
<title>${escapeHtml(BRAND.name)} — Private preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100svh;
    display: grid;
    place-items: center;
    padding: 24px;
    font-family: ${BRAND.fontStack};
    color: ${BRAND.ink};
    background:
      radial-gradient(1100px 620px at 50% -10%, ${BRAND.tint} 0%, #ffffff 70%),
      ${BRAND.tint};
  }
  .shell { width: min(410px, 100%); }
  .card {
    position: relative;
    background: #ffffff;
    border: 1px solid color-mix(in srgb, ${BRAND.ink} 8%, transparent);
    border-radius: 24px;
    padding: 42px 36px 36px;
    text-align: center;
    overflow: hidden;
    box-shadow:
      0 1px 2px color-mix(in srgb, ${BRAND.ink} 6%, transparent),
      0 24px 60px -12px color-mix(in srgb, ${BRAND.ink} 22%, transparent);
  }
  .card::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 4px;
    background: linear-gradient(90deg, ${BRAND.primary}, ${BRAND.accent});
  }
  .logo { max-height: 54px; max-width: 210px; width: auto; object-fit: contain; }
  h1 {
    margin: 26px 0 0;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .sub {
    margin: 9px 0 26px;
    font-size: 14.5px;
    line-height: 1.5;
    color: color-mix(in srgb, ${BRAND.ink} 62%, transparent);
  }
  .field { position: relative; }
  input {
    width: 100%;
    padding: 14px 48px 14px 16px;
    font: inherit;
    font-size: 15px;
    color: ${BRAND.ink};
    background: #fff;
    border: 1.5px solid color-mix(in srgb, ${BRAND.ink} 15%, transparent);
    border-radius: 12px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  input::placeholder { color: color-mix(in srgb, ${BRAND.ink} 38%, transparent); }
  input:focus {
    border-color: ${BRAND.primary};
    box-shadow: 0 0 0 4px color-mix(in srgb, ${BRAND.primary} 14%, transparent);
  }
  .toggle {
    position: absolute;
    top: 50%;
    right: 7px;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: color-mix(in srgb, ${BRAND.ink} 55%, transparent);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .toggle:hover {
    background: color-mix(in srgb, ${BRAND.ink} 6%, transparent);
    color: ${BRAND.primary};
  }
  .toggle svg { width: 19px; height: 19px; display: block; }
  .submit {
    width: 100%;
    margin-top: 14px;
    padding: 14px 16px;
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    background: ${BRAND.primary};
    border: 0;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.12s ease, filter 0.15s ease;
    box-shadow: 0 6px 18px -6px color-mix(in srgb, ${BRAND.primary} 60%, transparent);
  }
  .submit:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .submit:active { transform: translateY(0); filter: brightness(0.97); }
  .error {
    margin: 12px 0 0;
    font-size: 13.5px;
    font-weight: 500;
    color: #c0392b;
  }
  .foot {
    margin: 20px 0 0;
    text-align: center;
    font-size: 12.5px;
    letter-spacing: 0.02em;
    color: color-mix(in srgb, ${BRAND.ink} 45%, transparent);
  }
  @media (max-width: 420px) {
    .card { padding: 34px 24px 28px; border-radius: 20px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .submit, input, .toggle { transition: none; }
    .submit:hover { transform: none; }
  }
</style>
</head>
<body>
  <div class="shell">
    <main class="card">
      <img class="logo" src="${BRAND.logo}" alt="${escapeHtml(BRAND.name)}" />
      <h1>This site is private</h1>
      <p class="sub">Enter the password to preview ${escapeHtml(BRAND.name)}.</p>
      <form method="post" action="${AUTH_PATH}">
        <input type="hidden" name="next" value="${escapeHtml(next)}" />
        <div class="field">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            aria-label="Password"
            autofocus
            required
          />
          <button class="toggle" id="toggle" type="button" aria-label="Show password"></button>
        </div>
        ${failed ? '<p class="error" role="alert">Incorrect password. Please try again.</p>' : ""}
        <button class="submit" type="submit">Enter site</button>
      </form>
    </main>
    <p class="foot">${escapeHtml(BRAND.name)}</p>
  </div>
<script>
  (function () {
    var EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
    var EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6.4 0 10 7 10 7a17 17 0 0 1-3 3.8M6.2 6.2A17 17 0 0 0 2 13s3.6 7 10 7a9.6 9.6 0 0 0 4.2-.9"/><path d="m2 2 20 20"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
    var input = document.getElementById("password");
    var toggle = document.getElementById("toggle");
    if (!input || !toggle) return;
    toggle.innerHTML = EYE;
    toggle.addEventListener("click", function () {
      var reveal = input.type === "password";
      input.type = reveal ? "text" : "password";
      toggle.innerHTML = reveal ? EYE_OFF : EYE;
      toggle.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
      input.focus();
    });
  })();
</script>
</body>
</html>`;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|fulfen/logo.png).*)"],
};

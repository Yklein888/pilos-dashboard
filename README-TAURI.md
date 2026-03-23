# PILOS Dashboard — Tauri Desktop App

This project uses [Tauri v2](https://tauri.app/) to wrap the Next.js dashboard into a
lightweight native desktop application. Tauri uses the OS WebView (WebKit on
macOS/Linux, WebView2 on Windows) instead of bundling Chromium like Electron,
which makes the binary **much smaller and faster**.

## Architecture

```
┌─────────────────────────────────────────┐
│  Tauri native shell (Rust)              │
│  • Creates native window                │
│  • Starts Next.js standalone server     │
│    (.next/standalone/server.js)         │
│  • Loads http://localhost:3000          │
└─────────────────────────────────────────┘
          ↑ WebView (OS native)
┌─────────────────────────────────────────┐
│  Next.js App (TypeScript / React)       │
│  • Full API routes work (MCP, projects) │
│  • All dashboard tabs & features        │
└─────────────────────────────────────────┘
```

## Prerequisites

| Tool | Min version | Install |
|------|-------------|---------|
| Node.js | 18+ | https://nodejs.org |
| Rust | 1.77+ | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| **Linux only** | — | See below |

### Linux system dependencies

```bash
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libssl-dev \
  build-essential
```

### macOS

Xcode Command Line Tools are required:

```bash
xcode-select --install
```

### Windows

Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
(usually already present on Windows 11+) and [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

## Development

```bash
npm install
npm run tauri:dev
```

This command:
1. Runs `next dev` (Next.js dev server on `http://localhost:3000`)
2. Opens a native Tauri window pointing to that server
3. Hot-reload works — edit any file and the window refreshes

## Production Build

```bash
npm run tauri:build
```

This command:
1. Runs `next build` → creates `.next/standalone/server.js` (self-contained server)
2. Copies `.next/static` assets into the standalone bundle
3. Compiles the Rust shell with `tauri build`

The distributable is placed in `src-tauri/target/release/bundle/`.

### How the production binary works

When the user double-clicks the app:
1. The Rust shell starts `node .next/standalone/server.js` in the background
2. Waits 2 seconds for the server to bind on `localhost:3000`
3. Opens the native WebView pointed at `http://localhost:3000`
4. When the window is closed, the Node.js process is cleaned up by the OS

> **Note:** The target machine must have Node.js installed.  
> For a fully self-contained binary (no Node.js required), embed the standalone
> output inside the Tauri binary using the
> [tauri-plugin-process](https://tauri.app/plugin/process/) or bundle
> [Bun](https://bun.sh/) as a sidecar.

## Replacing the placeholder icons

The icons in `src-tauri/icons/` are 1×1 solid-blue placeholders.
Replace them with your real artwork before distributing:

```bash
# Install ImageMagick, then:
npm run tauri:icon -- path/to/your/icon.png
# This auto-generates all required sizes and formats.
```

## Project structure

```
pilos-dashboard/
├── app/                  Next.js App Router pages & API routes
├── components/           React UI components
│   ├── analytics/        Usage stats & cost charts (recharts)
│   ├── agents/           Agent creator dialog
│   ├── chat/             Chat interface
│   ├── dashboard/        Header, panels, terminal
│   ├── data-sources/     Data source browser & creator
│   ├── mcp/              MCP server catalog browser
│   └── ui/               Shared UI (tabs, loading, ...)
├── lib/
│   ├── mcp-catalog.ts    25+ MCP servers catalog
│   └── server/           Server-side MCP helpers
├── src-tauri/            Tauri / Rust project
│   ├── src/
│   │   ├── main.rs       Binary entry point
│   │   └── lib.rs        App setup & Next.js server lifecycle
│   ├── capabilities/     Tauri permission system
│   ├── icons/            App icons (replace with real artwork)
│   ├── Cargo.toml        Rust dependencies
│   └── tauri.conf.json   Tauri configuration
└── next.config.js        Next.js config (output: standalone)
```

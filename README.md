# Titan Chess FREE by NVModz

Open-source chess analysis extension for [chess.com](https://chess.com).
Powered by Stockfish WASM — runs entirely in your browser, no server needed.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Manifest V3](https://img.shields.io/badge/manifest-v3-green)
![Engine](https://img.shields.io/badge/engine-Stockfish%20WASM-orange)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Overview

Titan Chess FREE is a browser extension that overlays move suggestions on chess.com games using a local Stockfish engine. Everything runs client-side — no accounts, no servers, no data collection.

### Key Features

- **Local Stockfish Engine** — Runs Stockfish via WebAssembly in a Blob Worker, fully offline
- **14 ELO Levels** — Bronze (1000) through Stockfish (3000) with calibrated skill/depth settings
- **Combat Mode** — Higher depth and skill for each ELO level when you need an edge
- **Queue Mode** — Pre-analyzes during opponent's turn for faster suggestions
- **Arrow & Highlight Modes** — Visual move suggestions via DOM injection (works on desktop and mobile)
- **5 Themes** — Dark, Light, Purple, Green, Orange
- **Draggable Widget** — Floating dashboard with tabbed interface
- **Settings Persistence** — All preferences saved via `chrome.storage`
- **Hash Table Caching** — 16MB/32MB transposition table for faster repeated analysis
- **Smart Time Management** — High ELO levels use movetime caps to balance quality and speed
- **Castling Tracking** — Detects when king/rook have moved to generate accurate FEN castling rights
- **Mobile Compatible** — Works on mobile browsers that support extensions (e.g. Lemur Browser)

## Installation

### Chrome / Edge / Brave / Lemur (Android)

1. Download or clone this repository
2. Open `chrome://extensions` (or `edge://extensions`)
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the project folder
6. Navigate to [chess.com](https://chess.com) and start a game

## Project Structure

# GRPSM - Graphical PostgreSQL Manager

### A lightweight, fast, and secure desktop GUI client for PostgreSQL databases.

[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Tauri v2](https://img.shields.io/badge/Tauri_v2-24C8D8?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

<br />

[![Download Windows Installer](https://img.shields.io/badge/Download_Installer-.msi-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/gemushka-dev/grpsm/releases/download/v1.0.0/GRPSM1.0.0.x64.msi)

---

## Preview

<div align="center">
  <img src="docs/images/grpsm-screen.PNG" alt="GRPSM App Preview" width="900px" />
</div>

---

## Features

- Blazing Fast & Lightweight: Unlike heavy Electron-based tools, GRPSM weighs `~15 MB` and consumes minimal RAM.
- Secure by Design: Credentials and connection strings are managed entirely within compiled Rust code, keeping your data safe.
- Dynamic Table Rendering: Automatically generates clean HTML tables for any custom `SELECT` query results.
- Persistent Connection Pool: Powered by Rust's async runtime, keeping database connections alive without needing to reconnect on every query.

---

## Tech Stack

- Rust
- Tauri
- React-ts
- PostgreSQL

## Getting Started (Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust Toolchain](https://www.rust-lang.org/tools/install) (Stable)

### Installation & Run

1. Clone the repository:
   ```bash
   git clone
   cd grpsm
   ```

# 🗄️ GRPSM — Graphical PostgreSQL Manager

A lightweight, fast, and secure desktop GUI client for PostgreSQL databases built with **Tauri 2.0**, **Rust**, and **React-TS**.

![Rust](https://img.shields.io/badge/backend-Rust-orange?style=flat&logo=rust)
![Tauri](https://img.shields.io/badge/GUI-Tauri_v2-blue?style=flat&logo=tauri)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-336791?style=flat&logo=postgresql)

---

## Features

- **Blazing Fast & Lightweight:** Unlike heavy Electron-based tools, GRPSM weighs ~15 MB and consumes minimal RAM.
- **Secure by Design:** Credentials and connection strings are managed entirely within compiled Rust code, keeping your data safe.
- **Dynamic Table Rendering:** Automatically generates clean HTML tables for any custom `SELECT` query results.
- **Persistent Connection Pool:** Powered by Rust's async runtime, keeping database connections alive without needing to reconnect on every query.

---

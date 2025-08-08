# Feed CLI Tool

A command-line tool for managing feeds, following users, and browsing content.  
This tool supports user authentication, feed aggregation, and subscription management.

---

## 📦 Requirements

Before running this CLI, make sure you have:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** for dependency management
- An internet connection (for fetching feeds or interacting with remote APIs)
- A valid **configuration file** (see below)

---

## ⚙️ Configuration

The CLI expects a configuration file to store things like your API endpoint and authentication details.

1. Create a file called `.feedcli.config.json` in your home directory or project folder.
2. Example configuration:

```json
{
  "apiUrl": "https://example.com/api",
  "token": null
}


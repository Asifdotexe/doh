# D'oh
Spark an argument. Realize you’re wrong. Say the word.

![D'oh](src/assets/doh.gif)

## Adding questions

You can bulk-import new questions from a CSV file. The ingestion script uses `uv` and `pyproject.toml` for dependency management.

Read [docs/SCHEMA.md](docs/SCHEMA.md) to see the required CSV columns and valid options.

### Setup

1. Install `uv` if you don't have it (`curl -LsSf https://astral.sh/uv/install.sh | sh` on macOS/Linux, or `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"` on Windows).
2. Sync the project dependencies. This step will automatically download the required Python version and set up a virtual environment for you:

   ```bash
   uv sync
   ```

### Ingestion

Save your questions in a comma-separated text file (or `.csv`), then run:

```bash
uv run scripts/ingest_questions.py --file new_questions.txt
```

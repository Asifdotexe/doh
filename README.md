# D'oh
Spark an argument. Realize you’re wrong. Say the word.

![D'oh](src/assets/doh.gif)

## Adding questions

Read [docs/SCHEMA.md](docs/SCHEMA.md) to see the required CSV columns and valid options.

### Option 1: Ingestion via GitHub Issues (Automated)

You can submit questions directly through GitHub Issues without running any scripts locally:

1. Go to the **Issues** tab and click **New issue**.
2. Paste your comma-separated values (CSV) into the issue description box. Ensure it includes the header row: `topic,category,mode`.
3. Apply the **`submit-questions`** label to the issue.
4. GitHub Actions will automatically parse the CSV, run the ingestion script, and open a new Pull Request with the updated `questions.json` file for review!

### Option 2: Ingestion via CLI (Local)

You can also bulk-import new questions from a CSV file locally. The ingestion script uses `uv` and `pyproject.toml` for dependency management.

#### Setup

1. Install `uv` if you don't have it (`curl -LsSf https://astral.sh/uv/install.sh | sh` on macOS/Linux, or `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"` on Windows).
2. Sync the project dependencies. This step will automatically download the required Python version and set up a virtual environment for you:

   ```bash
   uv sync
   ```

#### Run Ingestion

Save your questions in a comma-separated text file (or `.csv`), then run:

```bash
uv run yoink_questions --file new_questions.txt
```

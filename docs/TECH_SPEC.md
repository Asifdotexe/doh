# Technical Specification

## 1. Tech Stack
- **Build Tool:** Vite (for fast HMR, optimized builds, and zero-config module bundling).
- **Core Languages:** Vanilla HTML, CSS, JavaScript (no framework overhead to ensure maximum performance and easy troubleshooting).
- **Deployment:** Vercel or GitHub Pages.

## 2. Architecture & Data Flow
- **Questions Data Store:** Questions will be stored in a static JSON file (`public/data/questions.json`). This ensures zero database overhead and immediate loading.
  - Format: `[ { "id": "1", "category": "Science & Tech", "topic": "Is AI going to destroy humanity?", "author": "system" } ]`

## 3. User Submission Workflow (GitHub Actions)
Users can submit new topics via a form. We will create a seamless issue-creation workflow:
1. **Frontend:** User fills out a form (Topic, Category).
2. **Submission Logic:** The frontend will use a fine-grained Personal Access Token (PAT) restricted **strictly to opening issues** in this specific repository. 
   - *Security Note:* Exposing a PAT in frontend code, even a fine-grained one, is generally discouraged as it can be scraped and used to spam the repo with issues. 
   - *Alternative/Preferred:* Use a lightweight Serverless Function (e.g., Netlify/Vercel Function) to hold the PAT and act as a proxy. The frontend sends the form data to the function, and the function securely calls the GitHub API.
3. **Issue Formatting:** The created issue will have a specific body format (e.g., JSON or specific markdown tags) and a label (`new-topic`).
4. **GitHub Action:** A workflow triggers on `issues: [opened]`.
   - Checks if the issue has the `new-topic` label.
   - Parses the topic and category.
   - Creates a new git branch.
   - Appends the new JSON object to `questions.json`.
   - Commits and pushes.
   - Creates a Pull Request for admin review.
   - Closes the issue or links it to the PR.

## 4. Scalability
- Loading thousands of questions from a JSON file takes milliseconds. If it grows too large (e.g., 50,000+ questions), we will split the JSON into chunks by category (e.g., `science.json`, `philosophy.json`) and dynamically import them via JS `fetch()`.

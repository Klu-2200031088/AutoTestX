# CI/CD Integration Guide

AutoTestX is designed to act as an intelligent orchestration layer for any project. You can integrate it into your existing pipelines to benefit from AI-prioritized testing and deep analytical insights.

## GitHub Actions Integration

To integrate AutoTestX with GitHub Actions, add the following lightweight workflow to your target project (`.github/workflows/autotestx.yml`). 

This template is designed to be "plug-and-play" and handles the secure handover to the AutoTestX Intelligence Engine.

```yaml
name: AutoTestX CI Trigger

on:
  push:
    branches: [ "**" ]

jobs:
  autotestx-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Orchestrate Tests
        env:
          AUTOTESTX_PROJECT_ID: ${{ secrets.AUTOTESTX_PROJECT_ID }}
          AUTOTESTX_API_URL: "https://your-api-url.com/api"
        run: |
          curl -sSL https://raw.githubusercontent.com/autotestx/AutoTestX/main/scripts/autotestx-ci.js -o trigger.js
          npm install axios
          node trigger.js
```

> **Tip**: You can find this template file at `/templates/autotestx-trigger.yml` in the main AutoTestX repository.

## How it works

1. **Trigger**: When you push code, the GitHub Action triggers.
2. **Handover**: The action calls the AutoTestX API with your `projectId`.
3. **Orchestration**: AutoTestX pulls your code, analyzes the risk vectors using AI, and executes the tests in the optimal order.
4. **Feedback**: Results are streamed back to the CI pipeline. If any prioritized test fails, the CI job fails immediately (Fail-Fast).
5. **Analytics**: The data is automatically logged into the AutoTestX Dashboard for long-term health monitoring.

## Environment Variables

| Variable | Description |
| :--- | :--- |
| `AUTOTESTX_PROJECT_ID` | The unique ID of your project from the AutoTestX "Projects" page. |
| `AUTOTESTX_API_URL` | The base URL of your AutoTestX backend instance. |
```

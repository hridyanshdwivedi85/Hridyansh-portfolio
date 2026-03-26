## Automatic file updates on GitHub

This repo now includes a GitHub Actions workflow at:

- `.github/workflows/auto-update-file.yml`

### How it works

- Runs automatically every day (04:00 UTC) and can also be triggered manually from **Actions → Auto Update File → Run workflow**.
- Executes an update command.
- Commits and pushes only when there are actual file changes.

### To update your own file automatically

1. Open `.github/workflows/auto-update-file.yml`.
2. Edit the **Update target file** step and replace the example command with your real update command.
   - Example: regenerate JSON, refresh a build artifact, rewrite a markdown file, etc.
3. Commit and push.

After that, GitHub will keep the file updated automatically based on the schedule.

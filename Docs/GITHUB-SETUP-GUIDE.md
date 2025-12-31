# GitHub Setup Guide - Push CLDRViewer to GitHub

## Prerequisites
- ✅ GitHub account (you have this)
- ✅ Git installed on your Mac (comes pre-installed)
- ✅ Project code ready (CLDRViewer)

---

## Step 1: Configure Git (One-Time Setup)

Open your terminal and run these commands with **your actual GitHub email and name**:

```bash
# Set your name (will appear in commits)
git config --global user.name "Your Name"

# Set your email (MUST match your GitHub account email)
git config --global user.email "your.email@example.com"

# Verify it worked
git config --global user.name
git config --global user.email
```

**Example:**
```bash
git config --global user.name "Dragan Besevic"
git config --global user.email "dragan@example.com"
```

---

## Step 2: Create Repository on GitHub

1. Go to https://github.com
2. Log in to your account
3. Click the **"+"** icon in top-right corner
4. Click **"New repository"**
5. Fill in:
   - **Repository name:** `cldr-viewer` (or `CLDRViewer`)
   - **Description:** "CLDR Viewer - Browse and explore Unicode CLDR locale data"
   - **Visibility:** Choose **Public** or **Private**
   - ❌ **DO NOT** check "Initialize with README" (we already have files)
   - ❌ **DO NOT** add .gitignore (we'll create one)
   - ❌ **DO NOT** choose a license yet
6. Click **"Create repository"**

**Important:** After creating, GitHub will show you a page with commands. **Keep this page open** - we'll use those commands.

---

## Step 3: Create .gitignore File

Before committing, create a `.gitignore` file to exclude files we don't want in Git:

```bash
# Run this in your project directory
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
dist/
dist-ssr/
build/

# Vite
.vite/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# macOS
.DS_Store
.AppleDouble
.LSOverride

# Temporary files
*.tmp
*.temp
.cache/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache
EOF
```

---

## Step 4: Initialize Git Repository

```bash
# Navigate to your project directory
cd /Users/draganbesevic/Projects/claude/CLDRViewer

# Initialize Git repository
git init

# Check status (you should see many untracked files)
git status
```

---

## Step 5: Stage All Files

```bash
# Add all files to staging area
git add .

# Verify files are staged (should be green)
git status
```

---

## Step 6: Create First Commit

```bash
# Create commit with descriptive message
git commit -m "Initial commit: CLDR Viewer with Phase 1 features

- React XML Viewer with tree and detail panels
- CLDR integration with locale selector
- Auto-load English locale on startup
- Favorites and recent locales tracking
- XML attributes display in tree view
- Comprehensive documentation

Phase 1 complete with all features working."
```

---

## Step 7: Connect to GitHub

**Go back to the GitHub page from Step 2** and copy the commands under "…or push an existing repository from the command line".

They will look like this (but with YOUR username and repo name):

```bash
# Add remote repository
git remote add origin https://github.com/YOUR-USERNAME/cldr-viewer.git

# Rename branch to main (GitHub's default)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace** `YOUR-USERNAME` with your actual GitHub username!

---

## Step 8: Authenticate to GitHub

When you run `git push`, you'll be prompted to authenticate. On macOS, you have two options:

### Option A: Personal Access Token (Recommended)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "CLDRViewer Push"
4. Set expiration: 90 days (or longer)
5. Check scope: **repo** (Full control of private repositories)
6. Click "Generate token"
7. **COPY THE TOKEN** (you won't see it again!)
8. When prompted for password in terminal, **paste the token** (not your GitHub password)

### Option B: GitHub CLI (Alternative)

```bash
# Install GitHub CLI if not already installed
brew install gh

# Authenticate
gh auth login

# Follow the prompts
```

---

## Step 9: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR-USERNAME/cldr-viewer`
2. You should see all your files
3. Check that README.md displays properly
4. Verify the commit message shows up

---

## Complete Script (All Commands Together)

**After completing Steps 1-2 above**, you can run this complete sequence:

```bash
# Navigate to project
cd /Users/draganbesevic/Projects/claude/CLDRViewer

# Create .gitignore (paste the content from Step 3)
cat > .gitignore << 'EOF'
[paste content here]
EOF

# Initialize and commit
git init
git add .
git commit -m "Initial commit: CLDR Viewer with Phase 1 features

- React XML Viewer with tree and detail panels
- CLDR integration with locale selector
- Auto-load English locale on startup
- Favorites and recent locales tracking
- XML attributes display in tree view
- Comprehensive documentation

Phase 1 complete with all features working."

# Connect to GitHub (REPLACE with your actual username/repo)
git remote add origin https://github.com/YOUR-USERNAME/cldr-viewer.git
git branch -M main
git push -u origin main
```

---

## Future Commits

After the initial push, making future commits is simple:

```bash
# Make changes to your files...

# Stage changes
git add .

# Or stage specific files
git add src/components/MyComponent.tsx

# Commit with message
git commit -m "Add new feature"

# Push to GitHub
git push
```

---

## Common Issues and Solutions

### Issue 1: "fatal: remote origin already exists"

```bash
# Remove existing remote
git remote remove origin

# Add it again
git remote add origin https://github.com/YOUR-USERNAME/cldr-viewer.git
```

### Issue 2: Authentication Failed

- Make sure you're using a **Personal Access Token**, not your GitHub password
- GitHub no longer accepts passwords for git operations
- Follow Option A in Step 8 to create a token

### Issue 3: "Updates were rejected because the remote contains work"

This shouldn't happen on first push, but if it does:

```bash
# Pull first (force)
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

### Issue 4: Too Many Files Warning

If you see "too many files", you probably forgot the `.gitignore`. Fix it:

```bash
# Create .gitignore (see Step 3)
# Then reset and re-add
git rm -r --cached .
git add .
git commit --amend --no-edit
```

---

## Best Practices

### 1. Commit Often
- Make small, focused commits
- Don't wait until you have 100 changes
- Each commit should represent one logical change

### 2. Write Good Commit Messages

**Bad:**
```bash
git commit -m "fixed stuff"
git commit -m "updates"
```

**Good:**
```bash
git commit -m "fix: XML attributes now display in tree view"
git commit -m "feat: add locale comparison feature"
git commit -m "docs: update README with installation steps"
```

### 3. Use Conventional Commits

Format: `type(scope): description`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, no logic change)
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat(locale-selector): add search functionality"
git commit -m "fix(tree-view): resolve attribute duplication"
git commit -m "docs(readme): add GitHub setup instructions"
```

### 4. Review Before Committing

```bash
# See what files changed
git status

# See what lines changed
git diff

# See staged changes
git diff --cached
```

---

## Useful Git Commands

### Check Status
```bash
git status              # See what's changed
git log                 # See commit history
git log --oneline       # Compact history
```

### Undo Changes
```bash
git restore file.txt    # Discard changes to file
git restore .           # Discard all changes
git reset HEAD~1        # Undo last commit (keep changes)
git reset --hard HEAD~1 # Undo last commit (delete changes)
```

### Branching
```bash
git branch feature-x    # Create new branch
git checkout feature-x  # Switch to branch
git checkout -b feature-x  # Create and switch
git merge feature-x     # Merge branch into current
```

### Remote Operations
```bash
git pull                # Get latest from GitHub
git push                # Send commits to GitHub
git remote -v           # See remote URLs
```

---

## Next Steps After First Push

1. **Add a LICENSE**
   - Go to your GitHub repo
   - Click "Add file" → "Create new file"
   - Name it `LICENSE`
   - Click "Choose a license template"
   - Select MIT, Apache 2.0, or GPL (MIT is common for open source)

2. **Update README.md**
   - Add GitHub badges (build status, version, etc.)
   - Add demo screenshots
   - Add link to live demo (if deployed)

3. **Set up GitHub Actions** (Optional)
   - Automated testing
   - Automated deployment
   - Code quality checks

4. **Enable GitHub Pages** (Optional)
   - Host the app for free on GitHub
   - Settings → Pages → Source: GitHub Actions
   - Use Vite's GitHub Pages deployment

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Initialize repo | `git init` |
| Stage all files | `git add .` |
| Commit | `git commit -m "message"` |
| Connect to GitHub | `git remote add origin URL` |
| Push | `git push -u origin main` |
| Check status | `git status` |
| View history | `git log --oneline` |
| Undo changes | `git restore file.txt` |
| Pull latest | `git pull` |

---

## Help Resources

- **Git Basics:** https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
- **GitHub Docs:** https://docs.github.com/en/get-started
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **Interactive Tutorial:** https://learngitbranching.js.org/

---

## Summary Checklist

- [ ] Configure Git with name and email
- [ ] Create repository on GitHub
- [ ] Create .gitignore file
- [ ] Initialize Git (`git init`)
- [ ] Stage files (`git add .`)
- [ ] Make first commit
- [ ] Add remote origin
- [ ] Push to GitHub (`git push -u origin main`)
- [ ] Verify files appear on GitHub
- [ ] Add LICENSE (optional)
- [ ] Celebrate! 🎉

---

**You're all set!** Your code is now safely backed up on GitHub and ready to share with the world.

# WebStorm Setup and Usage Guide

This guide explains how to open, run, and test the React XML Viewer project in WebStorm IDE.

## Prerequisites

Before starting, ensure you have:
- **WebStorm 2023.3+** installed
- **Node.js 18+** installed
- **npm** (comes with Node.js)

## Opening the Project

### Method 1: Open Existing Project
1. Launch WebStorm
2. Click **File → Open**
3. Navigate to `/Users/draganbesevic/Projects/claude/CLDRViewer`
4. Click **OK**
5. WebStorm will automatically detect it as a Node.js project

### Method 2: From Welcome Screen
1. On WebStorm welcome screen, click **Open**
2. Select the `CLDRViewer` folder
3. Click **OK**

## Initial Setup

### 1. Install Dependencies

**Option A: Using WebStorm Terminal**
1. Open the Terminal in WebStorm: **View → Tool Windows → Terminal** (or `Alt+F12`)
2. Run:
```bash
npm install
```

**Option B: Using npm Scripts Panel**
1. Open **npm** panel: **View → Tool Windows → npm**
2. If you see "Run 'npm install'" - click it
3. Wait for installation to complete (~30 seconds)

### 2. Trust the Project
When WebStorm asks "Trust and Open Project?", click **Trust Project**

## Running the Development Server

### Method 1: Using npm Scripts (Recommended)

1. Open the **npm** panel: **View → Tool Windows → npm** (or right side toolbar)
2. Expand **package.json**
3. Double-click **dev** under Scripts
4. The dev server will start in the Run panel

Alternatively:
- Right-click `package.json` → **Show npm Scripts**
- Double-click **dev**

### Method 2: Using Run Configurations

1. Click the **Run Configuration dropdown** (top-right, next to green play button)
2. Select **Edit Configurations...**
3. Click **+** → **npm**
4. Set:
   - **Name**: `Dev Server`
   - **Command**: `run`
   - **Scripts**: `dev`
5. Click **OK**
6. Click the green **Run** button (or `Shift+F10`)

### Method 3: Using Terminal

1. Open Terminal: `Alt+F12`
2. Run:
```bash
npm run dev
```

### Accessing the Application

After starting the dev server:
1. Look for the output: `Local: http://localhost:5173/`
2. **Ctrl+Click** (or **Cmd+Click** on Mac) on the URL to open in browser
3. Or manually open `http://localhost:5173` in your browser

## Testing the Application

### 1. Upload Sample XML File

**Method A: Using the Sample File**
1. In the browser, click **Choose File**
2. Navigate to the project folder
3. Select `public/sample.xml`
4. Click **Open**

**Method B: Drag and Drop**
1. In WebStorm, find `public/sample.xml` in Project panel
2. Right-click → **Reveal in Finder** (Mac) or **Show in Explorer** (Windows)
3. Drag `sample.xml` from Finder/Explorer to the browser upload area

**Method C: Direct Access**
You can also access the sample file at: `http://localhost:5173/sample.xml`
Then save it and upload it to the app.

### 2. Test Features

Once XML is loaded:

✅ **Tree Navigation**
- Click nodes to expand/collapse
- Click a node to select it
- Verify left panel shows tree structure

✅ **Detail Panel**
- Select different nodes
- Verify right panel updates
- Check attributes table
- View statistics

✅ **Clear Functionality**
- Click the **Clear** button in header
- Verify return to upload screen

✅ **Error Handling**
- Try uploading a non-XML file (should show error)
- Try uploading a very large file (if you have one >10MB)

## Building for Production

### Using npm Scripts Panel
1. Open **npm** panel
2. Double-click **build** under Scripts
3. Wait for build to complete
4. Output will be in `dist/` folder

### Using Terminal
```bash
npm run build
```

### Preview Production Build
After building:
```bash
npm run preview
```
Then open `http://localhost:4173`

## WebStorm Features to Use

### 1. TypeScript Support

**Type Checking**
- WebStorm automatically checks TypeScript
- Errors show with red underlines
- Hover over code to see type information

**Go to Definition**
- **Ctrl+Click** (or **Cmd+Click**) on any function/component
- Or press **Ctrl+B** (or **Cmd+B**)

**Find Usages**
- Right-click on function/variable → **Find Usages**
- Or press **Alt+F7**

### 2. Code Navigation

**File Navigation**
- **Ctrl+Shift+N** (or **Cmd+Shift+O**) - Search for files
- **Ctrl+N** (or **Cmd+O**) - Search for classes/components
- **Ctrl+E** - Recent files

**Structure View**
- **Alt+7** - Opens Structure panel
- Shows all functions, components, types in current file

### 3. Code Quality

**ESLint**
- Already configured in the project
- Shows warnings/errors inline
- Right-click in editor → **Fix ESLint Problems**

**Prettier** (if you want to add it)
- Install: `npm install -D prettier`
- Configure auto-format on save in WebStorm settings

### 4. Debugging

**Debug React App**
1. Start dev server (`npm run dev`)
2. Install **JetBrains IDE Support** Chrome extension
3. Click **Debug** button (next to Run)
4. Set breakpoints in `.tsx` files
5. Debug in WebStorm!

**Simple Debugging**
- Use `console.log()` in your code
- View output in **Run** panel
- Or use browser DevTools

### 5. Git Integration

WebStorm has built-in Git support:

**Initialize Git** (if not already done)
1. **VCS → Enable Version Control Integration**
2. Select **Git**

**Commit Changes**
1. **Ctrl+K** (or **Cmd+K**)
2. Select files to commit
3. Write commit message
4. Click **Commit**

**View Changes**
- **Alt+9** - Opens **Git** panel
- Shows all changes, branches, log

### 6. Tailwind CSS Support

WebStorm supports Tailwind IntelliSense:

**Enable Tailwind Support**
1. **Settings → Languages & Frameworks → Style Sheets → Tailwind CSS**
2. Check **Enable Tailwind CSS**
3. Enjoy autocomplete for Tailwind classes!

## Common WebStorm Tasks

### Renaming Variables/Functions
1. Place cursor on name
2. Press **Shift+F6**
3. Type new name
4. Press **Enter**
5. All usages renamed automatically!

### Reformatting Code
1. **Ctrl+Alt+L** (or **Cmd+Option+L**)
2. Formats current file according to project settings

### Optimizing Imports
1. **Ctrl+Alt+O** (or **Ctrl+Option+O**)
2. Removes unused imports, sorts them

### Multi-cursor Editing
1. **Alt+Click** - Add cursor at position
2. **Alt+Shift+Click** - Add cursor and select
3. **Ctrl+Ctrl (hold) + Up/Down** - Add cursor above/below

## Useful Run Configurations

Create these for quick access:

### 1. Development Server
```
Name: Dev Server
Command: run
Scripts: dev
```

### 2. Production Build
```
Name: Build
Command: run
Scripts: build
```

### 3. Preview Build
```
Name: Preview
Command: run
Scripts: preview
```

### 4. Lint
```
Name: Lint
Command: run
Scripts: lint
```

## Keyboard Shortcuts Cheat Sheet

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Run | `Shift+F10` | `Ctrl+R` |
| Debug | `Shift+F9` | `Ctrl+D` |
| Search Files | `Ctrl+Shift+N` | `Cmd+Shift+O` |
| Search Everywhere | `Double Shift` | `Double Shift` |
| Terminal | `Alt+F12` | `Option+F12` |
| Run Panel | `Alt+4` | `Cmd+4` |
| Project Panel | `Alt+1` | `Cmd+1` |
| Git Panel | `Alt+9` | `Cmd+9` |
| Rename | `Shift+F6` | `Shift+F6` |
| Format Code | `Ctrl+Alt+L` | `Cmd+Option+L` |
| Go to Definition | `Ctrl+B` | `Cmd+B` |
| Find Usages | `Alt+F7` | `Option+F7` |

## Troubleshooting

### Dev Server Won't Start

**Check Node Version**
```bash
node --version  # Should be 18+
```

**Clear node_modules and Reinstall**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Check Port 5173**
If port 5173 is in use:
- Stop other Vite servers
- Or change port in `vite.config.ts`:
```ts
export default defineConfig({
  server: {
    port: 3000  // Use different port
  }
})
```

### TypeScript Errors in IDE

**Restart TypeScript Service**
1. **Ctrl+Shift+A** (or **Cmd+Shift+A**)
2. Type "Restart TypeScript Service"
3. Press **Enter**

**Invalidate Caches**
1. **File → Invalidate Caches...**
2. Check **Clear file system cache and Local History**
3. Click **Invalidate and Restart**

### Hot Reload Not Working

1. Check if dev server is running
2. Check browser console for errors
3. Try hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R`)
4. Restart dev server

## Best Practices in WebStorm

### 1. Use TODO Comments
```typescript
// TODO: Add validation for email
// FIXME: Handle edge case for empty XML
```
View all TODOs: **Alt+6** (TODO panel)

### 2. Use Bookmarks
- **F11** - Toggle bookmark on current line
- **Shift+F11** - Show all bookmarks

### 3. Split Editor
- Right-click file tab → **Split Right** or **Split Down**
- Work on multiple files simultaneously

### 4. Use Local History
- Right-click file → **Local History → Show History**
- WebStorm tracks all changes automatically

### 5. Quick Documentation
- **Ctrl+Q** (or **F1**) - Show quick documentation
- Hover over any function/component

## Project Structure in WebStorm

The Project panel should show:

```
CLDRViewer/
├── 📁 Docs/              # Documentation files
├── 📁 node_modules/      # Dependencies (hidden by default)
├── 📁 public/            # Static files
│   └── sample.xml
├── 📁 src/
│   ├── 📁 components/    # React components
│   ├── 📁 context/       # State management
│   ├── 📁 hooks/         # Custom hooks
│   ├── 📁 types/         # TypeScript types
│   ├── 📁 utils/         # Utilities
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── 📁 dist/              # Build output (after npm run build)
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
├── tailwind.config.js    # Tailwind config
└── README.md
```

## Next Steps

1. ✅ Open project in WebStorm
2. ✅ Run `npm install`
3. ✅ Start dev server with `npm run dev`
4. ✅ Open `http://localhost:5173` in browser
5. ✅ Load `public/sample.xml` to test
6. ✅ Explore the code with WebStorm features
7. ✅ Make changes and see hot reload in action

## Resources

- **WebStorm Documentation**: https://www.jetbrains.com/help/webstorm/
- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **Tailwind Documentation**: https://tailwindcss.com/

---

**Enjoy developing with WebStorm!** 🚀

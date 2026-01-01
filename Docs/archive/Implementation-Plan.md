# React XML Viewer Implementation Plan

## Project Location
- **Development Directory**: `/Users/draganbesevic/Projects/claude/CLDRViewer`
- **Documentation**: This plan will be copied to `Docs/` folder in the project directory
- **Current Status**: Empty directory with Docs folder already created

## Overview
Create a React app with TypeScript that opens XML files and displays them in a split-pane view:
- **Left panel**: Tree view of XML structure (selectable nodes)
- **Right panel**: Details of selected element

## Technology Stack
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Libraries**:
  - `fast-xml-parser` - XML parsing
  - `react-arborist` - Tree view component
  - `react-resizable-panels` - Split pane layout
  - `lucide-react` - Icons
  - `clsx` - Conditional classNames

## Project Structure
```
src/
├── App.tsx                    # Main app, XMLProvider wrapper
├── main.tsx                   # Entry point
├── index.css                  # Tailwind directives
├── components/
│   ├── FileUploader.tsx       # File upload/drop zone
│   ├── XMLViewer.tsx          # Split pane container
│   ├── TreePanel.tsx          # Left panel with tree
│   ├── TreeView.tsx           # Tree view component
│   ├── DetailPanel.tsx        # Right panel wrapper
│   ├── NodeDetails.tsx        # Selected node details
│   └── EmptyState.tsx         # No file loaded state
├── context/
│   └── XMLContext.tsx         # XML data + selection state
├── types/
│   └── xml.types.ts           # TypeScript interfaces
├── utils/
│   ├── xmlParser.ts           # XML parsing logic
│   └── xmlFormatter.ts        # Format for display
└── hooks/
    └── useXMLFile.ts          # File loading hook
```

## Implementation Steps

### Phase 0: Documentation
1. **Copy this implementation plan to `Docs/Implementation-Plan.md`** in the project directory for reference

### Phase 1: Project Setup
2. Initialize Vite project: `npm create vite@latest . -- --template react-ts`
3. Install dependencies:
   ```bash
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npm install fast-xml-parser react-resizable-panels react-arborist clsx lucide-react
   ```
4. Configure Tailwind: `npx tailwindcss init -p`
5. Update `tailwind.config.js` and `src/index.css`
6. Create project directories: components, context, types, utils, hooks

### Phase 2: Type Definitions & Utilities
7. **Create `src/types/xml.types.ts`**:
   - `XMLNode` interface (id, name, type, attributes, textContent, children, path)
   - `TreeNode` interface (id, name, children, data)
   - `XMLContextState` interface

8. **Create `src/utils/xmlParser.ts`**:
   - Configure fast-xml-parser
   - Parse XML string to XMLNode structure
   - Generate unique IDs and paths
   - Handle edge cases (CDATA, comments, mixed content)

9. **Create `src/utils/xmlFormatter.ts`**:
   - Format attributes for display
   - Pretty-print helpers

### Phase 3: State Management
10. **Create `src/context/XMLContext.tsx`**:
    - State: xmlData, selectedNode, fileName, isLoading, error
    - Actions: loadXMLFile, selectNode, clearXML
    - Export provider and useXML hook

11. **Create `src/hooks/useXMLFile.ts`**:
    - File reading with FileReader API
    - Validation (file type, size limit)
    - Error handling
    - Integration with parser

### Phase 4: Core Components
12. **Create `src/components/EmptyState.tsx`**:
    - Display when no file loaded
    - Instructions for user

13. **Create `src/components/FileUploader.tsx`**:
    - File input button + drag-and-drop zone
    - Accept only .xml files
    - File validation
    - Use useXMLFile hook

14. **Create `src/components/XMLViewer.tsx`**:
    - Use react-resizable-panels (PanelGroup, Panel, PanelResizeHandle)
    - Horizontal split layout
    - TreePanel on left, DetailPanel on right

### Phase 5: Tree View
15. **Create `src/components/TreeView.tsx`**:
    - Integrate react-arborist
    - Custom node renderer with icons
    - Handle selection → update context
    - Expand/collapse state

16. **Create `src/components/TreePanel.tsx`**:
    - Panel header with file name
    - TreeView integration
    - Loading/error states

### Phase 6: Detail View
17. **Create `src/components/NodeDetails.tsx`**:
    - Display selected node info:
      - Tag name, type
      - Attributes (key-value table)
      - Text content
      - XPath
      - Children count
    - Styled with Tailwind

18. **Create `src/components/DetailPanel.tsx`**:
    - Panel header
    - Empty state (no selection)
    - NodeDetails integration

### Phase 7: Main App Integration
19. **Update `src/App.tsx`**:
    - Wrap with XMLProvider
    - Conditional rendering: EmptyState vs XMLViewer
    - App header with title and actions

20. **Update `src/main.tsx`**:
    - Render App with StrictMode

### Phase 8: Polish
21. **Styling refinement**:
    - Consistent Tailwind theme
    - Focus states and accessibility
    - Responsive layout

22. **Error handling**:
    - Invalid XML format
    - Large file warnings (10MB limit)
    - User-friendly error messages

23. **Testing**:
    - Test with various XML files (simple, complex, namespaced)
    - Test edge cases (empty files, malformed XML)

## Critical Files

All paths relative to `/Users/draganbesevic/Projects/claude/CLDRViewer/`

**Core Logic**:
- `src/types/xml.types.ts` - Type definitions
- `src/utils/xmlParser.ts` - XML parsing
- `src/context/XMLContext.tsx` - State management

**UI Components**:
- `src/components/TreeView.tsx` - Tree rendering & selection
- `src/components/NodeDetails.tsx` - Detail display
- `src/components/XMLViewer.tsx` - Layout container

**Configuration**:
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration

## Data Flow
1. User uploads XML file via FileUploader
2. FileReader reads file content as string
3. xmlParser transforms string → XMLNode structure
4. Structure stored in XMLContext (xmlData)
5. TreeView renders from xmlData
6. User clicks node → selectNode(node) in context
7. DetailPanel displays selectedNode data

## Key Implementation Details

### XML Parser Config
```typescript
const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  preserveOrder: true,
  parseAttributeValue: false,
  trimValues: true,
};
```

### File Size Limit
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

### Layout Structure
```
┌─────────────────────────────────────────┐
│  React XML Viewer      [Clear] [Upload] │
├──────────────┬──────────────────────────┤
│ Tree View    │ Details Panel            │
│ ├─ root      │ Selected: element2       │
│ │  ├─ elem1  │ Type: element            │
│ │  └─ elem2  │ Attributes:              │
│ └─ data      │   - id: "123"            │
│    ├─ item   │ Text: "content..."       │
│    └─ item   │ Path: /root/element2     │
└──────────────┴──────────────────────────┘
```

## Success Criteria
- ✅ Can upload and parse XML files
- ✅ Tree view displays XML hierarchy
- ✅ Clicking tree nodes updates detail panel
- ✅ Resizable split pane
- ✅ Shows attributes, text content, path
- ✅ Handles errors gracefully
- ✅ Clean, professional UI with Tailwind

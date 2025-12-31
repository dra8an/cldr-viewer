# React XML Viewer

A modern, interactive XML file viewer built with React, TypeScript, and Vite. Features a split-pane interface with tree navigation and detailed node inspection.

![React XML Viewer](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-cyan)

## Features

- **📂 Drag & Drop Upload** - Simply drag XML files into the browser or click to browse
- **🌲 Tree View** - Navigate XML structure with expandable/collapsible nodes
- **🔍 Node Details** - View comprehensive information about selected elements
- **📊 Statistics** - See node counts, depth, attributes, and more
- **🎨 Clean UI** - Modern, professional interface with Tailwind CSS
- **⚡ Fast Performance** - Virtual scrolling for large XML files
- **♿ Accessible** - WCAG compliant with keyboard navigation and ARIA labels
- **📱 Responsive** - Works on desktop and tablet devices

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd CLDRViewer

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Try it out

1. Open the app in your browser
2. Click "Choose File" or drag an XML file into the upload area
3. Explore the XML structure in the tree view
4. Click any node to see its details

A sample XML file is included at `/public/sample.xml` for testing.

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist` directory.

## Technology Stack

### Core
- **React 19.2** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server

### UI Components
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **react-arborist 3.4** - Tree view with virtual scrolling
- **react-resizable-panels 4.0** - Resizable split panels
- **lucide-react 0.562** - Beautiful icon set

### Utilities
- **fast-xml-parser 5.3** - XML parsing engine
- **clsx 2.1** - Conditional class names

## Project Structure

```
CLDRViewer/
├── src/
│   ├── components/          # React components
│   │   ├── DetailPanel.tsx  # Right panel wrapper
│   │   ├── EmptyState.tsx   # No file loaded state
│   │   ├── FileUploader.tsx # File upload component
│   │   ├── NodeDetails.tsx  # Node information display
│   │   ├── TreePanel.tsx    # Left panel wrapper
│   │   ├── TreeView.tsx     # Tree component
│   │   └── XMLViewer.tsx    # Split panel container
│   ├── context/
│   │   └── XMLContext.tsx   # Global state management
│   ├── hooks/
│   │   └── useXMLFile.ts    # File upload hook
│   ├── types/
│   │   └── xml.types.ts     # TypeScript interfaces
│   ├── utils/
│   │   ├── xmlFormatter.ts  # Display formatting
│   │   └── xmlParser.ts     # XML parsing logic
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/
│   └── sample.xml           # Sample XML file
├── Docs/                    # Implementation documentation
└── package.json
```

## Features in Detail

### XML Parsing
- Supports standard XML with elements, attributes, text content
- Handles CDATA sections and comments
- Generates XPath-like paths for navigation
- File size limit: 10MB

### Tree View
- Virtual scrolling for performance
- Expand/collapse functionality
- Visual indicators for node types
- Attribute count badges
- Smart node naming with identifying attributes

### Node Details
- Element name and type
- Full XPath
- Attributes table
- Text content (with CDATA support)
- Statistics: children count, depth, total nodes

### Error Handling
- File type validation (.xml only)
- File size validation (10MB max)
- XML syntax validation
- User-friendly error messages

## Keyboard Navigation

- **Tab** - Navigate between interactive elements
- **Enter/Space** - Activate buttons and upload area
- **Arrow Keys** - Navigate tree nodes (when tree is focused)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style

- TypeScript with strict mode
- ESLint for code quality
- Functional React components with hooks
- Tailwind CSS for styling

## Documentation

Detailed implementation documentation is available in the `Docs/` directory:

- Phase 1: Project Setup
- Phase 2: Type Definitions & Utilities
- Phase 3: State Management
- Phase 4: Core Components
- Phase 5: Tree View
- Phase 6: Detail View
- Phase 7: App Integration
- Phase 8: Polish

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Tree component by [react-arborist](https://github.com/brimdata/react-arborist)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

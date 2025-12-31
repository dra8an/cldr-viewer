# Next Steps - CLDR Viewer Development

**Last Updated**: 2025-12-29

## Immediate Next Steps (Current Session)

### ~~1. Fix XML Tag Attribute Display~~ ✅ COMPLETED

**Status**: RESOLVED - Attributes now display correctly in tree view

**What was fixed**:
- Attributes are now extracted from sibling `:@` property in parsedData
- Attributes properly passed to child nodes during recursion
- Fixed duplicate display by using `xmlNode.name` instead of `getNodeDisplayName()`

**Documentation**: See `Docs/BUGFIX-XML-ATTRIBUTES-DISPLAY.md` for detailed technical analysis

**Result**: Tree now shows `<language type="aa">` format correctly

---

## Short-Term Goals (Next 1-2 Sessions)

### 2. Complete Tree View Enhancement
- Remove debug logging once issue is resolved
- Consider syntax highlighting for XML tags (colorize tag name vs attributes)
- Add option to toggle between tag view and simple name view

### 3. Testing Phase 1
- Test with multiple locales (zh_Hans_CN, fr_FR, ar, etc.)
- Verify favorites persist across browser refresh
- Verify recent locales update correctly
- Test search functionality thoroughly
- Test with large locale files for performance

### 4. Performance Optimization
- Consider debouncing search input (300ms delay)
- Lazy load locale list if GitHub API is slow
- Monitor react-arborist performance with large files

---

## Medium-Term Goals (Phase 2)

### Phase 2: CLDR UI Enhancements

#### 2.1 CLDR Metadata Display
**File**: Create `src/components/CLDRMetadataPanel.tsx`

**Features**:
- Display CLDR version from `<version number="...">`
- Show locale identity (language, script, territory)
- List available sections (dates, numbers, currencies, etc.)
- Add badge indicators for section presence

**Example UI**:
```
┌─ CLDR Metadata ─────────────┐
│ Version: 45                  │
│ Locale: en (English)         │
│                              │
│ Sections:                    │
│ ✓ Locale Display Names       │
│ ✓ Dates & Times             │
│ ✓ Numbers                    │
│ ✓ Currencies                 │
│ ✓ Units                      │
│ ✗ Collations                 │
└──────────────────────────────┘
```

#### 2.2 Section Navigation
**Features**:
- Add quick navigation to major sections
- Highlight section headers in tree
- Add "Jump to Section" dropdown
- Breadcrumb navigation for current location

#### 2.3 Locale Comparison
**Features**:
- Side-by-side view of two locales
- Highlight differences
- Compare specific sections only
- Export comparison report

#### 2.4 Enhanced Detail Panel
**Features**:
- Show inherited values (from parent locale)
- Display value usage examples
- Link to CLDR specification for element
- Show related elements

---

## Long-Term Goals (Phase 3-5)

### Phase 3: Editing Capabilities

#### 3.1 Inline Editing
- Click to edit text content
- Edit attribute values
- Add/remove attributes
- Validate changes against LDML schema

#### 3.2 Save & Export
- Save modified XML to file
- Export as JSON
- Generate diff/patch file
- Create GitHub contribution PR

#### 3.3 Undo/Redo
- Command pattern for change tracking
- Undo/redo stack
- Change history panel
- Reset to original

### Phase 4: Advanced CLDR Features

#### 4.1 XPath Search
- XPath query input
- Result highlighting in tree
- Result list with navigation
- Save favorite queries

#### 4.2 Locale Inheritance Visualization
- Show inheritance chain (en_US → en → root)
- Visualize value resolution
- Override indicators
- Parent locale quick access

#### 4.3 Coverage Analysis
- Show locale completeness percentage
- Missing translations report
- Compare coverage between locales
- Priority item highlighting

#### 4.4 JSON Conversion
- Convert XML to JSON
- ICU MessageFormat output
- Export for i18n libraries
- Custom format templates

### Phase 5: Polish & User Experience

#### 5.1 Keyboard Shortcuts
- Arrow keys for tree navigation
- `/` to focus search
- `Ctrl+F` for find in tree
- `Ctrl+K` for command palette
- `Esc` to clear selection

#### 5.2 Dark Mode
- Toggle dark/light theme
- Persist preference
- Syntax highlighting themes
- Accessible color contrast

#### 5.3 Settings Panel
- Configurable tree indent
- Font size controls
- Show/hide sections
- Export format preferences
- GitHub token for API

#### 5.4 Export Features
- Export as PDF
- Copy as formatted text
- Generate documentation
- Create locale package

---

## Technical Debt & Improvements

### Code Quality
- [ ] Add unit tests for utils (xmlParser, xmlFormatter)
- [ ] Add integration tests for components
- [ ] Add E2E tests with Playwright
- [ ] Improve TypeScript strict mode compliance
- [ ] Add JSDoc comments to all functions

### Performance
- [ ] Implement virtual scrolling for large attribute lists
- [ ] Memoize expensive calculations
- [ ] Code splitting for lazy loading
- [ ] Service worker for offline caching
- [ ] Optimize re-renders with React.memo

### Accessibility
- [ ] Complete ARIA labels
- [ ] Keyboard navigation audit
- [ ] Screen reader testing
- [ ] Color contrast verification
- [ ] Focus management improvements

### Developer Experience
- [ ] Add Storybook for component development
- [ ] Set up CI/CD pipeline
- [ ] Add pre-commit hooks
- [ ] Improve error messages
- [ ] Add development mode indicators

---

## Known Issues & Limitations

### Current Limitations
1. **GitHub API Rate Limit**: 60 requests/hour (unauthenticated)
   - Solution: Add GitHub token support in settings

2. **Network Dependency**: Requires internet for CLDR files
   - Solution: Add offline mode with IndexedDB caching

3. **No Edit Capability**: Read-only viewer
   - Solution: Implement Phase 3 editing features

4. **Single File View**: Can't compare locales
   - Solution: Add split-pane comparison mode

5. **No XPath/Search**: Can't search within content
   - Solution: Add XPath and text search features

### Technical Debt
1. **No Test Coverage**: Zero automated tests
2. **Manual Type Assertions**: Some `as any` usage in LocaleSelector
3. **Hard-coded Values**: Language/territory names hard-coded
4. **No Error Boundaries**: App crashes propagate to user
5. **Console Warnings**: Some warnings in development mode

---

## Documentation Needed

### User Documentation
- [ ] README update with CLDR Viewer features
- [ ] User guide with screenshots
- [ ] Keyboard shortcuts reference
- [ ] FAQ section
- [ ] Troubleshooting guide

### Developer Documentation
- [ ] Architecture documentation
- [ ] Component API documentation
- [ ] Contributing guidelines
- [ ] Code style guide
- [ ] Release process

### CLDR Documentation
- [ ] CLDR concepts for end-users
- [ ] Locale ID explanation
- [ ] Section descriptions
- [ ] Use case examples
- [ ] Best practices guide

---

## Dependencies to Consider

### Potential Additions
- **monaco-editor**: For advanced XML editing
- **diff**: For locale comparison
- **xml-formatter**: Better XML formatting
- **xpath**: For XPath query support
- **@testing-library/react**: For component testing
- **msw**: For API mocking in tests

### Dependency Updates
- Monitor Vite, React, and Tailwind updates
- Keep fast-xml-parser updated
- Watch for react-arborist improvements

---

## Metrics & Success Criteria

### Phase 1 Success Metrics ✅
- [x] Auto-loads en.xml on startup
- [x] 700+ locales available
- [x] Search functionality works
- [x] Favorites persist
- [x] Recent locales tracked
- [x] Zero TypeScript errors
- [x] Professional UI

### Phase 2 Success Metrics (Upcoming)
- [ ] CLDR metadata displayed
- [ ] Section navigation works
- [ ] Locale comparison functional
- [ ] Enhanced detail panel
- [ ] User can understand CLDR structure

### Overall Success Criteria
- Application loads in < 2 seconds
- Tree renders 1000+ nodes smoothly
- Search returns results in < 100ms
- No runtime errors in console
- 90%+ TypeScript coverage
- WCAG 2.1 AA accessibility compliance

---

## Questions for Future Sessions

1. Should we add GitHub authentication for higher API limits?
2. Do we need offline mode with full locale database?
3. Should editing features create GitHub PRs automatically?
4. Do we want multi-locale comparison (>2 at once)?
5. Should we support custom XML files beyond CLDR?

---

**Priority Order for Next Session**:
1. 🔴 Fix attribute display in tree view (BLOCKER)
2. 🟡 Test Phase 1 thoroughly
3. 🟡 Remove debug logging
4. 🟢 Plan Phase 2 features
5. 🟢 Update README with new features

---

**Note**: This document should be updated at the end of each session with new findings, completed items, and emerging priorities.

# CLDR Section Icons

**Date**: December 31, 2024
**Status**: Complete ✅

## Overview

Added color-coded, contextual icons to CLDR sections in both the tree view and metadata panel for better visual identification and navigation.

## Implementation

### Icon Mapping

Each major CLDR section has a unique icon and color:

| Section | Icon | Color | Purpose |
|---------|------|-------|---------|
| `dates` | 📅 Calendar | Orange | Date & time formatting |
| `numbers` | # Hash | Purple | Number formatting |
| `currencies` | $ DollarSign | Green | Currency data |
| `localeDisplayNames` | 🌍 Globe | Blue | Display names for languages/territories |
| `characters` | T Type | Indigo | Character sets |
| `listPatterns` | ≡ List | Teal | List formatting patterns |
| `delimiters` | " Quote | Pink | Quotation marks |
| `layout` | ≣ AlignLeft | Cyan | Layout direction (LTR/RTL) |
| `posix` | </> FileCode | Gray | POSIX-specific data |
| `personNames` | 👤 User | Rose | Person name formatting |
| `segmentations` | ✂ Scissors | Amber | Text segmentation rules |
| `annotations` | 😊 Smile | Yellow | Emoji annotations |
| `units` | 📦 Box | Lime | Unit formatting |
| `characterLabels` | T Type | Violet | Character labels |

### Files Modified

**`src/components/TreeView.tsx`**:
- Added `getSectionIcon()` function to map section names to icons and colors
- Updated `getNodeIcon()` to detect top-level CLDR sections and apply appropriate icons
- Modified `NodeRenderer` to use both icon and color from `getNodeIcon()`

**`src/components/CLDRMetadataPanel.tsx`**:
- Added `getSectionIcon()` function (matching TreeView)
- Updated section rendering to use section-specific icons
- Changed icon color to blue with hover effect

## Logic

### Section Detection

Icons are applied to top-level CLDR sections by checking the node path:

```typescript
const pathParts = node.path.split('/');
// Path format: /root/ldml/sectionName
// Check if path depth indicates top-level section (≤ 4 parts)
if (pathParts.length <= 4 && node.name) {
  const sectionIcon = getSectionIcon(node.name);
  if (sectionIcon.icon !== FileText) {
    return sectionIcon; // Return section icon with color
  }
}
```

### Default Fallback

Non-section nodes use default icons:
- **Elements**: Gray FileText icon
- **Comments**: Gray MessageSquare icon
- **CDATA**: Gray Code icon

## Visual Consistency

### Tree View
- Section nodes display colored icons matching their purpose
- Child nodes use gray default icons
- Icons are 16×16px (w-4 h-4)

### Metadata Panel
- Available sections show matching icons
- All icons are blue (matching theme)
- Hover effect darkens icon color
- Icons are 14×14px (w-3.5 h-3.5)

## User Benefits

1. **Quick Identification**: Users can instantly recognize section types by icon
2. **Visual Hierarchy**: Color-coded icons make the tree structure clearer
3. **Consistent UI**: Same icons appear in both tree and metadata panel
4. **Better Navigation**: Icons serve as visual landmarks when scrolling

## Technical Details

### Icon Library
Uses Lucide React icons for consistency with existing UI:
- Calendar, Hash, DollarSign, Globe, Type
- List, Quote, AlignLeft, FileCode, User
- Scissors, Smile, Box

### Color Palette
Tailwind CSS color classes:
- `text-orange-600`, `text-purple-600`, `text-green-600`
- `text-blue-600`, `text-indigo-600`, `text-teal-600`
- `text-pink-600`, `text-cyan-600`, `text-gray-600`
- `text-rose-600`, `text-amber-600`, `text-yellow-600`
- `text-lime-600`, `text-violet-600`

### Performance
- Icon selection is computed per render (lightweight lookup)
- No impact on tree performance
- Icons are tree-shakeable (only imported icons are bundled)

## Testing Checklist

- [x] Section icons display in tree view
- [x] Section icons display in metadata panel
- [x] Icons match between tree and metadata
- [x] Colors are distinct and recognizable
- [x] Default icons work for non-section nodes
- [x] Comments and CDATA show appropriate icons
- [x] Hover effects work in metadata panel
- [x] Icons render at correct sizes

## Examples

### Before
```
📄 <dates>
📄 <numbers>
📄 <currencies>
```

### After
```
📅 <dates>          (orange calendar)
# <numbers>         (purple hash)
$ <currencies>      (green dollar sign)
```

## Future Enhancements (Optional)

1. Add tooltip on icon hover showing section purpose
2. Add icon legend/help modal
3. Animate icon on section click
4. Custom icons for subsections (e.g., different calendar types)

---

**Status**: Feature complete and working ✅

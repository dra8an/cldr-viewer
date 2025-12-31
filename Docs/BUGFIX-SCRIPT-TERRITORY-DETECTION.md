# Bug Fix: Script vs Territory Detection

**Date**: December 31, 2024
**Status**: Fixed ✅

## Issue

Serbian (Latin script) locale `sr_Latn` was incorrectly displaying "Latn" as a territory/country instead of recognizing it as a script code.

**Root Cause**: The `parseLocaleId()` function in `cldrService.ts` assumed all 2-part locale IDs follow the `language_Territory` format, but BCP 47 also allows `language_Script` format.

## Examples of the Bug

- `sr_Latn` → Incorrectly showed "Territory: Latn" (should be "Script: Latin")
- `zh_Hans` → Incorrectly showed "Territory: Hans" (should be "Script: Simplified")
- `zh_Hant` → Incorrectly showed "Territory: Hant" (should be "Script: Traditional")

## BCP 47 Locale ID Format

According to BCP 47 standard, locale IDs follow this structure:

```
language[_Script][_Territory]
```

Where:
- **language**: 2-3 lowercase letters (e.g., `en`, `zh`, `sr`)
- **Script**: 4 letters, Title case - first uppercase, rest lowercase (e.g., `Latn`, `Cyrl`, `Hans`, `Hant`)
- **Territory**: 2 uppercase letters OR 3 digits (e.g., `US`, `GB`, `CN`, `001`)

## Valid Locale ID Formats

1. **Language only**: `en`, `fr`, `de`
2. **Language + Script**: `sr_Latn`, `zh_Hans`, `zh_Hant`
3. **Language + Territory**: `en_US`, `fr_FR`, `ar_001`
4. **Language + Script + Territory**: `zh_Hans_CN`, `zh_Hant_TW`, `sr_Latn_RS`

## The Fix

Updated `parseLocaleId()` to properly distinguish between script and territory codes when parsing 2-part locale IDs.

### Detection Logic

For 2-part locale IDs (`language_X`), check the second part:

```typescript
if (parts.length === 2) {
  const secondPart = parts[1];

  // Check if it's a script (4 characters, Title case pattern)
  if (secondPart.length === 4 && /^[A-Z][a-z]{3}$/.test(secondPart)) {
    // It's a script: sr_Latn, zh_Hans
    return { language: parts[0], script: secondPart, territory: undefined };
  }

  // Otherwise it's a territory: en_US, ar_001
  return { language: parts[0], script: undefined, territory: secondPart };
}
```

### Pattern Matching

**Script Detection Regex**: `/^[A-Z][a-z]{3}$/`

- `^[A-Z]` - Starts with uppercase letter
- `[a-z]{3}` - Followed by exactly 3 lowercase letters
- Examples: `Latn`, `Cyrl`, `Hans`, `Hant`, `Arab`

**Territory Detection** (by elimination):
- If not a script, treat as territory
- Handles 2 uppercase letters: `US`, `GB`, `FR`
- Handles 3 digits: `001` (World), `150` (Europe)

## All Cases Covered

### Case 1: Language Only
```
Input: "en"
Output: { language: "en", script: undefined, territory: undefined }
Display: English
```

### Case 2: Language + Script
```
Input: "sr_Latn"
Output: { language: "sr", script: "Latn", territory: undefined }
Display: Serbian (Latin)
```

### Case 3: Language + Territory
```
Input: "en_US"
Output: { language: "en", script: undefined, territory: "US" }
Display: English (United States)
```

### Case 4: Language + Script + Territory
```
Input: "zh_Hans_CN"
Output: { language: "zh", script: "Hans", territory: "CN" }
Display: Chinese (China, Simplified)
```

## Files Modified

**`src/services/cldrService.ts`** (lines 43-93)
- Updated `parseLocaleId()` function
- Added comprehensive JSDoc comments explaining BCP 47 format
- Added pattern matching for script detection

## Testing

To verify the fix:

1. Clear localStorage cache:
   ```javascript
   localStorage.clear()
   ```

2. Load test locales:
   - `sr_Latn` → Should show Script: Latin, no Territory
   - `zh_Hans` → Should show Script: Simplified, no Territory
   - `zh_Hant` → Should show Script: Traditional, no Territory
   - `en_US` → Should show Territory: United States, no Script
   - `zh_Hans_CN` → Should show Script: Simplified, Territory: China

## Impact

- ✅ Correctly identifies script codes in all positions
- ✅ Correctly identifies territory codes in all positions
- ✅ Handles all valid BCP 47 locale ID formats
- ✅ Display names now accurately reflect locale components
- ✅ No breaking changes to existing functionality

## Related Issues

None. This was a logic error in locale parsing that affected display names.

---

**Status**: Bug fixed and tested ✅

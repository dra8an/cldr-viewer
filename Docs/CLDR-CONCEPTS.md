# CLDR Concepts and Structure

## What is CLDR?

**CLDR (Common Locale Data Repository)** is the largest and most extensive standard repository of locale data available, maintained by the Unicode Consortium. It enables software to support the world's languages with culturally appropriate formatting and naming conventions.

### Used By
- Apple
- Google
- IBM
- Meta (Facebook)
- Microsoft
- And many other major tech companies

## Purpose

CLDR provides standardized, locale-specific data that applications need to:
- Format dates, times, and numbers correctly for different regions
- Display currency properly
- Show translated names for languages, countries, and territories
- Sort text according to local conventions
- Handle pluralization rules
- Display appropriate calendars and time zones

## Locale IDs - File Naming Convention

Each XML file in the CLDR repository represents a specific locale, identified by a standardized naming pattern:

### Format Structure

```
language[_Script][_Territory]
```

Where:
- **language** - Two or three-letter ISO 639 language code (required)
- **Script** - Four-letter ISO 15924 script code (optional)
- **Territory** - Two-letter ISO 3166 country/region code (optional)

### Examples

| File Name | Language | Script | Territory | Description |
|-----------|----------|--------|-----------|-------------|
| `en.xml` | English | - | - | Generic English |
| `en_US.xml` | English | - | United States | American English |
| `en_GB.xml` | English | - | United Kingdom | British English |
| `fr_CA.xml` | French | - | Canada | Canadian French |
| `zh_Hans.xml` | Chinese | Simplified | - | Simplified Chinese |
| `zh_Hant_HK.xml` | Chinese | Traditional | Hong Kong | Traditional Chinese (Hong Kong) |
| `sr_Cyrl.xml` | Serbian | Cyrillic | - | Serbian in Cyrillic script |
| `sr_Latn.xml` | Serbian | Latin | - | Serbian in Latin script |
| `az_Arab_IR.xml` | Azerbaijani | Arabic | Iran | Azerbaijani in Arabic script (Iran) |
| `pt_BR.xml` | Portuguese | - | Brazil | Brazilian Portuguese |
| `es_MX.xml` | Spanish | - | Mexico | Mexican Spanish |

### Understanding the Parts

**Language Codes** (ISO 639):
- `en` = English
- `fr` = French
- `de` = German
- `zh` = Chinese
- `ar` = Arabic
- `ja` = Japanese
- `ru` = Russian
- `es` = Spanish

**Script Codes** (ISO 15924):
- `Hans` = Simplified Chinese characters
- `Hant` = Traditional Chinese characters
- `Cyrl` = Cyrillic alphabet
- `Latn` = Latin alphabet
- `Arab` = Arabic script

**Territory Codes** (ISO 3166):
- `US` = United States
- `GB` = United Kingdom
- `CA` = Canada
- `CN` = China
- `JP` = Japan
- `DE` = Germany
- `FR` = France
- `MX` = Mexico

## XML File Structure

CLDR files use **LDML (Locale Data Markup Language)** format, defined in [UTS #35](http://unicode.org/reports/tr35/).

### Main XML Sections

#### 1. Identity
Defines the locale metadata:
```xml
<identity>
  <version number="$Revision$"/>
  <language type="sr"/>
  <script type="Cyrl"/>
  <territory type="RS"/>
</identity>
```

#### 2. LocaleDisplayNames
Translations of language, script, and territory names:
```xml
<localeDisplayNames>
  <languages>
    <language type="en">енглески</language>
    <language type="fr">француски</language>
    <language type="de">немачки</language>
  </languages>

  <scripts>
    <script type="Cyrl">ћирилица</script>
    <script type="Latn">латиница</script>
  </scripts>

  <territories>
    <territory type="US">Сједињене Америчке Државе</territory>
    <territory type="DE">Немачка</territory>
    <territory type="FR">Француска</territory>
  </territories>
</localeDisplayNames>
```

#### 3. Characters
Character sets and exemplar characters:
```xml
<characters>
  <exemplarCharacters>[а б в г д ђ е ж з и ј к л љ м н њ о п р с т ћ у ф х ц ч џ ш]</exemplarCharacters>
  <exemplarCharacters type="index">[А Б В Г Д Ђ Е Ж З И Ј К Л Љ М Н Њ О П Р С Т Ћ У Ф Х Ц Ч Џ Ш]</exemplarCharacters>
  <exemplarCharacters type="punctuation">[‐ – — , ; \: ! ? . … ' " „ ( ) \[ \] § @ * / \&amp; # † ‡ ′ ″]</exemplarCharacters>
</characters>
```

#### 4. Dates
Calendar, date, and time formatting:
```xml
<dates>
  <calendars>
    <calendar type="gregorian">
      <months>
        <monthContext type="format">
          <monthWidth type="wide">
            <month type="1">јануар</month>
            <month type="2">фебруар</month>
            <month type="3">март</month>
            <!-- ... -->
          </monthWidth>
        </monthContext>
      </months>

      <days>
        <dayContext type="format">
          <dayWidth type="wide">
            <day type="sun">недеља</day>
            <day type="mon">понедељак</day>
            <day type="tue">уторак</day>
            <!-- ... -->
          </dayWidth>
        </dayContext>
      </days>

      <dateFormats>
        <dateFormatLength type="full">
          <dateFormat>
            <pattern>EEEE, d. MMMM y.</pattern>
          </dateFormat>
        </dateFormatLength>
      </dateFormats>
    </calendar>
  </calendars>
</dates>
```

#### 5. Numbers
Number formatting patterns:
```xml
<numbers>
  <symbols numberSystem="latn">
    <decimal>,</decimal>
    <group>.</group>
    <list>;</list>
    <percentSign>%</percentSign>
    <plusSign>+</plusSign>
    <minusSign>-</minusSign>
  </symbols>

  <decimalFormats numberSystem="latn">
    <decimalFormatLength>
      <decimalFormat>
        <pattern>#,##0.###</pattern>
      </decimalFormat>
    </decimalFormatLength>
  </decimalFormats>

  <currencyFormats numberSystem="latn">
    <currencyFormatLength>
      <currencyFormat type="standard">
        <pattern>#,##0.00 ¤</pattern>
      </currencyFormat>
    </currencyFormatLength>
  </currencyFormats>
</numbers>
```

#### 6. Delimiters
Quotation marks and delimiters:
```xml
<delimiters>
  <quotationStart>„</quotationStart>
  <quotationEnd>"</quotationEnd>
  <alternateQuotationStart">‚</alternateQuotationStart>
  <alternateQuotationEnd">'</alternateQuotationEnd>
</delimiters>
```

## Common Data Types in CLDR

### 1. Display Names
- **Languages**: How language names appear (e.g., "English" vs "Englisch" vs "英语")
- **Countries/Territories**: Localized country names
- **Scripts**: Writing system names
- **Currencies**: Currency names and symbols
- **Time Zones**: Time zone display names

### 2. Date and Time Formatting
- **Month Names**: Full, abbreviated, narrow forms
- **Day Names**: Weekday names in various formats
- **Era Names**: BCE/CE, BC/AD equivalents
- **Date Patterns**: How to format dates (MM/DD/YYYY vs DD.MM.YYYY)
- **Time Patterns**: 12-hour vs 24-hour formats
- **Calendar Systems**: Gregorian, Islamic, Hebrew, etc.

### 3. Number Formatting
- **Decimal Separator**: `.` (US) vs `,` (Europe)
- **Grouping Separator**: `,` (US) vs `.` (Europe) vs `'` (Switzerland)
- **Currency Symbols**: $, €, £, ¥, etc.
- **Percent/Permille Signs**
- **Number Patterns**: Positive/negative formatting

### 4. Linguistic Information
- **Plural Rules**: Different languages have different plural forms
- **Collation**: Sorting order (e.g., Swedish å comes after z)
- **Text Direction**: LTR vs RTL
- **Character Sets**: Letters used in the language
- **Capitalization Rules**: Sentence/word capitalization conventions

### 5. Measurement Systems
- **Units**: Imperial vs Metric preferences
- **Paper Sizes**: Letter vs A4
- **Temperature**: Celsius vs Fahrenheit

## Repository Structure

```
cldr/
├── common/
│   ├── main/              # Locale-specific data (1000+ files)
│   │   ├── en.xml
│   │   ├── en_US.xml
│   │   ├── fr_FR.xml
│   │   └── ...
│   ├── annotations/       # Emoji and symbol names
│   ├── bcp47/            # Language tag information
│   ├── casing/           # Capitalization rules
│   ├── collation/        # Sorting rules
│   ├── rbnf/             # Number formatting rules
│   ├── segments/         # Text segmentation
│   ├── supplemental/     # Data spanning multiple locales
│   └── ...
```

## How CLDR is Used

### By Developers
1. **Indirectly** - Through libraries like:
   - ICU (International Components for Unicode)
   - Java's `java.text`, `java.util`
   - JavaScript's `Intl` API
   - Python's `babel` library
   - .NET's globalization classes

2. **Directly** - By:
   - Parsing XML files for custom applications
   - Building internationalization tools
   - Creating locale-aware software

### Example Use Cases
- **E-commerce**: Display prices in local currency format
- **Social Media**: Show dates/times in user's preferred format
- **Maps**: Display country/city names in local language
- **Operating Systems**: System-wide localization
- **Mobile Apps**: Multi-language support
- **Web Applications**: Internationalization (i18n)

## CLDR Data Coverage

As of recent versions, CLDR covers:
- **700+** languages
- **250+** territories/regions
- **100+** scripts/writing systems
- **1000+** distinct locale combinations

## Key Concepts Summary

| Concept | Description | Example |
|---------|-------------|---------|
| **Locale** | Combination of language, script, and territory | `en_US`, `zh_Hans_CN` |
| **Language Code** | ISO 639 identifier | `en`, `fr`, `zh` |
| **Script Code** | ISO 15924 writing system | `Hans`, `Cyrl`, `Arab` |
| **Territory Code** | ISO 3166 country/region | `US`, `GB`, `CN` |
| **LDML** | XML format for locale data | UTS #35 standard |
| **Exemplar Characters** | Characters used in a language | `[a-z]` for English |
| **Collation** | Sorting/ordering rules | Swedish å after z |
| **Plural Rules** | Grammar for quantities | English: 1 book, 2 books |

## Why CLDR Matters for Your XML Viewer

Since you're building an XML viewer and the CLDR files are XML-based:

1. **Perfect Use Case**: CLDR files are excellent test data for your viewer
2. **Complex Structure**: They demonstrate real-world, complex XML with deep nesting
3. **Rich Attributes**: Extensive use of attributes (type, alt, draft, etc.)
4. **Various Data Types**: Numbers, dates, text, symbols
5. **Large Files**: Some locale files are quite large, good for performance testing
6. **Practical Application**: Understanding CLDR helps with internationalization

## Resources

- **Official Website**: https://cldr.unicode.org/
- **GitHub Repository**: https://github.com/unicode-org/cldr
- **LDML Specification**: http://unicode.org/reports/tr35/
- **Locale Data**: https://github.com/unicode-org/cldr/tree/main/common/main

---

**Your XML Viewer is perfect for exploring CLDR files!** You can load any `.xml` file from the CLDR repository to understand locale-specific data for different languages and regions.

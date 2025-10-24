# HTML Type Utilities

This directory contains utility functions for handling HTML attribute values with type safety. Each utility implements the `ObservableOptions` interface to provide consistent conversion between JavaScript values and HTML attributes.

## Available Utilities

- `HtmlBoolean` - Handles boolean values
- `HtmlNumber` - Handles numeric values
- `HtmlBigInt` - Handles BigInt values
- `HtmlDate` - Handles Date values
- `HtmlObject` - Handles Object values (serialized as JSON)
- `HtmlLength` - Handles CSS length values (px, em, rem, %, etc.)
- `HtmlBox` - Handles CSS box values (margin, padding, border, etc.)
- `HtmlColor` - Handles CSS color values (hex, rgb, etc.)
- `HtmlStyle` - Handles CSS style values (objects and strings)

## Common Patterns

All HTML utilities follow a consistent pattern:

1. **Type Safety**: Each utility implements the `ObservableOptions<T>` interface
2. **Empty String Handling**: All utilities treat empty strings as `undefined`
3. **Bidirectional Conversion**: Each utility provides both `toHtml` and `fromHtml` methods
4. **Equality Checking**: Each utility implements an `equals` function for value comparison
5. **Comprehensive Documentation**: Each utility has detailed comments explaining its behavior

## Empty String Handling

All HTML utilities consistently handle empty strings by:
1. Returning `undefined` when parsing an empty string
2. Converting `undefined` values to empty strings in `toHtml` methods

This ensures consistent behavior across all HTML attribute types.

## Date Parsing

The `HtmlDate` utility specifically handles various date formats:
- ISO date strings
- Timestamp numbers and numeric strings (e.g. "2141512551")
- Custom date formats (e.g. "2025 Oct ....")
- Date objects

Invalid dates and empty strings are treated as `undefined`.

## CSS Value Handling

The CSS-related utilities (`HtmlLength`, `HtmlBox`, `HtmlColor`, `HtmlStyle`) provide specialized parsing for CSS values:
- `HtmlLength` handles CSS length units and keywords, treating plain numbers as pixels
- `HtmlBox` handles CSS box model values (margin, padding, border), treating plain numbers as pixels
- `HtmlColor` handles CSS color formats (hex, RGB)
- `HtmlStyle` handles CSS style objects and strings

All CSS utilities treat empty strings as `undefined` for consistent behavior.
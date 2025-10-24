version: 15.1.14
- Features:
  * Automatic resolution, HTML conversion, and improved type checking for observables.
  * Added `toHtml` and `fromHtml` options to `ObservableOptions` for HTML conversion.
  * Enhanced `valueOf()` and `toString()` methods for observable functions to automatically resolve their values using `deepResolve()`.
  * Added `verboseComment` and `contextComment` to the `DEBUGGER` object for more detailed debugging.
- Refactorings:
  * Moved `SUPER_OWNER`, `OWNER`, and `setOwner` to `src/objects/superroot.ts` to fix circular dependencies.
  * Updated import paths for `OWNER` in several files.

version: 15.1.13
- Features:
  * Added runtime type checking to Observables via a new `type` option in `ObservableOptions`.
  * Improved observable type inference and fixed `Root.wrap`.
  * Added runtime type checking and fixed `Root.wrap` for observables.
- Bug Fixes:
  * Fixed a link in `readme.md` from `vobyjs/soby` to `wobyjs/soby`.
  * Improved type checking logic in `src/objects/observable.ts` to re-throw `TypeError` exceptions.
  * Corrected the `wrap` method in `src/objects/root.ts` to properly pass `stack` and `dispose` parameters.
- Refactorings:
  * Changed `commit` script in `package.json` from `pnpm bump && pnpm push` to `pnpm bump && git push`.

Generated using @missb/git-changelog
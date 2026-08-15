/*
Remove:
  emitBrowserEntries
  emittedBrowser
  ensureOutputDirectories(planned.entriesOutput)
  entry snapshot logic

Pipeline becomes:
resolve -> evaluate -> IR -> validate -> expand -> plan -> validate-plan
-> prepare AOT -> bundle -> finalize -> validate-delivery -> publish
*/
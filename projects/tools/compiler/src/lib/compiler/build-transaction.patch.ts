/*
Remove entry publication and entry snapshots from WaypointBuildTransaction.

Delete:
  snapshotDirectory(planned.entriesOutput)
  emitBrowserEntries(...)
  entry snapshot restore/discard

The transaction should snapshot/publish only physical deployment outputs.
*/
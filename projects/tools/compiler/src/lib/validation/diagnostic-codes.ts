export const NavigationDiagnosticCode = {
  invalidIrVersion: 'NAV1000',
  invalidIrReference: 'NAV1001',
  invalidIrRange: 'NAV1002',

  invalidPath: 'NAV1100',
  duplicatePathParameter: 'NAV1101',
  schemaParameterMissingFromPath: 'NAV1200',
  optionalPathParameterSchema: 'NAV1201',
  invalidNumberSchemaRange: 'NAV1202',
  invalidNumberSchemaDefault: 'NAV1203',

  duplicateRouteName: 'NAV1300',
  duplicateRoutePath: 'NAV1301',
  conflictingRoutePattern: 'NAV1302',

  duplicateOutlet: 'NAV1400',
  redirectWithOutlets: 'NAV1401',

  duplicateSlot: 'NAV1500',
  unknownRouteSlot: 'NAV1501',
  multipleRouteSetOwners: 'NAV1502',
  duplicateRouteSetIdentity: 'NAV1503',
  missingRouteSetExport: 'NAV1504',
} as const;

export type NavigationDiagnosticCode =
  typeof NavigationDiagnosticCode[keyof typeof NavigationDiagnosticCode];

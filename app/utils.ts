// This converts serialized dates back into date objects
export function parseJsonAndReviveDate(data: any) {
  return {
    ...data,
    journalEntries: data.journalEntries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    })),
  };
}

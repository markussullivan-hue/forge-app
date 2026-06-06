// Shared helper used by every read-only wizard lookup function.
// Executes the SQL against forge_supabase_shadow and returns rows verbatim.

export async function runLookup<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await forgeSupabaseShadow2.query<T>(sql, params)
  return result.data
}

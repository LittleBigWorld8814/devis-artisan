import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('artisans').select('*')

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Devis Artisan</h1>
      {error ? (
        <p style={{ color: "red" }}>Erreur : {error.message}</p>
      ) : (
        <p style={{ color: "green" }}>✅ Supabase connecté ! ({data.length} artisans)</p>
      )}
    </main>
  )
}
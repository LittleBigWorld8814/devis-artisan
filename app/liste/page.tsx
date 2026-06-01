'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { PDFDownloadLink } from '@react-pdf/renderer'
import DevisPDF from '@/components/DevisPDF'
import { useRouter } from 'next/navigation'

type Ligne = {
  description: string
  quantite: number
  prix_unitaire: number
  total: number
}

type Devis = {
  id: string
  numero: string
  notes: string
  total: number
  statut: string
  date_creation: string
  lignes_devis: Ligne[]
}

export default function ListeDevis() {
  const [devis, setDevis] = useState<Devis[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const charger = async () => {
      // Vérifier si connecté
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/connexion')
        return
      }

      const { data, error } = await supabase
        .from('devis')
        .select('*, lignes_devis(*)')
        .order('created_at', { ascending: false })

      if (!error && data) setDevis(data)
      setLoading(false)
    }
    charger()
  }, [router])

  return (
    <main style={{ maxWidth: '700px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Mes devis</h1>
        <Link
          href="/devis"
          style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', borderRadius: '4px', textDecoration: 'none' }}
        >
          + Nouveau devis
        </Link>
      </div>

      {loading && <p>Chargement...</p>}

      {!loading && devis.length === 0 && (
        <p style={{ color: '#666', textAlign: 'center', marginTop: '3rem' }}>
          Aucun devis pour l'instant.<br />
          <Link href="/devis" style={{ color: '#0070f3' }}>Créer votre premier devis</Link>
        </p>
      )}

      {devis.map(d => (
        <div
          key={d.id}
          style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{d.numero}</div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>{d.notes || 'Sans client'}</div>
            <div style={{ color: '#999', fontSize: '0.8rem' }}>{d.date_creation}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{Number(d.total).toFixed(2)} €</div>
            <div style={{
              display: 'inline-block',
              marginTop: '0.25rem',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              background: d.statut === 'brouillon' ? '#f0f0f0' : '#d4edda',
              color: d.statut === 'brouillon' ? '#666' : '#155724'
            }}>
              {d.statut}
            </div>
          </div>
            <PDFDownloadLink
            document={
                <DevisPDF
                numero={d.numero}
                client={d.notes || 'Sans client'}
                date={d.date_creation}
                lignes={d.lignes_devis || []}
                total={Number(d.total)}
                />
            }
            fileName={`${d.numero}.pdf`}
            style={{
                display: 'block',
                marginTop: '0.5rem',
                padding: '4px 10px',
                background: '#e8f4fd',
                color: '#0070f3',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                textAlign: 'center'
            }}
            >
            {({ loading }) => loading ? 'Génération...' : '⬇ Télécharger PDF'}
            </PDFDownloadLink>
        </div>
      ))}
    </main>
  )
}
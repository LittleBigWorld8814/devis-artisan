'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Ligne = {
  description: string
  quantite: number
  prix_unitaire: number
}

export default function NouveauDevis() {
  const [client, setClient] = useState('')
  const [lignes, setLignes] = useState<Ligne[]>([
    { description: '', quantite: 1, prix_unitaire: 0 }
  ])

  const ajouterLigne = () => {
    setLignes(prev => [...prev, { description: '', quantite: 1, prix_unitaire: 0 }])
  }

  const modifierLigne = (index: number, champ: keyof Ligne, valeur: string) => {
    setLignes(prev => prev.map((ligne, i) => {
      if (i !== index) return ligne
      return {
        ...ligne,
        [champ]: champ === 'description' ? valeur : parseFloat(valeur) || 0
      }
    }))
  }

  const total = lignes.reduce((sum, l) => sum + (l.quantite * l.prix_unitaire), 0)

  const sauvegarder = async () => {
    const { data: devisData, error: devisError } = await supabase
      .from('devis')
      .insert({
        numero: `DEV-${Date.now()}`,
        notes: client,
        total: total
      })
      .select()
      .single()

    if (devisError) {
      alert('Erreur : ' + devisError.message)
      return
    }

    const lignesAInserer = lignes
      .filter(l => l.description.trim() !== '')
      .map(l => ({
        devis_id: devisData.id,
        description: l.description,
        quantite: l.quantite,
        prix_unitaire: l.prix_unitaire,
        total: l.quantite * l.prix_unitaire
      }))

    const { error: lignesError } = await supabase
      .from('lignes_devis')
      .insert(lignesAInserer)

    if (lignesError) {
      alert('Erreur lignes : ' + lignesError.message)
      return
    }

    alert('Devis sauvegardé avec toutes les lignes !')
    setClient('')
    setLignes([{ description: '', quantite: 1, prix_unitaire: 0 }])
  }

  return (
    <main style={{ maxWidth: '700px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Nouveau devis</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Nom du client
        </label>
        <input
          type="text"
          value={client}
          onChange={e => setClient(e.target.value)}
          placeholder="Ex: Martin Dupont"
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Travaux</h2>

      {lignes.map((ligne, i) => (
        <div key={i} style={{ marginBottom: '0.75rem', padding: '0.75rem', border: '1px solid #eee', borderRadius: '4px' }}>
          <input
            type="text"
            placeholder="Description des travaux"
            value={ligne.description}
            onChange={e => modifierLigne(i, 'description', e.target.value)}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '0.5rem', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>Quantité</label>
              <input
                type="number"
                min="0"
                value={ligne.quantite}
                onChange={e => modifierLigne(i, 'quantite', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>Prix unitaire (€)</label>
              <input
                type="number"
                min="0"
                value={ligne.prix_unitaire}
                onChange={e => modifierLigne(i, 'prix_unitaire', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%', padding: '0.5rem', background: '#f9f9f9', borderRadius: '4px', textAlign: 'right' }}>
                {(ligne.quantite * ligne.prix_unitaire).toFixed(2)} €
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={ajouterLigne}
        style={{ padding: '0.5rem 1rem', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem' }}
      >
        + Ajouter une ligne
      </button>

      <div style={{ textAlign: 'right', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '4px' }}>
        Total : {total.toFixed(2)} €
      </div>

      <button
        onClick={sauvegarder}
        style={{ width: '100%', padding: '0.75rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}
      >
        Sauvegarder le devis
      </button>
    </main>
  )
}
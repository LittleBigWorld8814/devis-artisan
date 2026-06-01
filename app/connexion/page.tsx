'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Connexion() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)

  const seConnecter = async () => {
    setLoading(true)
    setErreur('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErreur('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    router.push('/liste')
  }

  return (
    <main style={{ maxWidth: '400px', margin: '4rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Connexion</h1>

      {erreur && (
        <div style={{ background: '#fee', border: '1px solid #fcc', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', color: '#c00' }}>
          {erreur}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="jean@example.com"
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Votre mot de passe"
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      <button
        onClick={seConnecter}
        disabled={loading}
        style={{ width: '100%', padding: '0.75rem', background: loading ? '#ccc' : '#0070f3', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>

      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
        Pas encore de compte ?{' '}
        <Link href="/inscription" style={{ color: '#0070f3' }}>S'inscrire</Link>
      </p>
    </main>
  )
}
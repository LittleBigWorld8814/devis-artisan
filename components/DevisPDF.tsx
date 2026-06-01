import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#333',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#0070f3',
    paddingBottom: 15,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0070f3',
    marginBottom: 4,
  },
  numero: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitre: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0070f3',
  },
  client: {
    fontSize: 12,
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  colDescription: { flex: 3 },
  colQuantite: { flex: 1, textAlign: 'center' },
  colPrix: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right' },
  totalSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalBox: {
    backgroundColor: '#0070f3',
    padding: 12,
    borderRadius: 4,
    width: 200,
  },
  totalTexte: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#999',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
})

type Ligne = {
  description: string
  quantite: number
  prix_unitaire: number
  total: number
}

type Props = {
  numero: string
  client: string
  date: string
  lignes: Ligne[]
  total: number
}

export default function DevisPDF({ numero, client, date, lignes, total }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titre}>DEVIS</Text>
          <Text style={styles.numero}>{numero}</Text>
          <Text style={styles.numero}>Date : {date}</Text>
        </View>

        {/* Client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Client</Text>
          <Text style={styles.client}>{client}</Text>
        </View>

        {/* Tableau des travaux */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Détail des travaux</Text>

          {/* En-tête tableau */}
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>Description</Text>
            <Text style={styles.colQuantite}>Qté</Text>
            <Text style={styles.colPrix}>Prix unit.</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {/* Lignes */}
          {lignes.map((ligne, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDescription}>{ligne.description}</Text>
              <Text style={styles.colQuantite}>{ligne.quantite}</Text>
              <Text style={styles.colPrix}>{ligne.prix_unitaire.toFixed(2)} €</Text>
              <Text style={styles.colTotal}>{ligne.total.toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <Text style={styles.totalTexte}>Total : {total.toFixed(2)} €</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Document généré par DevisArtisan — www.devisartisan.be
        </Text>

      </Page>
    </Document>
  )
}
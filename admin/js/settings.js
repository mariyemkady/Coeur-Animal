 import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

    const supabase = createClient(
      'https://rubzhlaneukyavgfkyyz.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YnpobGFuZXVreWF2Z2ZreXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjcxMTEsImV4cCI6MjA2OTU0MzExMX0._swHuRvo0WSpXCLpXvCI5oS7xDZlcDL1LEDz16BJmNM'
    )
const { data, error } = await supabase.from('settings').select('*').single();

console.log({ data, error });
const form = document.getElementById('settings-form')
const nom_fr = document.getElementById('nom_fr')
const nom_ar = document.getElementById('nom_ar')
const logo_url = document.getElementById('logo_url')


let settingsId = null

// Charger les paramètres existants
async function loadSettings() {
  // On prend la première ligne (limit 1)
  const { data, error } = await supabase.from('settings').select('*').limit(1).single()

  if (error) {
    console.error("Erreur lors du chargement des paramètres:", error)
    alert("Erreur lors du chargement des paramètres. Voir console.")
    return null
  }

  if (!data) {
    console.warn("Aucun paramètre trouvé dans la table 'settings'.")
    alert("Aucun paramètre trouvé dans la base de données. Veuillez ajouter un enregistrement manuellement.")
    return null
  }

  nom_fr.value = data.nom_fr || ''
  nom_ar.value = data.nom_ar || ''
  logo_url.value = data.logo_url || ''
 

  return data.id
}


// Initialiser
loadSettings().then(id => {
  if (id) {
    settingsId = id
  } else {
    settingsId = null
  }
})

// Gestion du submit
form.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (!settingsId) {
    alert("ID des paramètres introuvable. Veuillez vérifier la base de données.")
    return
  }

  const { data, error } = await supabase.from('settings').update({
    nom_fr: nom_fr.value,
    nom_ar: nom_ar.value,
    logo_url: logo_url.value,
  }).eq('id', settingsId)

  if (error) {
    alert('Erreur lors de la mise à jour : ' + error.message)
  } else {
    alert('Paramètres mis à jour avec succès ✅')
  }
})

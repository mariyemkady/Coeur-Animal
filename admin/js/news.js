   import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

    const supabase = createClient(
      'https://rubzhlaneukyavgfkyyz.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YnpobGFuZXVreWF2Z2ZreXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjcxMTEsImV4cCI6MjA2OTU0MzExMX0._swHuRvo0WSpXCLpXvCI5oS7xDZlcDL1LEDz16BJmNM'
    )

// العناصر
const form = document.getElementById('add-news-form');
const list = document.getElementById('news-list');

// عرض القائمة
async function fetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('date_publication', { ascending: false });

  if (error) {
    alert('Erreur de chargement');
    return;
  }

  list.innerHTML = '';
  data.forEach(news => {
    const row = document.createElement('tr');
row.innerHTML = `
  <td>${news.titre_fr}</td>
  <td>${news.titre_ar}</td>
  <td>${news.date_publication}</td>
  <td>${news.categorie || ''}</td>
  <td>
    ${news.image_url
      ? `<img src="${news.image_url}" alt="Image actu" style="width: 80px; height: auto; border-radius: 4px;" loading="lazy">`
      : `<span style="color: gray;">Pas d'image</span>`}
  </td>
  <td>
    <button onclick="editNews('${news.id}')">✏️ Modifier</button>
    <button onclick="deleteNews('${news.id}')">🗑️ Supprimer</button>
  </td>
`;

    list.appendChild(row);
  });
}

// إضافة أو تعديل
form.addEventListener('submit', async (e) => {
  e.preventDefault();

const newsData = {
  titre_fr: form.titre_fr.value.trim(),
  titre_ar: form.titre_ar.value.trim(),
  contenu_fr: form.contenu_fr.value.trim(),
  contenu_ar: form.contenu_ar.value.trim(),
  date_publication: form.date_publication.value,
  categorie: form.categorie.value.trim(),
  image_url: form.image_url.value.trim(),
  url: form.url.value.trim()  // <-- ajoute cette ligne
};


  const id = form.getAttribute('data-id');

  if (id) {
    const { error } = await supabase.from('news').update(newsData).eq('id', id);
    if (error) {
      alert("Erreur lors de la modification");
    } else {
      alert("Actualité modifiée");
      form.removeAttribute('data-id');
      form.reset();
      fetchNews();
    }
  } else {
    const { error } = await supabase.from('news').insert(newsData);
    if (error) {
      alert('Erreur : ' + error.message);
    } else {
      alert('Actualité ajoutée');
      form.reset();
      fetchNews();
    }
  }
});

// تعديل
window.editNews = async (id) => {
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
  if (error) {
    alert("Erreur lors du chargement de l'actualité");
    return;
  }

  form.titre_fr.value = data.titre_fr;
  form.titre_ar.value = data.titre_ar;
  form.contenu_fr.value = data.contenu_fr;
  form.contenu_ar.value = data.contenu_ar;
  form.date_publication.value = data.date_publication;
  form.categorie.value = data.categorie;
  form.image_url.value = data.image_url;

  form.setAttribute('data-id', id);
};

// حذف
window.deleteNews = async (id) => {
  if (!confirm('هل أنت متأكد من الحذف ؟')) return;
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) {
    alert('Erreur lors de la suppression');
  } else {
    fetchNews();
  }
};

// تحميل أولي
fetchNews();

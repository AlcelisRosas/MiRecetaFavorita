// Elementos del DOM
const form = document.getElementById('recipeForm');
const recipeList = document.getElementById('recipeList');
const filterSelect = document.getElementById('filterIngredient');

// Cargar recetas guardadas desde localStorage
let recetas = JSON.parse(localStorage.getItem('recetas')) || [];

// Función para guardar recetas en localStorage
function guardarRecetas() {
  localStorage.setItem('recetas', JSON.stringify(recetas));
}

// Renderizar la lista de recetas
function renderizarRecetas(filtro = '') {
  recipeList.innerHTML = '';
  const filtradas = filtro ? recetas.filter(r => r.ingrediente.toLowerCase() === filtro.toLowerCase()) : recetas;
  
  filtradas.forEach((receta, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${receta.nombre}</strong> (${receta.ingrediente})<br/>
      <button onclick="verDetalles(${index})">Ver Detalles</button>
      <button onclick="eliminarReceta(${index})">Eliminar</button>
    `;
    recipeList.appendChild(li);
  });

  actualizarFiltro();
}

// Mostrar detalles en un alert (simple y didáctico)
function verDetalles(index) {
  const r = recetas[index];
  alert(`Ingredientes:\n${r.ingredientes.join(', ')}\n\nPasos:\n${r.pasos}`);
}

// Eliminar receta
function eliminarReceta(index) {
  if (confirm("¿Eliminar esta receta?")) {
    recetas.splice(index, 1);
    guardarRecetas();
    renderizarRecetas(filterSelect.value);
  }
}

// Agregar receta
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const nuevaReceta = {
    nombre: document.getElementById('recipeName').value.trim(),
    ingrediente: document.getElementById('mainIngredient').value.trim(),
    ingredientes: document.getElementById('ingredients').value.split(',').map(i => i.trim()),
    pasos: document.getElementById('steps').value.trim()
  };

  // Validaciones básicas
  if (!nuevaReceta.nombre || !nuevaReceta.ingrediente || nuevaReceta.ingredientes.length === 0 || !nuevaReceta.pasos) {
    alert("Por favor completa todos los campos.");
    return;
  }

  recetas.push(nuevaReceta);
  guardarRecetas();
  renderizarRecetas(filterSelect.value);
  form.reset();
});

// Actualizar opciones del filtro
function actualizarFiltro() {
  const ingredientesUnicos = [...new Set(recetas.map(r => r.ingrediente))];
  filterSelect.innerHTML = '<option value="">-- Filtrar por ingrediente --</option>';
  ingredientesUnicos.forEach(i => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = i;
    filterSelect.appendChild(opt);
  });
}

// Filtrar recetas
filterSelect.addEventListener('change', () => {
  renderizarRecetas(filterSelect.value);
});

// Inicial
renderizarRecetas();

import '../css/input.css';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const cardList = document.getElementById('card-list');
  const cardFilter = document.getElementById('card-filter');
  const foodTypeFilter = document.getElementById('food-type-filter');
  const tagFilter = document.getElementById('tag-filter');
  const typeFilter = document.getElementById('type-filter');
  const openSettingsBtn = document.getElementById('open-settings-btn');

  // Modal Elements
  const recipeModal = document.getElementById('recipe-modal');
  const openModalBtn = document.getElementById('open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const recipeModalTitle = document.getElementById('recipe-modal-title');
  const modalStep1 = document.getElementById('modal-step-1');
  const modalStep2 = document.getElementById('modal-step-2');
  const backToStep1Btn = document.getElementById('back-to-step-1');

  // Tab Elements
  const tabUrlBtn = document.getElementById('tab-url-btn');
  const tabUploadBtn = document.getElementById('tab-upload-btn');
  const tabUrlContent = document.getElementById('tab-url-content');
  const tabUploadContent = document.getElementById('tab-upload-content');

  // Input Elements
  const urlInput = document.getElementById('url-input');
  const screenshotInput = document.getElementById('screenshot-input');
  const fileNameDisplay = document.getElementById('file-name-display');
  const previewUrlBtn = document.getElementById('preview-url-btn');
  const previewUploadBtn = document.getElementById('preview-upload-btn');

  // Edit Elements
  const editTitle = document.getElementById('edit-title');
  const editType = document.getElementById('edit-type');
  const editFoodType = document.getElementById('edit-food-type');
  const editTagsContainer = document.getElementById('edit-tags-container');
  const editIngredients = document.getElementById('edit-ingredients');
  const editText = document.getElementById('edit-text');
  const editInstructions = document.getElementById('edit-instructions');
  const previewImage = document.getElementById('preview-image');
  const previewImageContainer = document.getElementById('preview-image-container');
  const previewTextContainer = document.getElementById('preview-text-container');
  const previewInstructionsContainer = document.getElementById('preview-instructions-container');
  const saveRecipeBtn = document.getElementById('save-recipe-btn');

  // Detail Modal Elements
  const detailModal = document.getElementById('detail-modal');
  const closeDetailBtn = document.getElementById('close-detail-btn');
  const closeDetailFooterBtn = document.getElementById('close-detail-footer-btn');
  const detailTitle = document.getElementById('detail-title');
  const detailImage = document.getElementById('detail-image');
  const detailImageContainer = document.getElementById('detail-image-container');
  const detailUrl = document.getElementById('detail-url');
  const detailUrlText = document.getElementById('detail-url-text');
  const detailUrlContainer = document.getElementById('detail-url-container');
  const detailPdfLink = document.getElementById('detail-pdf-link');
  const detailPdfContainer = document.getElementById('detail-pdf-container');
  const detailRawText = document.getElementById('detail-raw-text');
  const detailRawTextContainer = document.getElementById('detail-raw-text-container');
  const detailIngredients = document.getElementById('detail-ingredients');
  const detailIngredientsContainer = document.getElementById('detail-ingredients-container');
  const detailInstructions = document.getElementById('detail-instructions');
  const detailInstructionsContainer = document.getElementById('detail-instructions-container');

  const detailTabbedContent = document.getElementById('detail-tabbed-content');
  const detailTabRecipe = document.getElementById('detail-tab-recipe');
  const detailTabEdit = document.getElementById('detail-tab-edit');
  const detailRecipePanel = document.getElementById('detail-recipe-panel');
  const detailEditPanel = document.getElementById('detail-edit-panel');
  const detailManage = document.getElementById('detail-manage');
  const viewFooterActions = document.getElementById('view-footer-actions');
  const editFooterActions = document.getElementById('edit-footer-actions');
  const manageFooterActions = document.getElementById('manage-footer-actions');

  const inlineEditBtn = document.getElementById('inline-edit-btn');
  const inlineManageBtn = document.getElementById('inline-manage-btn');
  const inlineManageBtnEdit = document.getElementById('inline-manage-btn-edit');
  const inlineSaveBtn = document.getElementById('inline-save-btn');
  const inlineCancelBtn = document.getElementById('inline-cancel-btn');
  const inlineBackBtn = document.getElementById('inline-back-btn');
  const inlineDeleteBtn = document.getElementById('inline-delete-btn');

  const inlineEditTitle = document.getElementById('inline-edit-title');
  const inlineEditUrl = document.getElementById('inline-edit-url');
  const refreshFromUrlBtn = document.getElementById('refresh-from-url-btn');
  const inlineEditFoodType = document.getElementById('inline-edit-food-type');
  const inlineEditTagsContainer = document.getElementById('inline-edit-tags-container');
  const inlineEditIngredients = document.getElementById('inline-edit-ingredients');
  const inlineEditInstructions = document.getElementById('inline-edit-instructions');

  const manageRecipeId = document.getElementById('manage-recipe-id');
  const manageRecipeType = document.getElementById('manage-recipe-type');

  // Restaurant elements
  const restaurantList = document.getElementById('restaurant-list');
  const openRestaurantModalBtn = document.getElementById('open-restaurant-modal-btn');
  const restaurantModal = document.getElementById('restaurant-modal');
  const closeRestaurantModalBtn = document.getElementById('close-restaurant-modal-btn');
  const restaurantModalTitle = document.getElementById('restaurant-modal-title');
  const restaurantNameInput = document.getElementById('restaurant-name');
  const restaurantFoodType = document.getElementById('restaurant-food-type');
  const restaurantTagsContainer = document.getElementById('restaurant-tags-container');
  const restaurantOrderingUrlInput = document.getElementById('restaurant-ordering-url');
  const restaurantSearchLinkBtn = document.getElementById('restaurant-search-link-btn');
  const restaurantDeleteBtn = document.getElementById('restaurant-delete-btn');
  const restaurantCancelBtn = document.getElementById('restaurant-cancel-btn');
  const restaurantSaveBtn = document.getElementById('restaurant-save-btn');

  let allRecipes = [];
  let currentPreview = null;
  let currentDetail = null;
  let currentEditId = null;
  let isEditing = false;

  let allRestaurants = [];
  let currentRestaurant = null;
  let allFoodTypes = [];
  let allTags = [];
  let editFormTags = [];
  let restaurantFormTags = [];
  let inlineEditTags = [];

  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const newFoodTypeInput = document.getElementById('new-food-type-input');
  const addFoodTypeBtn = document.getElementById('add-food-type-btn');
  const foodTypesList = document.getElementById('food-types-list');
  const newTagInput = document.getElementById('new-tag-input');
  const addTagBtn = document.getElementById('add-tag-btn');
  const tagsList = document.getElementById('tags-list');

  // Modal Logic
  const openModal = () => {
    recipeModal.classList.remove('hidden');
    resetModal();
    recipeModalTitle.textContent = 'Add New Recipe';
  };

  const closeModal = () => {
    recipeModal.classList.add('hidden');
  };

  const resetModal = () => {
    modalStep1.classList.remove('hidden');
    modalStep2.classList.add('hidden');
    urlInput.value = '';
    screenshotInput.value = '';
    fileNameDisplay.textContent = 'Click to select or drag and drop';
    currentPreview = null;
    currentEditId = null;
    isEditing = false;
    saveRecipeBtn.textContent = 'Save Recipe';
    recipeModalTitle.textContent = 'Add New Recipe';
    showTab('url');
  };

  const showTab = (tab) => {
    if (tab === 'url') {
      tabUrlContent.classList.remove('hidden');
      tabUploadContent.classList.add('hidden');
      tabUrlBtn.classList.add('border-indigo-600', 'text-indigo-600');
      tabUrlBtn.classList.remove('border-transparent', 'text-gray-500');
      tabUploadBtn.classList.remove('border-indigo-600', 'text-indigo-600');
      tabUploadBtn.classList.add('border-transparent', 'text-gray-500');
    } else {
      tabUrlContent.classList.add('hidden');
      tabUploadContent.classList.remove('hidden');
      tabUploadBtn.classList.add('border-indigo-600', 'text-indigo-600');
      tabUploadBtn.classList.remove('border-transparent', 'text-gray-500');
      tabUrlBtn.classList.remove('border-indigo-600', 'text-indigo-600');
      tabUrlBtn.classList.add('border-transparent', 'text-gray-500');
    }
  };

  const showStep2 = (data) => {
    currentPreview = data;
    editTitle.value = data.title || '';
    editType.value = data.type || 'General';
    if (editFoodType) editFoodType.value = data.foodType || '';
    if (editIngredients) editIngredients.value = (data.ingredients || []).join('\n');
    editText.value = data.rawText || '';
    editInstructions.value = (data.instructions || []).join('\n');

    // Auto-extract ingredients if they aren't already present
    if ((!data.ingredients || data.ingredients.length === 0) && data.rawText) {
      data.ingredients = extractIngredients(data.rawText, data.instructions);
    }
    if (editIngredients && data.ingredients && data.ingredients.length > 0) {
      editIngredients.value = data.ingredients.join('\n');
    }

    if (data.screenshot) {
      previewImage.src = data.screenshot;
      previewImageContainer.classList.remove('hidden');
    } else {
      previewImageContainer.classList.add('hidden');
    }

    if (data.type === 'Scanned' || data.rawText) {
      previewTextContainer.classList.remove('hidden');
    } else {
      previewTextContainer.classList.add('hidden');
    }

    if (data.instructions && data.instructions.length > 0) {
      previewInstructionsContainer.classList.remove('hidden');
    } else {
      previewInstructionsContainer.classList.add('hidden');
    }

    editFormTags = data.tags || [];
    if (editTagsContainer) renderTagSelector(editTagsContainer, editFormTags, (t) => { editFormTags = t; });

    modalStep1.classList.add('hidden');
    modalStep2.classList.remove('hidden');
  };

  const closeDetail = () => {
    detailModal.classList.add('hidden');
    currentDetail = null;
  };

  const fetchFoodTypes = async () => {
    try {
      const response = await fetch('/api/food-types');
      allFoodTypes = await response.json();
      populateFoodTypeSelect(foodTypeFilter);
      populateFoodTypeSelect(editFoodType);
      populateFoodTypeSelect(restaurantFoodType);
      populateFoodTypeSelect(inlineEditFoodType);
    } catch (err) {
      console.error('Error fetching food types:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      allTags = await response.json();
      if (tagFilter) {
        const v = tagFilter.value;
        tagFilter.innerHTML = '<option value="">All tags</option>';
        allTags.forEach((t) => {
          const opt = document.createElement('option');
          opt.value = t.name;
          opt.textContent = t.name;
          tagFilter.appendChild(opt);
        });
        if (v) tagFilter.value = v;
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const renderTagSelector = (container, selectedTags, setSelectedTags) => {
    if (!container) return;
    const toggle = (name) => {
      const idx = selectedTags.indexOf(name);
      const next = idx >= 0 ? selectedTags.filter((_, i) => i !== idx) : [...selectedTags, name];
      setSelectedTags(next);
      renderTagSelector(container, next, setSelectedTags);
    };
    const addNew = () => {
      const input = container.querySelector('.tag-add-input');
      if (!input) return;
      const name = (input.value || '').trim();
      if (!name) return;
      input.value = '';
      if (selectedTags.includes(name)) return;
      const next = [...selectedTags, name];
      setSelectedTags(next);
      fetch('/api/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
        .then((r) => { if (r.ok) fetchTags(); });
      renderTagSelector(container, next, setSelectedTags);
    };
    container.innerHTML = '';
    const all = [...new Set([...allTags.map((t) => t.name), ...selectedTags])].sort();
    all.forEach((name) => {
      const pill = document.createElement('span');
      pill.className = `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${selectedTags.includes(name) ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`;
      pill.textContent = name;
      pill.addEventListener('click', () => toggle(name));
      container.appendChild(pill);
    });
    const wrap = document.createElement('span');
    wrap.className = 'inline-flex items-center gap-1';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add tag';
    input.className = 'tag-add-input w-20 px-2 py-0.5 bg-slate-950 border border-slate-600 rounded text-xs text-slate-100 focus:ring-1 focus:ring-indigo-500';
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addNew(); } });
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'px-2 py-0.5 text-xs font-medium text-indigo-400 hover:text-indigo-300';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', addNew);
    wrap.appendChild(input);
    wrap.appendChild(addBtn);
    container.appendChild(wrap);
  };

  const populateFoodTypeSelect = (selectEl) => {
    if (!selectEl) return;
    const value = selectEl.value;
    selectEl.innerHTML = selectEl.id === 'food-type-filter'
      ? '<option value="">All food types</option>'
      : '<option value="">— None —</option>';
    allFoodTypes.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.name;
      opt.textContent = t.name;
      selectEl.appendChild(opt);
    });
    if (value) selectEl.value = value;
  };

  const getDomainFromUrl = (url) => {
    if (!url || !url.trim()) return null;
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  };

  const logoUrl = (domain) => (domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64` : null);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      allRestaurants = await response.json();
      renderCards();
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  const renderCards = () => {
    if (!cardList) return;
    const show = cardFilter ? cardFilter.value : 'all';
    const foodType = foodTypeFilter ? foodTypeFilter.value : '';
    const tagName = tagFilter ? tagFilter.value : '';
    if (typeFilter) typeFilter.classList.toggle('hidden', show !== 'recipes');
    let filteredRecipes = show === 'restaurants' ? [] : (typeFilter && typeFilter.value !== 'all' ? allRecipes.filter((r) => r.type === typeFilter.value) : allRecipes);
    let filteredRestaurants = show === 'recipes' ? [] : allRestaurants;
    if (foodType) {
      filteredRecipes = filteredRecipes.filter((r) => r.foodType === foodType);
      filteredRestaurants = filteredRestaurants.filter((r) => r.foodType === foodType);
    }
    if (tagName) {
      filteredRecipes = filteredRecipes.filter((r) => (r.tags || []).includes(tagName));
      filteredRestaurants = filteredRestaurants.filter((r) => (r.tags || []).includes(tagName));
    }
    const items = [
      ...filteredRecipes.map((r) => ({ ...r, _type: 'recipe', _sortDate: new Date(r.dateAdded).getTime() })),
      ...filteredRestaurants.map((r) => ({ ...r, _type: 'restaurant', _sortDate: new Date(r.dateAdded).getTime() }))
    ].sort((a, b) => b._sortDate - a._sortDate);

    const linkIcon = '<svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>';
    cardList.innerHTML = '';
    items.forEach((item) => {
      const isRecipe = item._type === 'recipe';
      const domain = isRecipe ? getDomainFromUrl(item.url) : getDomainFromUrl(item.orderingUrl);
      const logo = logoUrl(domain);
      const typeBadge = isRecipe
        ? (item.type === 'Scanned' ? '<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 uppercase">Scanned</span>' : '<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200 uppercase">Recipe</span>')
        : '<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-200 uppercase">To-Go</span>';
      const foodTypeBadge = item.foodType ? `<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-600 text-slate-200">${item.foodType}</span>` : '';
      const tagBadges = (item.tags || []).slice(0, 3).map((t) => `<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200">${t}</span>`).join('');
      const badge = [typeBadge, foodTypeBadge, tagBadges].filter(Boolean).join(' ');
      const title = isRecipe ? item.title : item.name;
      const action = isRecipe
        ? (item.url ? `<span class="text-indigo-300 text-xs flex items-center gap-1">View${linkIcon}</span>` : '<span class="text-slate-500 text-xs">No link</span>')
        : (item.orderingUrl && item.orderingUrl.trim() ? `<span class="text-indigo-300 text-xs flex items-center gap-1">Order${linkIcon}</span>` : '<span class="text-slate-500 text-xs">Add link</span>');
      const dateStr = new Date(item.dateAdded).toLocaleDateString();
      const card = document.createElement('div');
      card.className = 'bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-600 hover:shadow-md transition-all duration-200 cursor-pointer flex min-h-[88px]';
      card.innerHTML = `
        <div class="flex gap-3 p-3 w-full min-w-0">
          <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
            ${logo ? `<img src="${logo}" alt="" class="w-8 h-8 object-contain logo-img"><span class="hidden logo-fallback w-8 h-8 flex items-center justify-center text-slate-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></span>` : '<span class="text-slate-500 flex"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></span>'}
          </div>
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-sm font-bold text-slate-100 truncate leading-tight">${title}</h3>
              ${isRecipe ? '' : '<button type="button" class="card-edit-btn flex-shrink-0 text-slate-500 hover:text-slate-300 text-xs font-medium">Edit</button>'}
            </div>
            <div class="flex items-center gap-2 mt-0.5 flex-wrap">${badge}<span class="text-slate-500 text-xs">·</span>${action}</div>
            <p class="text-slate-500 text-[10px] mt-1">${dateStr}</p>
          </div>
        </div>
      `;
      card.onclick = (e) => {
        if (e.target.closest('.card-edit-btn')) {
          e.preventDefault();
          e.stopPropagation();
          openRestaurantModal(item);
          return;
        }
        if (isRecipe) openDetail(item);
        else if (item.orderingUrl && item.orderingUrl.trim()) window.open(item.orderingUrl, '_blank', 'noopener,noreferrer');
        else openRestaurantModal(item);
      };
      const logoImg = card.querySelector('.logo-img');
      const logoFallback = card.querySelector('.logo-fallback');
      if (logoImg && logoFallback) {
        logoImg.addEventListener('error', () => {
          logoImg.style.display = 'none';
          logoFallback.classList.remove('hidden');
        });
      }
      cardList.appendChild(card);
    });
  };

  const openRestaurantModal = (restaurant = null) => {
    currentRestaurant = restaurant;
    if (restaurant) {
      restaurantModalTitle.textContent = 'Edit Restaurant';
      restaurantNameInput.value = restaurant.name;
      if (restaurantFoodType) restaurantFoodType.value = restaurant.foodType || '';
      restaurantFormTags = restaurant.tags || [];
      restaurantOrderingUrlInput.value = restaurant.orderingUrl || '';
      restaurantDeleteBtn.classList.remove('hidden');
    } else {
      restaurantModalTitle.textContent = 'Add Restaurant';
      restaurantNameInput.value = '';
      if (restaurantFoodType) restaurantFoodType.value = '';
      restaurantFormTags = [];
      restaurantOrderingUrlInput.value = '';
      restaurantDeleteBtn.classList.add('hidden');
    }
    if (restaurantTagsContainer) renderTagSelector(restaurantTagsContainer, restaurantFormTags, (t) => { restaurantFormTags = t; });
    restaurantModal.classList.remove('hidden');
  };

  const closeRestaurantModal = () => {
    restaurantModal.classList.add('hidden');
    currentRestaurant = null;
    restaurantNameInput.value = '';
    restaurantOrderingUrlInput.value = '';
    restaurantDeleteBtn.classList.add('hidden');
  };

  const groupInstructions = (instructions) => {
    const groups = [];
    let currentGroup = { title: null, steps: [] };

    const pushGroup = () => {
      if (currentGroup.steps.length === 0 && !currentGroup.title) return;
      groups.push(currentGroup);
      currentGroup = { title: null, steps: [] };
    };

    instructions.forEach((step) => {
      const trimmed = step.trim();
      if (!trimmed) return;

      const headingMatch = trimmed.match(/^([A-Z][A-Za-z0-9 &'\/-]{2,40}):\s*(.*)$/);
      if (headingMatch) {
        pushGroup();
        currentGroup.title = headingMatch[1];
        if (headingMatch[2]) currentGroup.steps.push(headingMatch[2]);
        return;
      }

      if (trimmed.length < 50 && /:\s*$/.test(trimmed)) {
        pushGroup();
        currentGroup.title = trimmed.replace(/:\s*$/, '');
        return;
      }

      currentGroup.steps.push(trimmed);
    });

    pushGroup();
    return groups;
  };

  const renderInstructionGroups = (instructions) => {
    const groups = groupInstructions(instructions);
    if (groups.length === 0) return '';

    return groups.map((group) => {
      const heading = group.title
        ? `<div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-400">${group.title}</div>`
        : '';
      const list = group.steps.length > 0
        ? `<ol class="space-y-2 list-decimal list-inside">${group.steps.map((step) => `<li>${step}</li>`).join('')}</ol>`
        : '';
      return `<div class="space-y-2">${heading}${list}</div>`;
    }).join('');
  };

  const showDetailTab = (tab) => {
    if (tab === 'recipe') {
      detailRecipePanel.classList.remove('hidden');
      detailEditPanel.classList.add('hidden');
      detailTabRecipe.classList.add('border-indigo-500', 'text-white');
      detailTabRecipe.classList.remove('border-transparent', 'text-slate-400');
      detailTabEdit.classList.remove('border-indigo-500', 'text-white');
      detailTabEdit.classList.add('border-transparent', 'text-slate-400');
      viewFooterActions.classList.remove('hidden');
      editFooterActions.classList.add('hidden');
    } else {
      detailRecipePanel.classList.add('hidden');
      detailEditPanel.classList.remove('hidden');
      detailTabEdit.classList.add('border-indigo-500', 'text-white');
      detailTabEdit.classList.remove('border-transparent', 'text-slate-400');
      detailTabRecipe.classList.remove('border-indigo-500', 'text-white');
      detailTabRecipe.classList.add('border-transparent', 'text-slate-400');
      viewFooterActions.classList.add('hidden');
      editFooterActions.classList.remove('hidden');
      if (currentDetail) {
        inlineEditTitle.value = currentDetail.title;
        if (inlineEditUrl) inlineEditUrl.value = currentDetail.url || '';
        if (inlineEditFoodType) inlineEditFoodType.value = currentDetail.foodType || '';
        inlineEditTags = currentDetail.tags || [];
        if (inlineEditTagsContainer) renderTagSelector(inlineEditTagsContainer, inlineEditTags, (t) => { inlineEditTags = t; });
        inlineEditIngredients.value = (currentDetail.ingredients || []).join('\n');
        inlineEditInstructions.value = (currentDetail.instructions || []).join('\n');
      }
    }
  };

  const refreshRecipePanel = (recipe) => {
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      detailIngredients.innerHTML = recipe.ingredients.map(ing => `<div>• ${ing}</div>`).join('');
      detailIngredientsContainer.classList.remove('hidden');
    } else {
      detailIngredients.innerHTML = '';
      detailIngredientsContainer.classList.add('hidden');
    }
    if (recipe.instructions && recipe.instructions.length > 0) {
      detailInstructions.innerHTML = renderInstructionGroups(recipe.instructions);
      detailInstructionsContainer.classList.remove('hidden');
    } else {
      detailInstructions.innerHTML = '';
      detailInstructionsContainer.classList.add('hidden');
    }
    if (recipe.url) {
      detailUrl.href = recipe.url;
      detailUrlText.textContent = recipe.url;
      detailUrlContainer.classList.remove('hidden');
    } else {
      detailUrlContainer.classList.add('hidden');
    }
    if (recipe.pdfPath) {
      detailPdfLink.href = recipe.pdfPath;
      detailPdfLink.download = (recipe.title || 'recipe').replace(/[^a-z0-9.-]/gi, '_') + '.pdf';
      detailPdfContainer.classList.remove('hidden');
    } else {
      detailPdfContainer.classList.add('hidden');
    }
  };

  const openDetail = (recipe) => {
    currentDetail = recipe;

    // Extract ingredients when missing (from rawText or instruction text)
    if ((!recipe.ingredients || recipe.ingredients.length === 0) && (recipe.rawText || (recipe.instructions && recipe.instructions.length > 0))) {
      recipe.ingredients = extractIngredients(recipe.rawText || '', recipe.instructions || []);
    }

    detailTitle.textContent = recipe.title;
    inlineEditTitle.value = recipe.title;
    if (inlineEditFoodType) inlineEditFoodType.value = recipe.foodType || '';
    inlineEditTags = recipe.tags || [];
    if (inlineEditTagsContainer) renderTagSelector(inlineEditTagsContainer, inlineEditTags, (t) => { inlineEditTags = t; });
    inlineEditIngredients.value = (recipe.ingredients || []).join('\n');
    inlineEditInstructions.value = (recipe.instructions || []).join('\n');

    refreshRecipePanel(recipe);

    if (recipe.screenshot) {
      detailImage.src = recipe.screenshot;
      detailImageContainer.classList.remove('hidden');
    } else {
      detailImageContainer.classList.add('hidden');
    }

    if (recipe.url) {
      detailUrl.href = recipe.url;
      detailUrlText.textContent = recipe.url;
      detailUrlContainer.classList.remove('hidden');
    } else {
      detailUrlContainer.classList.add('hidden');
    }

    if (recipe.pdfPath) {
      detailPdfLink.href = recipe.pdfPath;
      detailPdfLink.download = (recipe.title || 'recipe').replace(/[^a-z0-9.-]/gi, '_') + '.pdf';
      detailPdfContainer.classList.remove('hidden');
    } else {
      detailPdfContainer.classList.add('hidden');
    }

    if (recipe.rawText) {
      detailRawText.textContent = recipe.rawText;
      detailRawTextContainer.classList.remove('hidden');
    } else {
      detailRawTextContainer.classList.add('hidden');
    }

    manageRecipeId.textContent = recipe.id;
    manageRecipeType.textContent = recipe.type;

    showDetailView('view');
    detailModal.classList.remove('hidden');
  };

  const showDetailView = (view) => {
    detailTabbedContent.classList.add('hidden');
    detailManage.classList.add('hidden');
    viewFooterActions.classList.add('hidden');
    editFooterActions.classList.add('hidden');
    manageFooterActions.classList.add('hidden');

    if (view === 'view') {
      detailTabbedContent.classList.remove('hidden');
      showDetailTab('recipe');
    } else if (view === 'manage') {
      detailManage.classList.remove('hidden');
      manageFooterActions.classList.remove('hidden');
      detailTitle.textContent = 'Manage Recipe';
    }
  };

  const extractIngredients = (text, instructions) => {
    const seen = new Set();
    const add = (line) => {
      const trimmed = line.trim().replace(/^[•\-*]\s+/, '');
      if (!trimmed || trimmed.length > 120) return;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      ingredients.push(trimmed);
    };

    const ingredientPatterns = [
      /^\d+[\/\d.\s]*(cup|tsp|tbsp|oz|g|lb|kg|ml|l|can|package|clove|pinch|piece|slice|teaspoon|tablespoon|ounce|gram|pound|liter)\b/i,
      /^\d+[\/\d.\s]+(?!st|nd|rd|th|step|min|hour|degree|f\b|c\b)/i,
      /^[•\-*]\s+/,
      /^(cup|tsp|tbsp|oz|g|lb|ml)\s+/i
    ];

    const ingredients = [];

    const scanLines = (lines) => {
      (lines || []).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        if (ingredientPatterns.some(p => p.test(trimmed))) {
          add(trimmed);
        }
      });
    };

    scanLines(text.split('\n'));
    scanLines(instructions || []);

    return ingredients;
  };

  const openEditModal = (recipe) => {
    currentEditId = recipe.id;
    isEditing = true;
    currentPreview = recipe;
    saveRecipeBtn.textContent = 'Update Recipe';
    recipeModalTitle.textContent = 'Edit Recipe';
    recipeModal.classList.remove('hidden');
    showStep2(recipe);
  };

  // Event Listeners
  openModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);

  detailTabRecipe.addEventListener('click', () => showDetailTab('recipe'));
  detailTabEdit.addEventListener('click', () => showDetailTab('edit'));
  inlineEditBtn.addEventListener('click', () => showDetailTab('edit'));
  inlineCancelBtn.addEventListener('click', () => {
    if (currentDetail) {
      inlineEditTitle.value = currentDetail.title;
      if (inlineEditUrl) inlineEditUrl.value = currentDetail.url || '';
      if (inlineEditFoodType) inlineEditFoodType.value = currentDetail.foodType || '';
      inlineEditTags = currentDetail.tags || [];
      if (inlineEditTagsContainer) renderTagSelector(inlineEditTagsContainer, inlineEditTags, (t) => { inlineEditTags = t; });
      inlineEditIngredients.value = (currentDetail.ingredients || []).join('\n');
      inlineEditInstructions.value = (currentDetail.instructions || []).join('\n');
    }
    showDetailTab('recipe');
  });

  inlineManageBtn.addEventListener('click', () => showDetailView('manage'));
  inlineManageBtnEdit.addEventListener('click', () => showDetailView('manage'));
  inlineBackBtn.addEventListener('click', () => showDetailView('view'));

  inlineEditTitle.addEventListener('input', () => {
    detailTitle.textContent = inlineEditTitle.value || 'Recipe';
  });

  inlineSaveBtn.addEventListener('click', async () => {
    if (!currentDetail) return;

    const updatedData = {
      ...currentDetail,
      title: inlineEditTitle.value.trim(),
      url: inlineEditUrl && inlineEditUrl.value ? inlineEditUrl.value.trim() || null : currentDetail.url,
      foodType: inlineEditFoodType && inlineEditFoodType.value ? inlineEditFoodType.value.trim() : null,
      tags: inlineEditTags || [],
      ingredients: inlineEditIngredients.value.split('\n').map(i => i.trim()).filter(i => i.length > 0),
      instructions: inlineEditInstructions.value.split('\n').map(i => i.trim()).filter(i => i.length > 0)
    };

    if (!updatedData.title) return;

    inlineSaveBtn.disabled = true;
    inlineSaveBtn.textContent = 'Saving...';

    try {
      const response = await fetch(`/api/recipes/${updatedData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        currentDetail = updatedData;
        refreshRecipePanel(updatedData);
        detailTitle.textContent = updatedData.title;
        showDetailTab('recipe');
        fetchRecipes();
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
    } finally {
      inlineSaveBtn.disabled = false;
      inlineSaveBtn.textContent = 'Save Changes';
    }
  });

  if (refreshFromUrlBtn && inlineEditUrl) {
    refreshFromUrlBtn.addEventListener('click', async () => {
      const url = inlineEditUrl.value.trim();
      if (!url) {
        alert('Enter a source URL first.');
        return;
      }
      refreshFromUrlBtn.disabled = true;
      refreshFromUrlBtn.textContent = 'Fetching...';
      try {
        const response = await fetch('/api/recipes/preview/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        if (!response.ok) {
          const err = await response.json();
          alert(err.error || 'Failed to fetch from URL.');
          return;
        }
        const data = await response.json();
        inlineEditTitle.value = data.title || inlineEditTitle.value;
        inlineEditIngredients.value = (data.ingredients || []).join('\n');
        inlineEditInstructions.value = (data.instructions || []).join('\n');
        if (currentDetail) {
          currentDetail.title = data.title || currentDetail.title;
          currentDetail.ingredients = data.ingredients || [];
          currentDetail.instructions = data.instructions || [];
          refreshRecipePanel(currentDetail);
        }
      } catch (e) {
        console.error(e);
        alert('Failed to connect to the server.');
      } finally {
        refreshFromUrlBtn.disabled = false;
        refreshFromUrlBtn.textContent = 'Refresh';
      }
    });
  }

  inlineDeleteBtn.addEventListener('click', async () => {
    if (!currentDetail) return;
    const confirmed = window.confirm(`Delete "${currentDetail.title}"? This cannot be undone.`);
    if (!confirmed) return;

    inlineDeleteBtn.disabled = true;
    inlineDeleteBtn.textContent = 'Deleting...';

    try {
      const response = await fetch(`/api/recipes/${currentDetail.id}`, {
        method: 'DELETE'
      });
      if (!response.ok && response.status !== 204) {
        const errData = await response.json();
        alert(`Error: ${errData.error || 'Failed to delete recipe'}`);
      } else {
        closeDetail();
        await fetchRecipes();
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to connect to the server.');
    } finally {
      inlineDeleteBtn.disabled = false;
      inlineDeleteBtn.textContent = 'Delete Recipe Permanently';
    }
  });

  closeDetailBtn.addEventListener('click', closeDetail);
  closeDetailFooterBtn.addEventListener('click', closeDetail);

  backToStep1Btn.addEventListener('click', () => {
    modalStep2.classList.add('hidden');
    modalStep1.classList.remove('hidden');
  });

  tabUrlBtn.addEventListener('click', () => showTab('url'));
  tabUploadBtn.addEventListener('click', () => showTab('upload'));

  // Paste support for images
  window.addEventListener('paste', (e) => {
    // Only handle paste if we are on the upload tab and step 1
    if (tabUploadContent.classList.contains('hidden') || !modalStep2.classList.contains('hidden') || recipeModal.classList.contains('hidden')) {
      return;
    }

    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();

        // Update file input and display
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        screenshotInput.files = dataTransfer.files;
        fileNameDisplay.textContent = 'Pasted Image';

        // Auto-process the pasted image
        previewUploadBtn.click();
        break;
      }
    }
  });

  screenshotInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      fileNameDisplay.textContent = e.target.files[0].name;
    }
  });

  previewUrlBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return;

    previewUrlBtn.disabled = true;
    previewUrlBtn.textContent = 'Processing...';

    try {
      const response = await fetch('/api/recipes/preview/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (response.ok) {
        const data = await response.json();
        showStep2(data);
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.error || 'Failed to process URL'}`);
      }
    } catch (error) {
      console.error('Error processing URL:', error);
      alert('Failed to connect to the server.');
    } finally {
      previewUrlBtn.disabled = false;
      previewUrlBtn.textContent = 'Process URL';
    }
  });

  previewUploadBtn.addEventListener('click', async () => {
    const file = screenshotInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('screenshot', file);

    previewUploadBtn.disabled = true;
    previewUploadBtn.textContent = 'Processing...';

    try {
      const response = await fetch('/api/recipes/preview/upload', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        showStep2(data);
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.error || 'Failed to process image'}`);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to connect to the server.');
    } finally {
      previewUploadBtn.disabled = false;
      previewUploadBtn.textContent = 'Process Image (OCR)';
    }
  });

  saveRecipeBtn.addEventListener('click', async () => {
    const recipeData = {
      ...currentPreview,
      id: currentEditId || currentPreview?.id,
      title: editTitle.value.trim(),
      type: editType.value,
      foodType: editFoodType && editFoodType.value ? editFoodType.value.trim() : null,
      tags: editFormTags || [],
      rawText: editText.value.trim(),
      ingredients: editIngredients ? editIngredients.value.split('\n').map(i => i.trim()).filter(i => i.length > 0) : [],
      instructions: editInstructions.value.split('\n').map(i => i.trim()).filter(i => i.length > 0)
    };

    if (!recipeData.title) return;

    saveRecipeBtn.disabled = true;
    saveRecipeBtn.textContent = isEditing ? 'Updating...' : 'Saving...';

    try {
      const response = await fetch(isEditing ? `/api/recipes/${recipeData.id}` : '/api/recipes', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData)
      });
      if (response.ok) {
        closeModal();
        fetchRecipes();
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      saveRecipeBtn.disabled = false;
      saveRecipeBtn.textContent = 'Save Recipe';
    }
  });

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      allRecipes = await response.json();
      renderCards();
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  if (cardFilter) cardFilter.addEventListener('change', renderCards);
  if (foodTypeFilter) foodTypeFilter.addEventListener('change', renderCards);
  if (tagFilter) tagFilter.addEventListener('change', renderCards);
  if (typeFilter) typeFilter.addEventListener('change', renderCards);

  const openSettingsModal = () => {
    if (settingsModal) settingsModal.classList.remove('hidden');
    renderFoodTypesList();
    renderTagsList();
  };
  const closeSettingsModal = () => {
    if (settingsModal) settingsModal.classList.add('hidden');
  };

  // Backdrop click: close modal when clicking the overlay (not the inner content)
  const onBackdropClick = (modalEl, closeFn) => (e) => {
    if (e.target === e.currentTarget) closeFn();
  };
  if (recipeModal) recipeModal.addEventListener('click', onBackdropClick(recipeModal, closeModal));
  if (detailModal) detailModal.addEventListener('click', onBackdropClick(detailModal, closeDetail));
  if (restaurantModal) restaurantModal.addEventListener('click', onBackdropClick(restaurantModal, closeRestaurantModal));
  if (settingsModal) settingsModal.addEventListener('click', onBackdropClick(settingsModal, closeSettingsModal));

  // Escape key: close the topmost visible modal
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!detailModal.classList.contains('hidden')) closeDetail();
    else if (!recipeModal.classList.contains('hidden')) closeModal();
    else if (!restaurantModal.classList.contains('hidden')) closeRestaurantModal();
    else if (settingsModal && !settingsModal.classList.contains('hidden')) closeSettingsModal();
  });

  const renderFoodTypesList = () => {
    if (!foodTypesList) return;
    foodTypesList.innerHTML = '';
    allFoodTypes.forEach((t) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-slate-800/50';
      li.innerHTML = `<span class="text-slate-200 font-medium">${t.name}</span><button type="button" class="food-type-delete text-red-400 hover:text-red-300 text-sm font-medium" data-id="${t.id}">Delete</button>`;
      li.querySelector('.food-type-delete').addEventListener('click', async () => {
        if (!window.confirm(`Remove "${t.name}"? Recipes and to-go using it will have their type cleared.`)) return;
        try {
          const response = await fetch(`/api/food-types/${t.id}`, { method: 'DELETE' });
          if (response.ok) {
            await fetchFoodTypes();
            renderFoodTypesList();
            renderCards();
          }
        } catch (err) {
          console.error(err);
        }
      });
      foodTypesList.appendChild(li);
    });
  };
  if (openSettingsBtn) openSettingsBtn.addEventListener('click', openSettingsModal);
  if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettingsModal);
  const renderTagsList = () => {
    if (!tagsList) return;
    tagsList.innerHTML = '';
    allTags.forEach((t) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-slate-800/50';
      li.innerHTML = `<span class="text-slate-200 font-medium">${t.name}</span><button type="button" class="tag-delete text-red-400 hover:text-red-300 text-sm font-medium" data-id="${t.id}">Delete</button>`;
      li.querySelector('.tag-delete').addEventListener('click', async () => {
        if (!window.confirm(`Remove tag "${t.name}"? Recipes and restaurants will keep it until you edit them.`)) return;
        try {
          const response = await fetch(`/api/tags/${t.id}`, { method: 'DELETE' });
          if (response.ok) {
            await fetchTags();
            renderTagsList();
            renderCards();
          }
        } catch (err) {
          console.error(err);
        }
      });
      tagsList.appendChild(li);
    });
  };
  if (addTagBtn && newTagInput) {
    addTagBtn.addEventListener('click', async () => {
      const name = newTagInput.value.trim();
      if (!name) return;
      try {
        const response = await fetch('/api/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        if (response.ok) {
          newTagInput.value = '';
          await fetchTags();
          renderTagsList();
          renderCards();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
  if (addFoodTypeBtn && newFoodTypeInput) {
    addFoodTypeBtn.addEventListener('click', async () => {
      const name = newFoodTypeInput.value.trim();
      if (!name) return;
      try {
        const response = await fetch('/api/food-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        if (response.ok) {
          newFoodTypeInput.value = '';
          await fetchFoodTypes();
          renderFoodTypesList();
          renderCards();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (openRestaurantModalBtn) {
    openRestaurantModalBtn.addEventListener('click', () => openRestaurantModal());
  }
  if (closeRestaurantModalBtn) {
    closeRestaurantModalBtn.addEventListener('click', closeRestaurantModal);
  }
  if (restaurantSearchLinkBtn) {
    restaurantSearchLinkBtn.addEventListener('click', () => {
      const name = restaurantNameInput.value.trim() || 'restaurant';
      const query = `${name} order online delivery`;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
    });
  }
  if (restaurantCancelBtn) {
    restaurantCancelBtn.addEventListener('click', closeRestaurantModal);
  }
  if (restaurantSaveBtn) {
    restaurantSaveBtn.addEventListener('click', async () => {
      const name = restaurantNameInput.value.trim();
      if (!name) return;
      const orderingUrl = restaurantOrderingUrlInput.value.trim() || null;
      const foodType = restaurantFoodType && restaurantFoodType.value ? restaurantFoodType.value.trim() : null;
      restaurantSaveBtn.disabled = true;
      try {
        if (currentRestaurant) {
          const response = await fetch(`/api/restaurants/${currentRestaurant.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, orderingUrl, foodType, tags: restaurantFormTags || [], dateAdded: currentRestaurant.dateAdded })
          });
          if (!response.ok) throw new Error('Update failed');
        } else {
          const response = await fetch('/api/restaurants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, orderingUrl, foodType, tags: restaurantFormTags || [] })
          });
          if (!response.ok) throw new Error('Create failed');
        }
        closeRestaurantModal();
        await fetchRestaurants();
      } catch (err) {
        console.error(err);
      } finally {
        restaurantSaveBtn.disabled = false;
      }
    });
  }
  if (restaurantDeleteBtn) {
    restaurantDeleteBtn.addEventListener('click', async () => {
      if (!currentRestaurant) return;
      if (!window.confirm(`Delete "${currentRestaurant.name}"?`)) return;
      try {
        const response = await fetch(`/api/restaurants/${currentRestaurant.id}`, { method: 'DELETE' });
        if (response.ok) {
          closeRestaurantModal();
          await fetchRestaurants();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  fetchFoodTypes();
  fetchTags();
  fetchRecipes();
  fetchRestaurants();
});

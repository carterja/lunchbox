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
  const editTagsAdd = document.getElementById('edit-tags-add');
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
  const detailTags = document.getElementById('detail-tags');
  const detailMetaBar = document.getElementById('detail-meta-bar');
  const detailUrl = document.getElementById('detail-url');
  const detailUrlText = document.getElementById('detail-url-text');
  const detailPdfLink = document.getElementById('detail-pdf-link');
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

  const detailTrashBtn = document.getElementById('detail-trash-btn');
  const inlineSaveBtn = document.getElementById('inline-save-btn');
  const inlineBackBtn = document.getElementById('inline-back-btn');
  const inlineDeleteBtn = document.getElementById('inline-delete-btn');

  const inlineEditTitle = document.getElementById('inline-edit-title');
  const inlineEditUrl = document.getElementById('inline-edit-url');
  const refreshFromUrlBtn = document.getElementById('refresh-from-url-btn');
  const inlineEditImageInput = document.getElementById('inline-edit-image-input');
  const inlineEditImagePreview = document.getElementById('inline-edit-image-preview');
  const inlineEditImagePreviewWrap = document.getElementById('inline-edit-image-preview-wrap');
  const inlineEditImageEmptyWrap = document.getElementById('inline-edit-image-empty-wrap');
  const inlineEditImageRemoveBtn = document.getElementById('inline-edit-image-remove-btn');
  const inlineEditImageUrlInput = document.getElementById('inline-edit-image-url');
  const inlineEditImageUrlBtn = document.getElementById('inline-edit-image-url-btn');
  const recipeFetchImagesBtn = document.getElementById('recipe-fetch-images-btn');
  const recipeImagePicker = document.getElementById('recipe-image-picker');
  const inlineEditFoodType = document.getElementById('inline-edit-food-type');
  const inlineEditTagsContainer = document.getElementById('inline-edit-tags-container');
  const inlineEditTagsAdd = document.getElementById('inline-edit-tags-add');
  const inlineEditIngredients = document.getElementById('inline-edit-ingredients');
  const inlineEditInstructions = document.getElementById('inline-edit-instructions');
  let inlineEditScreenshot = null;

  const manageRecipeId = document.getElementById('manage-recipe-id');
  const manageRecipeType = document.getElementById('manage-recipe-type');

  const groceryModal = document.getElementById('grocery-modal');
  const closeGroceryModalBtn = document.getElementById('close-grocery-modal-btn');
  const groceryListBtn = document.getElementById('grocery-list-btn');
  const groceryModalTitle = document.getElementById('grocery-modal-title');
  const groceryListItems = document.getElementById('grocery-list-items');
  const groceryCopyBtn = document.getElementById('grocery-copy-btn');
  const groceryShortcutBtn = document.getElementById('grocery-shortcut-btn');

  // Restaurant elements
  const openRestaurantModalBtn = document.getElementById('open-restaurant-modal-btn');
  const restaurantModal = document.getElementById('restaurant-modal');
  const closeRestaurantModalBtn = document.getElementById('close-restaurant-modal-btn');
  const restaurantModalTitle = document.getElementById('restaurant-modal-title');
  const restaurantNameInput = document.getElementById('restaurant-name');
  const restaurantMainUrlInput = document.getElementById('restaurant-main-url');
  const restaurantFoodType = document.getElementById('restaurant-food-type');
  const restaurantTagsContainer = document.getElementById('restaurant-tags-container');
  const restaurantTagsAdd = document.getElementById('restaurant-tags-add');
  const restaurantOrderingUrlInput = document.getElementById('restaurant-ordering-url');
  const restaurantSearchLinkBtn = document.getElementById('restaurant-search-link-btn');
  const restaurantFetchIconsBtn = document.getElementById('restaurant-fetch-icons-btn');
  const restaurantIconPicker = document.getElementById('restaurant-icon-picker');
  const restaurantDeleteBtn = document.getElementById('restaurant-delete-btn');
  const restaurantCancelBtn = document.getElementById('restaurant-cancel-btn');
  const restaurantSaveBtn = document.getElementById('restaurant-save-btn');

  // View toggle: 'cards' | 'appIcons' (controlled from Settings)
  const viewAppIconsBtn = document.getElementById('settings-view-app-icons-btn');
  const viewCardsBtn = document.getElementById('settings-view-cards-btn');
  const togoAppIconsWrap = document.getElementById('togo-app-icons-wrap');
  const togoAppIconsRow = document.getElementById('togo-app-icons-row');
  let layoutMode = 'appIcons';
  let restaurantFormIconUrl = null;

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

  let fetchErrorRecipes = false;
  let fetchErrorRestaurants = false;
  let fetchErrorFoodTypes = false;
  let fetchErrorTags = false;
  const updateFetchErrorBanner = () => {
    const banner = document.getElementById('fetch-error-banner');
    const hasError = fetchErrorRecipes || fetchErrorRestaurants || fetchErrorFoodTypes || fetchErrorTags;
    if (banner) banner.classList.toggle('hidden', !hasError);
  };

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
      tabUrlBtn.classList.add('active-gradient', 'border-transparent');
      tabUrlBtn.classList.remove('border-transparent', 'text-text-muted');
      tabUploadBtn.classList.remove('active-gradient', 'border-transparent');
      tabUploadBtn.classList.add('border-transparent', 'text-text-muted');
    } else {
      tabUrlContent.classList.add('hidden');
      tabUploadContent.classList.remove('hidden');
      tabUploadBtn.classList.add('active-gradient', 'border-transparent');
      tabUploadBtn.classList.remove('border-transparent', 'text-text-muted');
      tabUrlBtn.classList.remove('active-gradient', 'border-transparent');
      tabUrlBtn.classList.add('border-transparent', 'text-text-muted');
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
    if (editTagsContainer) renderTagSelector(editTagsContainer, editFormTags, (t) => { editFormTags = t; }, editTagsAdd);

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
      const data = response.ok ? await response.json() : [];
      allFoodTypes = Array.isArray(data) ? data : [];
      fetchErrorFoodTypes = false;
      populateFoodTypeSelect(foodTypeFilter);
      populateFoodTypeSelect(editFoodType);
      populateFoodTypeSelect(restaurantFoodType);
      populateFoodTypeSelect(inlineEditFoodType);
    } catch (err) {
      console.error('Error fetching food types:', err);
      allFoodTypes = [];
      fetchErrorFoodTypes = true;
    }
    updateFetchErrorBanner();
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = response.ok ? await response.json() : [];
      allTags = Array.isArray(data) ? data : [];
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
      allTags = [];
      fetchErrorTags = true;
    }
    updateFetchErrorBanner();
  };

  const renderTagSelector = (container, selectedTags, setSelectedTags, addContainer) => {
    if (!container) return;
    const toggle = (name) => {
      const idx = selectedTags.indexOf(name);
      const next = idx >= 0 ? selectedTags.filter((_, i) => i !== idx) : [...selectedTags, name];
      setSelectedTags(next);
      renderTagSelector(container, next, setSelectedTags, addContainer);
    };
    const addNew = () => {
      const inputEl = addContainer ? addContainer.querySelector('.tag-add-input') : container.querySelector('.tag-add-input');
      if (!inputEl) return;
      const name = (inputEl.value || '').trim();
      if (!name) return;
      inputEl.value = '';
      if (selectedTags.includes(name)) return;
      const next = [...selectedTags, name];
      setSelectedTags(next);
      fetch('/api/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
        .then((r) => { if (r.ok) fetchTags(); });
      renderTagSelector(container, next, setSelectedTags, addContainer);
    };
    container.innerHTML = '';
    const tags = Array.isArray(allTags) ? allTags : [];
    const all = [...new Set([...tags.map((t) => t.name), ...selectedTags])].sort();
    all.forEach((name) => {
      const pill = document.createElement('span');
      pill.className = `tag-pill inline-flex items-center gap-1 cursor-pointer transition-colors ${selectedTags.includes(name) ? 'active-gradient' : ''}`;
      pill.textContent = name;
      pill.addEventListener('click', () => toggle(name));
      container.appendChild(pill);
    });
    const wrap = document.createElement('span');
    wrap.className = 'flex flex-wrap items-center gap-1 min-w-0';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add tag';
    input.className = 'tag-add-input input-dark w-20 min-w-0 px-2 py-0.5 rounded text-xs';
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addNew(); } });
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'px-2 py-0.5 text-xs font-medium text-accent hover:opacity-90';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', addNew);
    wrap.appendChild(input);
    wrap.appendChild(addBtn);
    (addContainer || container).innerHTML = '';
    (addContainer || container).appendChild(wrap);
  };

  const populateFoodTypeSelect = (selectEl) => {
    if (!selectEl) return;
    if (!Array.isArray(allFoodTypes)) return;
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

  // Escape user content for safe use in HTML (XSS protection)
  const escapeHtml = (str) => {
    if (str == null) return '';
    const s = String(str);
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  // Only allow http(s) or relative URLs for img src
  const safeImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const t = url.trim();
    return (t.startsWith('https://') || t.startsWith('http://') || t.startsWith('/')) ? t : null;
  };

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      const data = response.ok ? await response.json() : [];
      allRestaurants = Array.isArray(data) ? data : [];
      fetchErrorRestaurants = false;
      renderCards();
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      allRestaurants = [];
      fetchErrorRestaurants = true;
      renderCards();
    }
    updateFetchErrorBanner();
  };

  const renderTogoAppIcons = (restaurants) => {
    if (!togoAppIconsRow) return;
    const list = Array.isArray(restaurants) ? restaurants : [];
    const recipes = Array.isArray(allRecipes) ? allRecipes : [];
    const editIconSvg = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
    togoAppIconsRow.innerHTML = '';
    if (list.length === 0) {
      if (recipes.length === 0) return;
      const empty = document.createElement('div');
      empty.className = 'w-full py-6 px-4 rounded-xl border border-white/5 text-center text-text-muted text-sm';
      empty.style.backgroundColor = 'rgba(31,41,55,0.5)';
      empty.innerHTML = '<p class="mb-2">No to-go spots yet.</p><button type="button" class="open-restaurant-from-togo btn-secondary py-1.5 px-3 text-sm rounded-lg">Add To-Go</button>';
      empty.querySelector('.open-restaurant-from-togo')?.addEventListener('click', () => openRestaurantModal());
      togoAppIconsRow.appendChild(empty);
      return;
    }
    list.forEach((item) => {
      const iconSrc = safeImageUrl(item.iconUrl) || logoUrl(getDomainFromUrl(item.mainUrl || item.orderingUrl));
      const hasOrder = item.orderingUrl && item.orderingUrl.trim();
      const el = document.createElement('div');
      el.className = 'flex flex-col items-center gap-2 w-24 flex-shrink-0 group cursor-pointer';
      el.innerHTML = `
        <div class="relative">
          <div class="w-20 h-20 rounded-2xl bg-elevated flex items-center justify-center overflow-hidden border-2 border-white/10 group-hover:border-violet-500/50 transition-colors shadow-lg">
            ${iconSrc ? `<img src="${iconSrc}" alt="" class="w-fit-content h-fit-content p-[9px] object-contain togo-icon-img">` : '<span class="text-text-muted"><svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></span>'}
          </div>
          <button type="button" class="togo-edit-btn absolute rounded-lg bg-elevated/90 border border-white/10 text-text-muted opacity-70 flex items-center justify-center shadow transition-all hover:opacity-100 hover:text-cyan-400 hover:border-violet-500/50 group-hover:opacity-100" style="width:25px;height:25px;top:-8px;right:-8px" title="Edit">${editIconSvg}</button>
        </div>
        <span class="text-sm font-medium text-text-secondary text-center line-clamp-2 leading-tight">${escapeHtml(item.name)}</span>
      `;
      el.addEventListener('click', (e) => {
        if (e.target.closest('.togo-edit-btn')) return;
        if (hasOrder) window.open(item.orderingUrl, '_blank', 'noopener,noreferrer');
        else openRestaurantModal(item);
      });
      el.querySelector('.togo-edit-btn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openRestaurantModal(item); });
      const img = el.querySelector('.togo-icon-img');
      if (img) {
        img.addEventListener('error', () => {
          const iconWrap = img.closest('div');
          if (iconWrap) {
            img.remove();
            iconWrap.innerHTML = '<span class="text-text-muted"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></span>';
          }
        });
      }
      togoAppIconsRow.appendChild(el);
    });
  };

  const renderCards = () => {
    if (!cardList) return;
    const recipes = Array.isArray(allRecipes) ? allRecipes : [];
    const restaurants = Array.isArray(allRestaurants) ? allRestaurants : [];
    const show = cardFilter ? cardFilter.value : 'all';
    const foodType = foodTypeFilter ? foodTypeFilter.value : '';
    const tagName = tagFilter ? tagFilter.value : '';
    if (typeFilter) typeFilter.classList.toggle('hidden', show !== 'recipes');
    let filteredRecipes = show === 'restaurants' ? [] : (typeFilter && typeFilter.value !== 'all' ? recipes.filter((r) => r.type === typeFilter.value) : recipes);
    let filteredRestaurants = show === 'recipes' ? [] : restaurants;
    if (foodType) {
      filteredRecipes = filteredRecipes.filter((r) => r.foodType === foodType);
      filteredRestaurants = filteredRestaurants.filter((r) => r.foodType === foodType);
    }
    if (tagName) {
      filteredRecipes = filteredRecipes.filter((r) => (r.tags || []).includes(tagName));
      filteredRestaurants = filteredRestaurants.filter((r) => (r.tags || []).includes(tagName));
    }

    if (togoAppIconsWrap) togoAppIconsWrap.classList.toggle('hidden', layoutMode !== 'appIcons');
    if (layoutMode === 'appIcons' && togoAppIconsRow) renderTogoAppIcons(filteredRestaurants);

    const sortDate = (r) => (r && r.dateAdded ? new Date(r.dateAdded).getTime() : 0) || 0;
    const items = layoutMode === 'appIcons'
      ? filteredRecipes.map((r) => ({ ...r, _type: 'recipe', _sortDate: sortDate(r) }))
      : [
          ...filteredRecipes.map((r) => ({ ...r, _type: 'recipe', _sortDate: sortDate(r) })),
          ...filteredRestaurants.map((r) => ({ ...r, _type: 'restaurant', _sortDate: sortDate(r) }))
        ].sort((a, b) => b._sortDate - a._sortDate);
    if (layoutMode === 'appIcons') items.sort((a, b) => b._sortDate - a._sortDate);

    const hasFilters = !!(foodType || tagName || (show === 'recipes' && typeFilter?.value !== 'all') || (show === 'restaurants'));
    const totalCount = recipes.length + restaurants.length;

    const linkIcon = '<svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>';
    cardList.innerHTML = '';
    if (items.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'col-span-full rounded-xl border border-white/5 p-8 text-center';
      emptyEl.style.backgroundColor = '#111827';
      const msg = totalCount === 0
        ? 'No recipes or to-go spots yet.'
        : hasFilters
          ? 'No results for this filter. Try changing filters or add new items.'
          : layoutMode === 'appIcons'
            ? 'No recipes yet. Add one to get started.'
            : 'No items to show.';
      emptyEl.innerHTML = `
        <p class="text-text-secondary mb-4">${escapeHtml(msg)}</p>
        <div class="flex flex-wrap justify-center gap-2">
          <button type="button" class="open-recipe-modal-empty btn-primary px-4 py-2 rounded-xl text-sm">Add Recipe</button>
          <button type="button" class="open-restaurant-modal-empty btn-secondary px-4 py-2 rounded-xl text-sm">Add To-Go</button>
        </div>
      `;
      emptyEl.querySelector('.open-recipe-modal-empty')?.addEventListener('click', () => { openModal(); });
      emptyEl.querySelector('.open-restaurant-modal-empty')?.addEventListener('click', () => { openRestaurantModal(); });
      cardList.appendChild(emptyEl);
    }
    items.forEach((item) => {
      const isRecipe = item._type === 'recipe';
      const domain = isRecipe ? getDomainFromUrl(item.url) : getDomainFromUrl(item.mainUrl || item.orderingUrl);
      const logo = isRecipe ? logoUrl(domain) : (safeImageUrl(item.iconUrl) || logoUrl(domain));
      const typeBadge = isRecipe
        ? (item.type === 'Scanned' ? '<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 uppercase">Import</span>' : '<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 uppercase">Recipe</span>')
        : '<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-200 uppercase">To-Go</span>';
      const foodTypeBadge = item.foodType ? `<span class="tag-pill text-[10px]">${escapeHtml(item.foodType)}</span>` : '';
      const tagBadges = (item.tags || []).slice(0, 3).map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`).join(' ');
      const tagRow = tagBadges ? `<div class="flex items-center gap-2 flex-wrap mt-0.5">${tagBadges}</div>` : '';
      const title = escapeHtml(isRecipe ? item.title : item.name);
      const hasAction = isRecipe ? true : !!(item.orderingUrl && item.orderingUrl.trim());
      const actionLabel = isRecipe
        ? 'View'
        : (item.orderingUrl && item.orderingUrl.trim() ? 'Order' : 'Add link');
      const showLinkIcon = isRecipe ? !!item.url : !!(item.orderingUrl && item.orderingUrl.trim());
      const actionBtn = `<span class="card-action-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${hasAction ? 'text-cyan-400 hover:opacity-90' : 'text-text-muted'}">${actionLabel}${showLinkIcon ? linkIcon : ''}</span>`;
      const card = document.createElement('div');
      card.className = 'card-modern min-h-[104px] relative';
      card.innerHTML = `
        <div class="absolute -top-4 left-3 z-10">${typeBadge}</div>
        <div class="flex gap-3 p-3 w-full min-w-0 flex-1">
          <div class="flex-shrink-0 flex flex-col justify-between items-center w-12">
            <div class="w-12 h-12 rounded-lg bg-elevated flex items-center justify-center overflow-hidden">
              ${logo ? `<img src="${logo}" alt="" class="w-8 h-8 object-contain logo-img"><span class="hidden logo-fallback w-8 h-8 flex items-center justify-center text-text-muted"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></span>` : '<span class="text-text-muted flex"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></span>'}
            </div>
            <div class="mt-auto pt-1">${foodTypeBadge || ''}</div>
          </div>
          <div class="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-sm font-bold text-white leading-snug line-clamp-2 flex-1 min-w-0">${title}</h3>
                ${isRecipe ? '' : '<button type="button" class="card-edit-btn flex-shrink-0 text-text-muted hover:text-white text-xs font-medium">Edit</button>'}
              </div>
              ${tagRow}
            </div>
            <div class="flex justify-end mt-2">
              <span class="card-action-btn-wrapper flex-shrink-0">${actionBtn}</span>
            </div>
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

  const setViewToggle = (mode) => {
    layoutMode = mode;
    if (viewAppIconsBtn) {
      viewAppIconsBtn.classList.toggle('active-gradient', mode === 'appIcons');
      viewAppIconsBtn.classList.toggle('bg-elevated', mode !== 'appIcons');
      viewAppIconsBtn.classList.toggle('text-text-muted', mode !== 'appIcons');
    }
    if (viewCardsBtn) {
      viewCardsBtn.classList.toggle('active-gradient', mode === 'cards');
      viewCardsBtn.classList.toggle('bg-elevated', mode !== 'cards');
      viewCardsBtn.classList.toggle('text-text-muted', mode !== 'cards');
    }
    renderCards();
  };

  const syncSettingsLayoutButtons = () => {
    if (viewAppIconsBtn) {
      viewAppIconsBtn.classList.toggle('active-gradient', layoutMode === 'appIcons');
      viewAppIconsBtn.classList.toggle('bg-elevated', layoutMode !== 'appIcons');
      viewAppIconsBtn.classList.toggle('text-text-muted', layoutMode !== 'appIcons');
    }
    if (viewCardsBtn) {
      viewCardsBtn.classList.toggle('active-gradient', layoutMode === 'cards');
      viewCardsBtn.classList.toggle('bg-elevated', layoutMode !== 'cards');
      viewCardsBtn.classList.toggle('text-text-muted', layoutMode !== 'cards');
    }
  };

  const openRestaurantModal = (restaurant = null) => {
    currentRestaurant = restaurant;
    restaurantFormIconUrl = restaurant?.iconUrl || null;
    if (restaurant) {
      restaurantModalTitle.textContent = 'Edit Restaurant';
      restaurantNameInput.value = restaurant.name;
      if (restaurantMainUrlInput) restaurantMainUrlInput.value = restaurant.mainUrl || '';
      if (restaurantFoodType) restaurantFoodType.value = restaurant.foodType || '';
      restaurantFormTags = restaurant.tags || [];
      restaurantOrderingUrlInput.value = restaurant.orderingUrl || '';
      restaurantDeleteBtn.classList.remove('hidden');
    } else {
      restaurantModalTitle.textContent = 'Add Restaurant';
      restaurantNameInput.value = '';
      if (restaurantMainUrlInput) restaurantMainUrlInput.value = '';
      if (restaurantFoodType) restaurantFoodType.value = '';
      restaurantFormTags = [];
      restaurantOrderingUrlInput.value = '';
      restaurantDeleteBtn.classList.add('hidden');
    }
    if (restaurantIconPicker) {
      restaurantIconPicker.innerHTML = '';
      if (restaurantFormIconUrl) {
        restaurantIconPicker.classList.remove('hidden');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'w-12 h-12 rounded-lg border-2 border-cyan-400 ring-2 ring-cyan-400/30 overflow-hidden flex-shrink-0 transition-colors';
        btn.innerHTML = `<img src="${restaurantFormIconUrl}" alt="" class="w-full h-full object-contain bg-elevated" onerror="this.parentElement.innerHTML='<span class=\\'text-text-muted text-xs\\'>?</span>'">`;
        btn.addEventListener('click', () => {
          restaurantFormIconUrl = null;
          restaurantIconPicker.classList.add('hidden');
          restaurantIconPicker.innerHTML = '';
        });
        restaurantIconPicker.appendChild(btn);
      } else {
        restaurantIconPicker.classList.add('hidden');
      }
    }
    if (restaurantTagsContainer) renderTagSelector(restaurantTagsContainer, restaurantFormTags, (t) => { restaurantFormTags = t; }, restaurantTagsAdd);
    restaurantModal.classList.remove('hidden');
  };

  const closeRestaurantModal = () => {
    restaurantModal.classList.add('hidden');
    currentRestaurant = null;
    restaurantFormIconUrl = null;
    restaurantNameInput.value = '';
    if (restaurantMainUrlInput) restaurantMainUrlInput.value = '';
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
        ? `<div class="text-xs font-semibold uppercase tracking-wider text-text-muted">${escapeHtml(group.title)}</div>`
        : '';
      const list = group.steps.length > 0
        ? `<ol class="space-y-2 list-decimal list-inside">${group.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>`
        : '';
      return `<div class="space-y-2">${heading}${list}</div>`;
    }).join('');
  };

  const showDetailTab = (tab) => {
    if (tab === 'recipe') {
      detailRecipePanel.classList.remove('hidden');
      detailEditPanel.classList.add('hidden');
      detailTabRecipe.classList.add('border-cyan-400', 'text-white');
      detailTabRecipe.classList.remove('border-transparent', 'text-text-muted');
      detailTabEdit.classList.remove('border-cyan-400', 'text-white');
      detailTabEdit.classList.add('border-transparent', 'text-text-muted');
      viewFooterActions.classList.remove('hidden');
      editFooterActions.classList.add('hidden');
    } else {
      detailRecipePanel.classList.add('hidden');
      detailEditPanel.classList.remove('hidden');
      detailTabEdit.classList.add('border-cyan-400', 'text-white');
      detailTabEdit.classList.remove('border-transparent', 'text-text-muted');
      detailTabRecipe.classList.remove('border-cyan-400', 'text-white');
      detailTabRecipe.classList.add('border-transparent', 'text-text-muted');
      viewFooterActions.classList.add('hidden');
      editFooterActions.classList.remove('hidden');
      if (currentDetail) {
        inlineEditTitle.value = currentDetail.title;
        if (inlineEditUrl) inlineEditUrl.value = currentDetail.url || '';
        inlineEditScreenshot = currentDetail.screenshot || null;
        if (inlineEditImageUrlInput) inlineEditImageUrlInput.value = '';
        if (recipeImagePicker) {
          recipeImagePicker.classList.add('hidden');
          recipeImagePicker.innerHTML = '';
        }
        if (inlineEditImagePreview && inlineEditImagePreviewWrap && inlineEditImageEmptyWrap) {
          if (inlineEditScreenshot) {
            inlineEditImagePreview.src = inlineEditScreenshot;
            inlineEditImagePreviewWrap.classList.remove('hidden');
            inlineEditImageEmptyWrap.classList.add('hidden');
          } else {
            inlineEditImagePreviewWrap.classList.add('hidden');
            inlineEditImageEmptyWrap.classList.remove('hidden');
          }
        }
        if (inlineEditFoodType) inlineEditFoodType.value = currentDetail.foodType || '';
        inlineEditTags = currentDetail.tags || [];
        if (inlineEditTagsContainer) renderTagSelector(inlineEditTagsContainer, inlineEditTags, (t) => { inlineEditTags = t; }, inlineEditTagsAdd);
        inlineEditIngredients.value = (currentDetail.ingredients || []).join('\n');
        inlineEditInstructions.value = (currentDetail.instructions || []).join('\n');
      }
    }
  };

  const syncInlineEditImageUI = () => {
    if (!inlineEditImagePreview || !inlineEditImagePreviewWrap || !inlineEditImageEmptyWrap) return;
    if (inlineEditScreenshot) {
      inlineEditImagePreview.src = inlineEditScreenshot;
      inlineEditImagePreviewWrap.classList.remove('hidden');
      inlineEditImageEmptyWrap.classList.add('hidden');
    } else {
      inlineEditImagePreview.src = '';
      inlineEditImagePreviewWrap.classList.add('hidden');
      inlineEditImageEmptyWrap.classList.remove('hidden');
    }
  };

  const refreshRecipePanel = (recipe) => {
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      detailIngredients.innerHTML = recipe.ingredients.map(ing => `<div>• ${escapeHtml(ing)}</div>`).join('');
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
    if (recipe.tags && recipe.tags.length > 0) {
      detailTags.innerHTML = recipe.tags.map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('');
    } else {
      detailTags.innerHTML = '';
    }
    if (recipe.url) {
      detailUrl.href = recipe.url;
      detailUrl.title = recipe.url;
      detailUrlText.textContent = getDomainFromUrl(recipe.url) || recipe.url;
      detailUrl.classList.remove('hidden');
    } else {
      detailUrl.classList.add('hidden');
    }
    if (recipe.pdfPath) {
      detailPdfLink.href = recipe.pdfPath;
      detailPdfLink.download = (recipe.title || 'recipe').replace(/[^a-z0-9.-]/gi, '_') + '.pdf';
      detailPdfLink.classList.remove('hidden');
    } else {
      detailPdfLink.classList.add('hidden');
    }
    const hasMeta = (recipe.tags && recipe.tags.length > 0) || recipe.url || recipe.pdfPath;
    if (detailMetaBar) detailMetaBar.classList.toggle('hidden', !hasMeta);
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
    if (inlineEditTagsContainer) renderTagSelector(inlineEditTagsContainer, inlineEditTags, (t) => { inlineEditTags = t; }, inlineEditTagsAdd);
    inlineEditIngredients.value = (recipe.ingredients || []).join('\n');
    inlineEditInstructions.value = (recipe.instructions || []).join('\n');

    refreshRecipePanel(recipe);

    if (recipe.screenshot) {
      detailImage.src = recipe.screenshot;
      detailImageContainer.classList.remove('hidden');
      detailRecipePanel.classList.remove('pt-2');
      detailRecipePanel.classList.add('pt-6');
    } else {
      detailImageContainer.classList.add('hidden');
      detailRecipePanel.classList.remove('pt-6');
      detailRecipePanel.classList.add('pt-2');
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

  // Common pantry/spice items - unchecked by default in grocery list
  const COMMON_HOUSEHOLD = new Set([
    'salt', 'pepper', 'black pepper', 'olive oil', 'vegetable oil', 'garlic', 'onion', 'sugar',
    'flour', 'butter', 'eggs', 'brown sugar', 'vanilla', 'vanilla extract', 'cinnamon', 'cumin',
    'oregano', 'basil', 'paprika', 'bay leaves', 'bay leaf', 'thyme', 'rosemary', 'parsley',
    'soy sauce', 'rice vinegar', 'sesame oil', 'sriracha', 'fish sauce', 'worcestershire',
    'baking soda', 'baking powder', 'vinegar', 'honey', 'maple syrup', 'mustard', 'mayonnaise',
    'ketchup', 'hot sauce', 'olives', 'capers', 'tomato paste', 'chicken broth', 'beef broth',
    'vegetable broth', 'red pepper flakes', 'nutmeg', 'ginger', 'cayenne', 'coriander',
    'chili powder', 'garlic powder', 'onion powder', 'turmeric', 'allspice', 'cloves',
    'italian seasoning', 'herbs', 'spices', 'oil', 'water'
  ]);

  const parseGroceryItem = (ing) => {
    let s = String(ing).trim().toLowerCase();
    // Remove leading amounts: 2 cups, 1/2 tsp, 1 lb, etc.
    s = s.replace(/^[\d¼½¾⅓⅔⅛⅜⅝⅞.,\s]+/, '');
    s = s.replace(/^(cup|cups|tbsp|tsp|oz|lb|g|kg|ml|l|can|cans|clove|cloves|pinch|piece|pieces|slice|slices|teaspoon|tablespoon|ounce|ounces|gram|grams|pound|pounds)\s+/i, '');
    // Remove parenthetical notes
    s = s.replace(/\s*\([^)]*\)\s*/g, ' ');
    // Remove trailing descriptors (optional, chopped, etc.)
    s = s.replace(/,?\s*(optional|chopped|diced|minced|finely|roughly|thinly|fresh|dried|divided)\s*$/i, '');
    s = s.replace(/\s+/g, ' ').trim();
    return s || ing.trim();
  };

  const isCommonHousehold = (item) => {
    const lower = item.toLowerCase();
    if (COMMON_HOUSEHOLD.has(lower)) return true;
    return [...COMMON_HOUSEHOLD].some((h) => lower.includes(h) || h.includes(lower));
  };

  const buildGroceryList = (ingredients) => {
    const seen = new Set();
    const items = [];
    (ingredients || []).forEach((ing) => {
      const raw = String(ing).trim();
      if (!raw) return;
      const parsed = parseGroceryItem(raw);
      const key = parsed.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ raw, parsed, isHousehold: isCommonHousehold(parsed) });
    });
    // Sort: non-household first (checked), household last (unchecked)
    items.sort((a, b) => (a.isHousehold === b.isHousehold ? 0 : a.isHousehold ? 1 : -1));
    return items;
  };

  let currentGroceryItems = [];

  const openGroceryModal = () => {
    if (!currentDetail) return;
    const ingredients = currentDetail.ingredients || [];
    currentGroceryItems = buildGroceryList(ingredients);
    groceryModalTitle.textContent = `Grocery List: ${currentDetail.title || 'Recipe'}`;
    renderGroceryList();
    groceryModal.classList.remove('hidden');
  };

  const renderGroceryList = () => {
    if (!groceryListItems) return;
    groceryListItems.innerHTML = '';
    const items = Array.isArray(currentGroceryItems) ? currentGroceryItems : [];
    if (items.length === 0) {
      const p = document.createElement('p');
      p.className = 'text-text-muted text-sm py-4';
      p.textContent = 'No ingredients in this recipe.';
      groceryListItems.appendChild(p);
      return;
    }
    items.forEach((item, idx) => {
      const label = document.createElement('label');
      label.className = 'flex items-center gap-2 py-1.5 cursor-pointer hover:bg-white/5 rounded px-2 -mx-2 transition-colors';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'rounded border-white/20 bg-page text-cyan-400 focus:ring-cyan-400/50';
      cb.checked = !item.isHousehold;
      cb.dataset.idx = String(idx);
      const span = document.createElement('span');
      span.className = 'text-text-secondary text-sm';
      span.textContent = item.raw;
      label.appendChild(cb);
      label.appendChild(span);
      groceryListItems.appendChild(label);
    });
  };

  const closeGroceryModal = () => {
    groceryModal.classList.add('hidden');
  };

  const getCheckedGroceryItems = () =>
    currentGroceryItems
      .map((item, idx) => {
        const cb = groceryListItems?.querySelector(`input[data-idx="${idx}"]`);
        return cb?.checked ? item.raw : null;
      })
      .filter(Boolean);

  const copyGroceryToClipboard = async () => {
    const checked = getCheckedGroceryItems();
    if (checked.length === 0) {
      alert('Select at least one item to copy.');
      return;
    }
    const title = `Grocery: ${currentDetail?.title || 'List'}`;
    const text = `${title}\n\n${checked.map((i) => `- [ ] ${i}`).join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      const orig = groceryCopyBtn?.innerHTML;
      if (groceryCopyBtn) groceryCopyBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
      setTimeout(() => { if (groceryCopyBtn && orig) groceryCopyBtn.innerHTML = orig; }, 1500);
    } catch (e) {
      alert('Could not copy. Try selecting text manually.');
    }
  };

  const addToNotesViaShortcut = async () => {
    const checked = getCheckedGroceryItems();
    if (checked.length === 0) {
      alert('Select at least one item.');
      return;
    }
    const text = checked.join('\n');
    const origBtn = groceryShortcutBtn?.innerHTML;
    try {
      // When shortcut is launched from browser, input=clipboard gives literal "clipboard" not contents—pass text in URL
      const encoded = encodeURIComponent(text);
      const SAFE_URL_PAYLOAD = 1400; // stay under typical truncation limits
      if (encoded.length <= SAFE_URL_PAYLOAD) {
        window.location.href = `shortcuts://run-shortcut?name=Add%20Grocery%20To%20Notes&input=text&text=${encoded}`;
      } else {
        await navigator.clipboard.writeText(text);
        alert(`List has ${checked.length} items (too long for one-tap). Copied to clipboard—open Shortcuts and run "Add Grocery To Notes" manually.`);
        return;
      }
      if (groceryShortcutBtn) groceryShortcutBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Done</span>';
      setTimeout(() => { if (groceryShortcutBtn && origBtn) groceryShortcutBtn.innerHTML = origBtn; }, 2000);
    } catch (e) {
      alert('Could not send. Try "Copy to clipboard" then run the shortcut from the Shortcuts app.');
    }
  };

  if (groceryListBtn) groceryListBtn.addEventListener('click', openGroceryModal);
  if (closeGroceryModalBtn) closeGroceryModalBtn.addEventListener('click', closeGroceryModal);
  if (groceryCopyBtn) groceryCopyBtn.addEventListener('click', copyGroceryToClipboard);
  if (groceryShortcutBtn) groceryShortcutBtn.addEventListener('click', addToNotesViaShortcut);

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
  if (detailTrashBtn) detailTrashBtn.addEventListener('click', () => showDetailView('manage'));
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
      screenshot: inlineEditScreenshot !== undefined ? inlineEditScreenshot : currentDetail.screenshot,
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
        if (updatedData.screenshot) {
          detailImage.src = updatedData.screenshot;
          detailImageContainer.classList.remove('hidden');
          detailRecipePanel.classList.remove('pt-2');
          detailRecipePanel.classList.add('pt-6');
        } else {
          detailImageContainer.classList.add('hidden');
          detailRecipePanel.classList.remove('pt-6');
          detailRecipePanel.classList.add('pt-2');
        }
        showDetailTab('recipe');
        fetchRecipes();
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
    } finally {
      inlineSaveBtn.disabled = false;
      inlineSaveBtn.textContent = 'Save';
    }
  });

  if (inlineEditImageInput) {
    inlineEditImageInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || !file.type.startsWith('image/')) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await fetch('/api/recipes/upload-image', { method: 'POST', body: formData });
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || 'Upload failed');
          return;
        }
        inlineEditScreenshot = data.path;
        syncInlineEditImageUI();
      } catch (err) {
        console.error(err);
        alert('Failed to upload image');
      }
    });
  }
  if (inlineEditImageRemoveBtn) {
    inlineEditImageRemoveBtn.addEventListener('click', () => {
      inlineEditScreenshot = null;
      syncInlineEditImageUI();
    });
  }
  if (inlineEditImageUrlBtn && inlineEditImageUrlInput) {
    inlineEditImageUrlBtn.addEventListener('click', () => {
      const url = (inlineEditImageUrlInput.value || '').trim();
      if (!url) return;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('Please enter a valid URL (e.g. https://...)');
        return;
      }
      inlineEditScreenshot = url;
      inlineEditImageUrlInput.value = '';
      syncInlineEditImageUI();
    });
  }
  if (recipeFetchImagesBtn && recipeImagePicker) {
    recipeFetchImagesBtn.addEventListener('click', async () => {
      const url = (inlineEditUrl && inlineEditUrl.value ? inlineEditUrl.value.trim() : null) || (currentDetail && currentDetail.url ? currentDetail.url.trim() : null);
      if (!url) {
        alert('Enter the recipe source URL first (or save the recipe with a URL).');
        return;
      }
      recipeFetchImagesBtn.disabled = true;
      recipeFetchImagesBtn.textContent = 'Fetching…';
      recipeImagePicker.innerHTML = '';
      recipeImagePicker.classList.remove('hidden');
      try {
        const response = await fetch(`/api/site-images?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || 'Could not fetch images.');
          return;
        }
        const images = data.images || [];
        if (images.length === 0) {
          recipeImagePicker.innerHTML = '<p class="text-sm text-text-muted w-full">No images found on this page.</p>';
          return;
        }
        images.forEach(({ url: imgUrl }) => {
          const safeUrl = safeImageUrl(imgUrl);
          if (!safeUrl) return;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `w-12 h-12 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-colors ${inlineEditScreenshot === imgUrl ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-white/20 hover:border-white/40'}`;
          btn.innerHTML = `<img src="${safeUrl.replace(/"/g, '&quot;')}" alt="" class="w-full h-full object-contain bg-elevated" onerror="this.parentElement.innerHTML='<span class=\\'text-text-muted text-xs\\'>?</span>'">`;
          btn.addEventListener('click', () => {
            inlineEditScreenshot = imgUrl;
            recipeImagePicker.querySelectorAll('button').forEach((b) => b.classList.remove('border-cyan-400', 'ring-2', 'ring-cyan-400/30'));
            btn.classList.add('border-cyan-400', 'ring-2', 'ring-cyan-400/30');
            syncInlineEditImageUI();
          });
          recipeImagePicker.appendChild(btn);
        });
      } catch (err) {
        console.error(err);
        alert('Failed to fetch images.');
      } finally {
        recipeFetchImagesBtn.disabled = false;
        recipeFetchImagesBtn.textContent = 'Fetch images from recipe URL';
      }
    });
  }

  if (refreshFromUrlBtn && inlineEditUrl) {
    refreshFromUrlBtn.addEventListener('click', async () => {
      const url = inlineEditUrl.value.trim();
      if (!url) {
        alert('Enter a source URL first.');
        return;
      }
      refreshFromUrlBtn.disabled = true;
      refreshFromUrlBtn.classList.add('animate-spin');
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
        refreshFromUrlBtn.classList.remove('animate-spin');
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
      const data = response.ok ? await response.json() : [];
      allRecipes = Array.isArray(data) ? data : [];
      fetchErrorRecipes = false;
      renderCards();
    } catch (error) {
      console.error('Error fetching recipes:', error);
      allRecipes = [];
      fetchErrorRecipes = true;
      renderCards();
    }
    updateFetchErrorBanner();
  };

  if (viewAppIconsBtn) viewAppIconsBtn.addEventListener('click', () => setViewToggle('appIcons'));
  if (viewCardsBtn) viewCardsBtn.addEventListener('click', () => setViewToggle('cards'));

  // Initial layout button state (settings modal)
  syncSettingsLayoutButtons();

  if (cardFilter) cardFilter.addEventListener('change', renderCards);
  if (foodTypeFilter) foodTypeFilter.addEventListener('change', renderCards);
  if (tagFilter) tagFilter.addEventListener('change', renderCards);
  if (typeFilter) typeFilter.addEventListener('change', renderCards);

  const settingsNavLayout = document.getElementById('settings-nav-layout');
  const settingsNavFoodTypes = document.getElementById('settings-nav-food-types');
  const settingsNavTags = document.getElementById('settings-nav-tags');
  const settingsPanelLayout = document.getElementById('settings-panel-layout');
  const settingsPanelFoodTypes = document.getElementById('settings-panel-food-types');
  const settingsPanelTags = document.getElementById('settings-panel-tags');

  const showSettingsSection = (section) => {
    [settingsPanelLayout, settingsPanelFoodTypes, settingsPanelTags].forEach((el) => {
      if (el) el.classList.add('hidden');
    });
    [settingsNavLayout, settingsNavFoodTypes, settingsNavTags].forEach((el) => {
      if (el) el.classList.remove('active');
    });
    const panel = section === 'layout' ? settingsPanelLayout : section === 'food-types' ? settingsPanelFoodTypes : settingsPanelTags;
    const nav = section === 'layout' ? settingsNavLayout : section === 'food-types' ? settingsNavFoodTypes : settingsNavTags;
    if (panel) panel.classList.remove('hidden');
    if (nav) nav.classList.add('active');
    if (section === 'food-types') renderFoodTypesList();
    if (section === 'tags') renderTagsList();
  };

  const openSettingsModal = () => {
    if (settingsModal) settingsModal.classList.remove('hidden');
    syncSettingsLayoutButtons();
    showSettingsSection('layout');
  };
  const closeSettingsModal = () => {
    if (settingsModal) settingsModal.classList.add('hidden');
  };

  if (settingsNavLayout) settingsNavLayout.addEventListener('click', () => showSettingsSection('layout'));
  if (settingsNavFoodTypes) settingsNavFoodTypes.addEventListener('click', () => showSettingsSection('food-types'));
  if (settingsNavTags) settingsNavTags.addEventListener('click', () => showSettingsSection('tags'));

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
    const list = Array.isArray(allFoodTypes) ? allFoodTypes : [];
    if (list.length === 0) {
      const li = document.createElement('li');
      li.className = 'text-text-muted text-sm py-2 px-3';
      li.textContent = 'No food types yet. Add one above.';
      foodTypesList.appendChild(li);
      return;
    }
    list.forEach((t) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-elevated/50';
      li.innerHTML = `<span class="text-text-secondary font-medium">${escapeHtml(t.name)}</span><button type="button" class="food-type-delete text-red-400 hover:text-red-300 text-sm font-medium" data-id="${escapeHtml(t.id)}">Delete</button>`;
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
    const list = Array.isArray(allTags) ? allTags : [];
    if (list.length === 0) {
      const li = document.createElement('li');
      li.className = 'text-text-muted text-sm py-2 px-3';
      li.textContent = 'No tags yet. Add one above.';
      tagsList.appendChild(li);
      return;
    }
    list.forEach((t) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-elevated/50';
      li.innerHTML = `<span class="text-text-secondary font-medium">${escapeHtml(t.name)}</span><button type="button" class="tag-delete text-red-400 hover:text-red-300 text-sm font-medium" data-id="${escapeHtml(t.id)}">Delete</button>`;
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
    const addTag = async () => {
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
    };
    addTagBtn.addEventListener('click', addTag);
    newTagInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } });
  }
  if (addFoodTypeBtn && newFoodTypeInput) {
    const addFoodType = async () => {
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
    };
    addFoodTypeBtn.addEventListener('click', addFoodType);
    newFoodTypeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addFoodType(); } });
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
      const mainUrl = restaurantMainUrlInput ? restaurantMainUrlInput.value.trim() || null : null;
      const orderingUrl = restaurantOrderingUrlInput.value.trim() || null;
      const iconUrl = restaurantFormIconUrl || null;
      const foodType = restaurantFoodType && restaurantFoodType.value ? restaurantFoodType.value.trim() : null;
      restaurantSaveBtn.disabled = true;
      try {
        if (currentRestaurant) {
          const response = await fetch(`/api/restaurants/${currentRestaurant.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, mainUrl, orderingUrl, iconUrl, foodType, tags: restaurantFormTags || [], dateAdded: currentRestaurant.dateAdded })
          });
          if (!response.ok) throw new Error('Update failed');
        } else {
          const response = await fetch('/api/restaurants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, mainUrl, orderingUrl, iconUrl, foodType, tags: restaurantFormTags || [] })
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

  if (restaurantFetchIconsBtn && restaurantIconPicker) {
    restaurantFetchIconsBtn.addEventListener('click', async () => {
      const url = restaurantMainUrlInput ? restaurantMainUrlInput.value.trim() : '';
      if (!url) {
        alert('Enter the main site URL first.');
        return;
      }
      restaurantFetchIconsBtn.disabled = true;
      restaurantFetchIconsBtn.textContent = 'Fetching…';
      restaurantIconPicker.innerHTML = '';
      restaurantIconPicker.classList.remove('hidden');
      try {
        const response = await fetch(`/api/site-images?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || 'Could not fetch images.');
          return;
        }
        const images = data.images || [];
        if (images.length === 0) {
          restaurantIconPicker.innerHTML = '<p class="text-sm text-text-muted w-full">No images found on this page.</p>';
          return;
        }
        images.forEach(({ url: imgUrl }) => {
          const safeUrl = safeImageUrl(imgUrl);
          if (!safeUrl) return;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `w-12 h-12 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-colors ${restaurantFormIconUrl === imgUrl ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-white/20 hover:border-white/40'}`;
          btn.innerHTML = `<img src="${safeUrl.replace(/"/g, '&quot;')}" alt="" class="w-full h-full object-contain bg-elevated" onerror="this.parentElement.innerHTML='<span class=\\'text-text-muted text-xs\\'>?</span>'">`;
          btn.addEventListener('click', () => {
            restaurantFormIconUrl = imgUrl;
            restaurantIconPicker.querySelectorAll('button').forEach((b) => b.classList.remove('border-cyan-400', 'ring-2', 'ring-cyan-400/30'));
            btn.classList.add('border-cyan-400', 'ring-2', 'ring-cyan-400/30');
          });
          restaurantIconPicker.appendChild(btn);
        });
      } catch (err) {
        console.error(err);
        alert('Failed to fetch images.');
      } finally {
        restaurantFetchIconsBtn.disabled = false;
        restaurantFetchIconsBtn.textContent = 'Fetch images from site';
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

  const fetchRetryBtn = document.getElementById('fetch-retry-btn');
  if (fetchRetryBtn) {
    fetchRetryBtn.addEventListener('click', () => {
      fetchFoodTypes();
      fetchTags();
      fetchRecipes();
      fetchRestaurants();
    });
  }
});

const URL_USERS = 'https://json.medrating.org/users/';

const bodyElement = document.querySelector('.body');
const contentElement = document.querySelector('.content');
const usersElement = document.querySelector('.users');
const favoritesElement = document.querySelector('.favorites');
const catalogElement = document.querySelector('.catalog');
const favoritesPhotosElement = document.querySelector('.favorites-photos');
const photosFavoritesElements = document.querySelector('.photosFavorites');

// Создаём и возвращаем элемент-пользователь.
const createUser = (content, userID) => {
  let li = document.createElement('li');
  li.className = `users__item users__item_${userID}`;
  li.innerHTML = `
    <div class='wrapper wrapper_forItems closed'><i class="material-icons material-icons_chevron">chevron_right</i>${content}</div>
    <ul class='albums albums_${userID}'>
    </ul>
  `
  return li;
}

// Создаём и возвращаем элемент-альбом.
const createAlbum = (title, modificator) => {
  let li = document.createElement('li');
  li.className = `albums__item albums__item_${modificator}`;
  li.innerHTML = `
    <div id=${modificator} class='wrapper wrapper_forAlbums closed'><i class="material-icons material-icons_chevron">chevron_right</i>${title}</div>
      <ul class="photos photos_${modificator}">
      </ul>
    </li>
  `
  return li;
}

// Создаём элемент-фотография.
const createPhoto = id => {
  const photosElement = document.querySelector(`.photos_${id}`);
  fetch(`https://json.medrating.org/photos?albumId=${id}`)
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        let colorStar = null;

        for (let i = 0; i < localStorage.length; i ++) { // Добавляем фотографии из хранилища в 'photos'.
          let key = localStorage.key(i);
          let obj = JSON.parse(localStorage.getItem(key));
          (item.id == obj.id)
          if (item.id == obj.id) {
            colorStar = 'yellowStar'
          }
        }

        let li = document.createElement('li');
        li.className = `photos__item`;
        li.innerHTML = `
          <div class='wrapper wrapper_forPhotos closed'>
          <i class="material-icons material-icons_star${item.id} ${colorStar}">star</i>
          <img src="${item.thumbnailUrl}" id=${item.id} class='smallImg' title="${item.title}" />
          </div>
        `
        photosElement.appendChild(li);
        createBigPhoto(item)
      })
    })
}

// Создаём большую фотографию и добавляем её в элемент.
const createBigPhoto = (item) => {
  let img = document.createElement('img');
  img.className = `bigImg bigImg_${item.id} hide`;
  img.src = item.url;
  contentElement.prepend(img); // Добавляем большую фотографию в элемент.
}

// Показываем каталог пользователей.
const showUsers = () => {
  if (catalogElement.className.includes('hide')) {
    catalogElement.classList.remove('hide');
  }
  favoritesElement.classList.add('hide'); // Скрываем избранные фотографии.
  if (usersElement.children.length === 0) { // Если каталог пуст: загружаем каталог.
  fetch(URL_USERS)
    .then(response => response.json())
    .then(data => {
      addUsers(data) // Вызаваем функцию; передаём ей данные.
    }
  )
  }
}

// Вызываем создателя элемент-пользователь.
const addUsers = (data) => {
  data.forEach(item => {
    usersElement.appendChild(createUser(item.name, item.id)); // Добавляем элемент пользователь в элемент "users".
    fetch(`https://json.medrating.org/albums?userId=${item.id}`) // Загружаем альбомы.
    .then(response => response.json())
    .then(data => {
      addAlbums(data, item.id)  // Создаём элемент-альбом, передавая в него загруженные данные.
    })
  })
}

// Добавляем элемент-альбом в альбомы.
const addAlbums = (data, userID) => {
  data.forEach(item => {
    if (userID === item.userId) {
      const albumsElement = document.querySelector(`.albums_${userID}`);
      albumsElement.appendChild(createAlbum(item.title, item.id)) //
    }
  })
}

// Показываем или убираем элементы.
const showItems = event => {
  event.target.classList.toggle('closed');
  event.target.classList.toggle('arrowDown');
  if (event.target.className.includes('forAlbums')) { // Если щелчок произошёл на элементе-альбоме: вызываем загрузчик фотографий.
    createPhoto(event.target.id)
  }
}

// Скрываем блок.
const blockHide = event => {
  event.target.classList.toggle('hide');
  if (event.target.className.includes('bigImg')) {
    event.target.classList.toggle('hide');
  }
  if (event.target.className.includes('content') || event.target.className.includes('photosFavorites')) {
    Array.from(event.target.children).forEach(item => {
      if (item.className.includes('hide') === false) {
        item.classList.add('hide');
      }
    })
  }
}

// Создаём большую "избранную фотографию".
const createFavoritesBigPhotos = (obj) => {
  let img = document.createElement('img');
  img.className = `favoritesbigImg favoritesbigImg_${obj.id} hide`;
  img.src = obj.bigPhotoURL;

  photosFavoritesElements.prepend(img); // Добавляем большую фотографию в элемент.
}

// Записываем данные в "избранное".
const renderToFavorites = () => {
  favoritesPhotosElement.innerHTML = ''; // Очищаем избранное перед добавкой.

  for (let i = 0; i < localStorage.length; i ++) { // Добавляем фотографии из хранилища в 'photos'.
    let key = localStorage.key(i);
    let obj = JSON.parse(localStorage.getItem(key));
    let li = document.createElement('li'); // Создаём элемент списка, содержащий фотографию.
    li.className = `favorites-photos__item favoritePhoto`;
    li.innerHTML = `
      <h4 class='favoritePhoto__title'>${obj.title}</h4>
      <div class='favorites-photos__item-wrapper'>
        <i class="material-icons material-icons_star${obj.id} active">star</i>
        <img src="${obj.smallPhotoURL}" class='smallImg' id=${obj.id} title="" />
      <div/>
    `
    createFavoritesBigPhotos(obj)
    favoritesPhotosElement.appendChild(li); // Добавляем элемент списка в избранное.
  }
}

// Показываем избранные фотографии.
const showFavoritesElements = () => {
  if (favoritesElement.className.includes('hide')) {
    favoritesElement.classList.remove('hide');
  }
  catalogElement.classList.add('hide');
  renderToFavorites();
}

// Показываем большую картинку.
const showBigImg = event => {
  const bigPhotoElement = document.querySelector(`.bigImg_${event.target.id}`);
  if (bigPhotoElement !== null) {
    contentElement.classList.toggle('hide');
    bigPhotoElement.classList.toggle('hide');
  } else {
    const bigPhotoElement = document.querySelector(`.favoritesbigImg_${event.target.id}`);
    photosFavoritesElements.classList.toggle('hide');
    bigPhotoElement.classList.toggle('hide');
  }
}

// Записываем или удаляем данные из localStorage.
const recoverOrRemove = event => {
  if (localStorage.getItem(event.target.nextElementSibling.id) === null) {
    event.target.classList.add('active')
    let obj = {
      id: event.target.nextElementSibling.id,
      title: event.target.nextElementSibling.title,
      smallPhotoURL: event.target.nextElementSibling.src,
      bigPhotoURL: document.querySelector(`.bigImg_${event.target.nextElementSibling.id}`).src
    }
    localStorage.setItem(event.target.nextElementSibling.id, JSON.stringify(obj))
  } else {
    event.target.classList.remove('active')
    document.querySelector(`.material-icons_star${event.target.nextElementSibling.id}`).classList.remove('yellowStar')
    document.querySelector(`.material-icons_star${event.target.nextElementSibling.id}`).classList.remove('active')
    localStorage.removeItem(event.target.nextElementSibling.id)
  }
  renderToFavorites();
}

const handleBody = event => {
  if (event.target.className.includes('smallImg') ) {
    showBigImg(event);
  }
  if (event.target.className.includes(`material-icons_star${event.target.id}`)) {
    recoverOrRemove(event);
  }
  if (event.target.className.includes('content') || event.target.className.includes('photosFavorites')) {
    blockHide(event)
  }
  if (event.target.className.includes('navigation__catalog')) {
    showUsers();
  }
  if (event.target.className.includes('navigation__favorites')) {
    showFavoritesElements();
  }
}


bodyElement.addEventListener('click', handleBody);
usersElement.addEventListener('click', showItems);
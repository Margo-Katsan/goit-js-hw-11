import api from './pixabay-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const inputEl = document.querySelector('input[name="searchQuery"]');
const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const endMessageEl = document.querySelector('.end-message');

formEl.addEventListener('submit', onSerchPhotos);
loadMoreBtnEl.addEventListener('click', onLoadMore);

const API = new api;

function onSerchPhotos(event) {
  event.preventDefault();
  if(!inputEl.value) {
    return;
  }
  API.query = inputEl.value;
  API.resetPage();
  endMessageEl.classList.add('is-hidden');
  API.fetchPhotos()
  .then(data => {
    Notify.init({
      width: '300px',
      position: 'center-center',
    });
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    if (data.hits.length === 0) {
      notifyWarning();
    }
    galleryEl.insertAdjacentHTML('beforeend', renderCard(data.hits));
    initLightbox();
    loadMoreBtnEl.classList.remove('is-hidden');
    if (data.totalHits === galleryEl.children.length) {
      loader();
    }
  })
  .catch(notifyError);
}
function onLoadMore() {
  API.incrementPage();
  API.fetchPhotos()
  .then(data => {
    if (data.hits.length === 0) {
      notifyWarning();
    }
    galleryEl.insertAdjacentHTML('beforeend', renderCard(data.hits));
    initLightbox();
    
    if (data.totalHits === galleryEl.children.length) {
      loader();
    }
  })
  .catch(notifyError);
}
function renderCard(hitsArray) {
  if (hitsArray.length !== 0 && API.page === 1)  {
    destroyCard();
  }
  return hitsArray.map(hit => {
    return `
    <li class="photo-card">
      <a class="gallery__link" href="${hit.largeImageURL}" onclick="event.preventDefault()">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width="300"/>
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes: ${hit.likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${hit.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${hit.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${hit.downloads}</b>
        </p>
      </div>
    </li>
    `
  }).join(" ");
}
function destroyCard() {
  [...galleryEl.children].forEach(gallery => {
    gallery.remove();
  });
}
function notifyWarning() {
  Notify.init({
    width: '300px',
    position: 'center-center',
  });
  Notify.warning('Sorry, there are no images matching your search query. Please try again.');
}
function notifyError() {
  Notify.init({
    width: '500px',
    position: 'center-top',
  })
  Notify.failure('Oops! Something went wrong! Try reloading the page!');
}
function initLightbox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
  lightbox.refresh();
}
function loader() {
  endMessageEl.classList.remove('is-hidden');
  loadMoreBtnEl.classList.add('is-hidden');
}








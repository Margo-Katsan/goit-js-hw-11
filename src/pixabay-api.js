export default class pixabayApi {
  constructor() {
    this.searchQuery = '';
    this.pageQuery = 1;
  }
  get query() {
    return this.searchQuery;
  }
  get page() {
    return this.pageQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  incrementPage() {
    this.pageQuery += 1;
  }
  resetPage() {
    this.pageQuery = 1;
  }
  async fetchPhotos() {
    try {
      const BASE_URL = 'https://pixabay.com/api/';
      const API_KEY = '37696305-6a7afe6a6eccc7277829ccd16';
      const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.pageQuery}&per_page=40`);
      if(!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    }
    catch (e) {
      console.log(e);
    }
  }
}





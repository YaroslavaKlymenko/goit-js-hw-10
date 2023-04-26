import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const handleInput = debounce(() => {
  const searchQuery = searchBox.value.trim();

  if (!searchQuery) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length === 1) {
        const [country] = countries;
        renderCountryInfo(country);
        clearCountryList();
      } else if (countries.length <= 10) {
        renderCountryList(countries);
        clearCountryInfo();
      } else {
        clearCountryInfo();
        clearCountryList();
        Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
      }
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure('Oops, there was an error retrieving country data.');
    });
}, 300);

function renderCountryList(countries) {
  if (countries.length === 0) {
    clearCountryList();
    Notiflix.Notify.failure('No countries found with that name.');
    return;
  }

  const fontSize = parseInt(getComputedStyle(countryList).fontSize);
  const markup = countries
    .map(country => `
      <li class="country-item">
        <img src="${country.flags.svg}" alt="${country.name} flag" height="${fontSize}">
        ${country.name}
      </li>
    `)
    .join('');
  countryList.innerHTML = markup;
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function renderCountryInfo(country) {
  const markup = `
    <h2>${country.name}</h2>
    <div>Capital: ${country.capital}</div>
    <div>Population: ${country.population}</div>
    <div>Languages: ${country.languages.map(lang => lang.name).join(', ')}</div>
    <img src="${country.flags.svg}" alt="${country.name} flag" width="200" height="150">
  `;
  countryInfo.innerHTML = markup;
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}

searchBox.addEventListener('input', handleInput);

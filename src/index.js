import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const countries = event.target.value.trim();
  if (countries === '') {
    clearPage();
  } else {
    fetchCountries(countries)
      .then(data => {
        if (data.length > 10) {
          logInfo();
        } else if (data.length > 1) {
          countryInfo.innerHTML = '';
          countryList.innerHTML = listCountriesMarkup(data);
        } else {
          countryList.innerHTML = '';
          countryInfo.innerHTML = infoCountryMarkup(data);
        }
      })
      .catch(logError);
  }
}

function clearPage() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function logInfo() {
  Notify.info('Too many matches found. Please enter a more specific name.', {
    clickToClose: true,
  });
}

function logError() {
  Notify.failure('Oops, there is no country with that name', {
    clickToClose: true,
  });
}

function listCountriesMarkup(countries) {
  return countries
    .map(country => {
      return `<li style='list-style:none; display: flex; align-items: center; gap: 10px'><img src='${country.flags.svg}' width='20' height="20"><p>${country.name}</p></li>`;
    })
    .join('');
}

function infoCountryMarkup(countries) {
  const country = countries[0];
  const languages = country.languages
    .reduce((acc, language) => {
      acc.push(language.name);
      return acc;
    }, [])
    .join(', ');
  const { flags, name, capital, population } = country;

  return `<div style = 'display: flex; align-items: center; gap: 10px'><img src = '${flags.svg}' width='60' height = '60'><h1>${name}</h1></div><p><span style = 'font-weight: 700'>Capital:</span> ${capital}</p><p><span style = 'font-weight: 700'>Population:</span> ${population}</p><p><span style = 'font-weight: 700'>Languages:</span> ${languages}</p>`;
}

export function fetchCountries(name) {
    return fetch(`https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`)
      .then(response => response.json())
      .then(countries => {
        return countries;
      })
      .catch(error => {
        console.error('Error fetching countries: ', error);
      });
  }
  
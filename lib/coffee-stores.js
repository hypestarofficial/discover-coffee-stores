//initialize unsplash
import { createApi } from 'unsplash-js';

// on your node server
const unsplashApi = createApi({
  accessKey: 'zMp3qGTc7uDZQn-QGj51Dzh9OBLxnfuPPIVqVF9eq-g',
  //...other fetch options
});

const getUrlForCoffeeStores = (latLong, query, limit, radius) => {
  return `https://api.foursquare.com/v3/places/search?ll=${latLong}&query=${query}&limit=${limit}&radius=${radius}`;
};

const getListOfCoffeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee store',
    perPage: 40,
  });

  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls['small']);
};

export const fetchCoffeeStores = async (
  latLong = '48.7424,21.2467712' /*'29.739113862858495,-95.36883114047225'*/,
  limit = 8,
  radius = 5000
) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'fsq3wPB4vnWlhS5mD3/EBd1cZtdirL04LpIuLEqNollsgK0=',
    },
  };

  const photos = await getListOfCoffeStorePhotos();
  const response = await fetch(
    getUrlForCoffeeStores(latLong, '', limit, radius),
    options
  );
  const data = await response.json();
  console.log(data);

  // return data.results;
  return data.results?.map((results, idx) => {
    return {
      ...results,
      imgUrl: photos[idx],
    };
  });
};

import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
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
  latLong = '48.7424,21.2467712',
  limit = 12,
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
    getUrlForCoffeeStores(latLong, 'coffee', limit, radius),
    options
  );
  const data = await response.json();
  return data.results?.map((results, idx) => {
    const neighborhood = results.location.neighborhood;
    return {
      id: results.fsq_id,
      address: results.location.address || '',
      name: results.name,
      neighborhood:
        (neighborhood && neighborhood.length > 0 && neighborhood[0]) || '',
      imgUrl: photos[idx],
    };
  });
};

import { useContext, useState } from 'react';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

const useTrackLocation = () => {
  const [locationError, setLocationError] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` },
    });
    setLocationError('');
    setIsFindingLocation(false);
  };

  const error = () => {
    setIsFindingLocation(false);
    setLocationError('Unable to retrieve your location');
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
      });
    }
  };

  return {
    handleTrackLocation,
    locationError,
    isFindingLocation,
  };
};

export default useTrackLocation;

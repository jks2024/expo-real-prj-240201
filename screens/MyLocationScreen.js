import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {MAP_KEY} from '../utils/env';
import {useContext} from 'react';
import {UserContext} from '../contexts/UserContext';

const MyLocationScreen = () => {
  const {setLocation} = useContext(UserContext);

  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      fetchDetails={true}
      GooglePlacesSearchQuery={{
        rankby: 'distance',
      }}
      onPress={(data, details = null) => {
        if (details) {
          setLocation({
            name: data.description,
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          });
        }
      }}
      query={{
        key: MAP_KEY,
        language: 'ko',
      }}
    />
  );
};

export default MyLocationScreen;

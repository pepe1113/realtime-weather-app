import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { getMoment, availableLocations, findLocation } from './utils/helpers';
import WeatherCard from './views/WeatherCard';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './views/WeatherSetting';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow: '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const AUTHORIZATION_KEY = 'CWB-56E7E9C5-9C76-4A1D-AB95-C30327F5F21E';

const App = () => {
  const storageCity = localStorage.getItem('cityName') || '臺北市';
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const [currentCity, setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const { cityName, locationName, sunriseCityName } = currentLocation;
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });
  // TODO: 等使用者可以修改地區時要修改裡面的參數，先將 dependencies array 設為空陣列
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage == 'WeatherCard' && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
        {currentPage == 'WeatherSetting' && (
          <WeatherSetting
            cityName={cityName}
            handleCurrentPageChange={handleCurrentPageChange}
            handleCurrentCityChange={handleCurrentCityChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;

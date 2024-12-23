const manifest = {
  id: 'weather',
  name: '날씨 블록',
  description: '현재 위치의 날씨 정보를 보여주는 블록을 추가합니다.',
  version: '1.0.0',
  author: 'Pepper Team',
  permissions: ['network'],
};

const WeatherBlock = ({ block }) => {
  const [weather, setWeather] = React.useState(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${block.properties.apiKey}&units=metric`
        );
        const data = await response.json();
        setWeather(data);
      });
    }
  }, [block.properties.apiKey]);

  if (!weather) return '날씨 정보를 불러오는 중...';

  return (
    <div className="p-4 rounded-lg border">
      <h3 className="text-lg font-medium">{weather.name}의 날씨</h3>
      <div className="mt-2">
        <p>온도: {weather.main.temp}°C</p>
        <p>습도: {weather.main.humidity}%</p>
        <p>날씨: {weather.weather[0].description}</p>
      </div>
    </div>
  );
};

export default {
  manifest,
  async activate(context) {
    console.log('Weather plugin activated');
  },
  async deactivate() {
    console.log('Weather plugin deactivated');
  },
  renderBlock: WeatherBlock,
};

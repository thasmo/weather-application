# Weather Application

A responsive weather application built with Vue 3, TypeScript, and the Open-Meteo API. This application provides current weather conditions and forecasts with a clean, intuitive interface.
The application was created as an experimental project, primarily "vibe coded" with Windsurf/Claude Sonnet.

## Features

- **Current Weather Conditions**: View temperature, humidity, wind speed, pressure, and precipitation
- **7-Day Forecast**: Plan ahead with daily weather forecasts
- **Hourly Forecasts**: Detailed hourly weather information for each day
- **Location Detection**: Automatically detect your location or use default location
- **Customization Options**:
  - Toggle between Celsius and Fahrenheit
  - Switch between 12-hour and 24-hour time formats
  - Choose between simple and advanced forecast views
  - Light and dark theme support
- **Multilingual Support**: Available in multiple languages

## Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: UnoCSS (Atomic CSS engine)
- **Weather Data**: Open-Meteo API
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

The application follows a clean, modular architecture:

- `src/components/`: Reusable UI components
- `src/composables/`: Shared composition functions (like `useWeather`)
- `src/views/`: Page components
- `src/locales/`: Internationalization files
- `src/assets/`: Static assets and styles

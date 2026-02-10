// weather.ts

// Interface representing a weather condition
export interface WeatherCondition {
    description: string;
    icon: string;
}

// Interface representing the main weather data
export interface WeatherMain {
    temp: number;
    pressure: number;
    humidity: number;
}

// Interface representing the overall weather data response
export interface WeatherResponse {
    conditions: WeatherCondition[];
    main: WeatherMain;
    name: string;
}
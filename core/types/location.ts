// Define the types for Location and Coordinate

type Coordinate = {  
    latitude: number;  
    longitude: number;  
};  

interface Location {  
    name: string;  
    coordinates: Coordinate;  
    description?: string;  
}
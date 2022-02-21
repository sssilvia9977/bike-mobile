export class DataTemplate {
    name: string; // init with the device id
    description: string; //init cu Bike journey data collected on DATE 28.11.2021
    properties?: Properties;

    constructor() {
        this.name = null;
        this.description = null;
        this.properties = null;
    }
}

export class Properties {
    style?: string;
    addWhatNeeded?: string;
}

export class Locations {
    name: string;
    description: string;
    encodingType: string;
    location: Location; //init

    constructor() {
        this.name = "Cluj Napoca";
        this.description = "Bike journey data collected in Cluj Napoca";
        this.encodingType = "application/vnd.geo+json";
        this.location = new Location();
    }
}

export class Location {
    type: string;
    coordinates: number[]

    constructor() {
        this.type = "Point"
        this.coordinates = [46.77127, 23.6236];
       // this.coordinates = [];
    }
}

export class MultiDatastreams {
    name: string;
    description: string;
    multiObservationDataTypes: string[];
    unitOfMeasurements: UnitOfMeasurement[] // init unit of m
    Sensor: Sensor
    ObservedProperties: ObservedPropertie[] // init
    Observations: Observation[] // cele colectate

    constructor() {
        this.name = "GPS Coordinates"
        this.description = "Data collected from phone GPS Coordinates of the journey - lat, long, speed, altitude, orX, orY, orZ, accX, accY, accZ"
        this.multiObservationDataTypes = [
            "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
            "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
            "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
            "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
            "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
            "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
            "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
            "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement"
        ]
        this.unitOfMeasurements = [
            {
                "name": "decimal degrees",
                "symbol": "dd",
                "definition": "ucum:dd"
            },
            {
                "name": "decimal degrees",
                "symbol": "dd",
                "definition": "ucum:dd"
            },
            {
                "name": "orientation x",
                "symbol": "°/s",
                "definition": "angular velocity - degrees per second"
            },
            {
                "name": "orientation y",
                "symbol": "°/s",
                "definition": "angular velocity - degrees per second"
            },
            {
                "name": "orientation z",
                "symbol": "°/s",
                "definition": "angular velocity - degrees per second"
            },
            {
                "name": "acceleration x",
                "symbol": "m/s^2",
                "definition": "metre per second per second"
            },
            {
                "name": "acceleration y",
                "symbol": "m/s^2",
                "definition": "metre per second per second"
            },
            {
                "name": "acceleration z",
                "symbol": "m/s^2",
                "definition": "metre per second per second"
            }]
        this.Sensor = new Sensor();
        this.ObservedProperties = [{
            "name": "Latitude",
            "definition": "https://dbpedia.org/page/Latitude",
            "description": "The location latituded."
        },
        {
            "name": "Longitude",
            "definition": "https://dbpedia.org/page/longitude",
            "description": "The location longitude."
        },
        {
            "name": "orientation x",
            "definition": "https://dbpedia.org/page/Gyroscope",
            "description": "Orientation on the x axis."
        },
        {
            "name": "orientation y",
            "definition": "https://dbpedia.org/page/Gyroscope",
            "description": "Orientation on the y axis."
        },
        {
            "name": "orientation z",
            "definition": "https://dbpedia.org/page/Gyroscope",
            "description": "Orientation on the z axis."
        },
        {
            "name": "acceleration x",
            "definition": "https://dbpedia.org/page/Acceleration",
            "description": "Acceleration on the x axis."
        },
        {
            "name": "acceleration y",
            "definition": "https://dbpedia.org/page/Acceleration",
            "description": "Acceleration on the y axis."
        },
        {
            "name": "acceleration z",
            "definition": "https://dbpedia.org/page/Acceleration",
            "description": "Acceleration on the z axis."
        }
        ]
        this.Observations = [] // cele colectate
    }
}

export class UnitOfMeasurement {
    name: string
    symbol: string
    definition: string

    constructor() {
        this.name = null;
        this.symbol = null;
        this.definition = null;
    }
}

export class Sensor {
    name: string;
    description: string;
    encodingType: string;
    metadata: string;

    constructor() {
        this.name = "GPS location tracking"
        this.description = "GPS location tracking sensor from the user's phone"
        this.encodingType = "text"
        this.metadata = "GPS location tracking sensor from the user's phone"
    }
}

export class ObservedPropertie {
    name: string
    definition: string
    description: string

    constructor() {
        this.name = null;
        this.definition = null;
        this.description = null;
    }
}

export class Observation {
    phenomenonTime: any;
    result: number[]; // de adus la forma de number[]
}

export class Result {
    lat: number;
    long: number;
    speed: number;
    altitude: number;
    orientationX: number;
    orientationY: number;
    orientationZ: number;
    accX: number;
    accY: number;
    accZ: number;
}
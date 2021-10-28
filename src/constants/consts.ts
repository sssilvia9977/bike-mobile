export class GeolocationData {
    timeStamp: number;
    coordinatesLat: number;
    coordinatesLong: number;
    altitude: number;
    velocity: number;
};

export class AccelerationData {
    timeStamp: number;
    accelerationX: number;
    accelerationY: number;
    accelerationZ: number;
}

export class GyroscopeData {
    timeStamp: number;
    orientationX: number;
    orientationY: number;
    orientationZ: number;
}

export const SENSORS = {
    GEOPOSITION: "GEOPOSITION",
    GYROSCOPE: "GYROSCOPE",
    ACCELERATION: "ACCELERATION",
}

export const TrackedDataFields = {
    TIME_STAMP: "time_stamp",
    COORDS_LAT:"coordinates_lat",
    COORDS_LONG: "coordinates_long",
    ALTITUDE: "altitude",
    VELOCITY: "velocity",
}
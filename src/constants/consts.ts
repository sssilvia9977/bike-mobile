export class TrackedData {
    timeStamp: number;
    coordinatesLat: number;
    coordinatesLong: number;
    altitude: number;
    velocity: number;
};

export const TrackedDataFields = {
    TIME_STAMP: "time_stamp",
    COORDS_LAT:"coordinates_lat",
    COORDS_LONG: "coordinates_long",
    ALTITUDE: "altitude",
    VELOCITY: "velocity",
}
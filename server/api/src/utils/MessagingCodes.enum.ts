/**
 * ENUMs for defining the existing message types in the project
 */
export enum HouseMessagingCodes {
    ADD_HOUSE = 'ADD_HOUSE',
    CONTROL_DOOR = 'CONTROL_DOOR',
    CONTROL_WINDOW = 'CONTROL_WINDOW',
    GET_HOUSES = 'GET_HOUSES',
    GET_HOUSE = 'GET_HOUSE',
    ADD_WINDOW = 'ADD_WINDOW',
    DELETE_HOUSE = 'DELETE_HOUSE',
    GET_WINDOWS = 'GET_WINDOWS',
}


export enum OwnerMessagingCodes {
    REGISTER_OWNER = 'REGISTER_OWNER',
    LOGIN_OWNER = 'LOGIN_OWNER'
}

export type MessagingCodes = HouseMessagingCodes | OwnerMessagingCodes;
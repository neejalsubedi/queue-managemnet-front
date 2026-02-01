export enum AppointmentStatusEnum {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    BOOKED = "BOOKED",
    CHECKED_IN = "CHECKED_IN",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    NO_SHOW = "NO_SHOW",
    CANCELLED = "CANCELLED",
}
export  enum  AppointmentTypeEnum {

    COUNSELLING= "COUNSELLING",
    REGULAR_CHECKUP= "REGULAR_CHECKUP",
    FOLLOW_UP= "FOLLOW_UP",
    OPERATION= "OPERATION",
}

export enum AppointmentTimeEnum{
    Morning= "MORNING",
    Afternoon= "AFTERNOON",
    Evening= "EVENING",
    Any= "ANY",

}
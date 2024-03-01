import {formatDistanceToNow} from "date-fns";

export const getTransformedDate = (date: Date): string => formatDistanceToNow(date, { addSuffix: true })
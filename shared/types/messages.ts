export enum MESSAGE_TYPES {
  UPDATE_CONTENT = "UPDATE_CONTENT",
  REQUEST_CONTENT = "REQUEST_CONTENT",
  READY = "READY",
  ERROR = "ERROR",
}

export interface UpdateContentMessage {
  type: MESSAGE_TYPES.UPDATE_CONTENT;
  content: string;
}

export interface RequestContentMessage {
  type: MESSAGE_TYPES.REQUEST_CONTENT;
}

export interface ReadyMessage {
  type: MESSAGE_TYPES.READY;
}

export interface ErrorMessage {
  type: MESSAGE_TYPES.ERROR;
  error: string;
}

export type WebviewMessage =
  | UpdateContentMessage
  | RequestContentMessage
  | ReadyMessage
  | ErrorMessage;

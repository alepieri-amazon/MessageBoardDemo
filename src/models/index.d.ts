import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class User {
  readonly id: string;
  readonly username: string;
  readonly messages?: Message[];
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

export declare class Message {
  readonly id: string;
  readonly userID: string;
  readonly author?: string;
  readonly message?: string;
  readonly updatedOn?: string;
  constructor(init: ModelInit<Message>);
  static copyOf(source: Message, mutator: (draft: MutableModel<Message>) => MutableModel<Message> | void): Message;
}
import { account, session, user, verification } from "./schema/auth";
import { feed, feeditem } from "./schema/feed";
import { feedRelations, feeditemRelations } from "./schema/feedRelation";
import { todo } from "./schema/todo";

export default {
  todo,
  user,
  session,
  account,
  verification,
  feed,
  feeditem,
  feedRelations,
  feeditemRelations,
};

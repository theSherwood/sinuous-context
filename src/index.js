import { api } from "sinuous";
import { enableContext } from "./context";

enableContext(api);

export { context, Context, getContext } from "./context";

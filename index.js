import { api } from "sinuous";
import { enableContext } from "./src/context";

enableContext(api);

export { context, Context, getContext } from "./src/context";

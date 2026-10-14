import { sceneTile } from "@/lib/scene-tile";
import { seeds } from "../seeds";

// The project's tile on the home page, drawn like a post's.
export function GET() {
  return sceneTile(seeds.tile);
}

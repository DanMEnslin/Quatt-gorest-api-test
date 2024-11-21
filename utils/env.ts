import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default class ENV {
  public static BASE_URL = process.env.BASE_URL;
  public static BEARER_TOKEN = process.env.BEARER_TOKEN;
}

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from "class-validator";
import { plainToInstance, Type } from "class-transformer";
import { randomUUID } from "crypto";

class EnvConfig {
  @Type(() => Number)
  @IsNumber()
  public PORT: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  public MONGODB: string;

  @Type(() => String)
  @IsEnum(["development", "production"])
  @IsNotEmpty()
  public NODE_ENV: "development" | "production";

  @Type(() => String)
  @IsString()
  @IsOptional()
  public ORIGIN?: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  public SECRET: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public REFRESH_EXPIRES_IN: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public ACCESS_EXPIRES_IN: number;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  public SUPABASE_URL: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  public SUPABASE_SERVICE_ROLE_KEY: string;

  @Type(() => String)
  @IsString()
  public ICON_BUCKET: string;

  @Type(() => String)
  @IsString()
  public AVATAR_BUCKET: string;

  @Type(() => String)
  @IsString()
  public BACKGROUND_BUCKET: string;
}

function loadEnv() {
  const env = {
    MONGODB: process.env.MONGODB || "mongodb://127.0.0.1:27017/deeplocal",
    REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || 2592000,
    ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN || 300,
    SECRET: process.env.SECRET || randomUUID(),
    NODE_ENV: process.env.NODE_ENV || "production",
    PORT: process.env.PORT || 3000,
    ORIGIN: process.env.ORIGIN,
    AVATAR_BUCKET: process.env.AVATAR_BUCKET || "avatars",
    ICON_BUCKET: process.env.ICON_BUCKET || "icons",
    BACKGROUND_BUCKET: process.env.BACKGROUND_BUCKET || "backgrounds",
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  const data = plainToInstance(EnvConfig, env, {
    enableImplicitConversion: true,
  });

  const result = validateSync(data);

  if (result.length > 0) {
    throw new Error("Invalid environment variable", { cause: result });
  }

  Object.assign(process.env, data);

  return data;
}

export const env = loadEnv();

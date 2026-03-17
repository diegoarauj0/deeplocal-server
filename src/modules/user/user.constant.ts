export class USER_CONSTANT {
  public static readonly USERNAME_LENGTH_MIN = 3;
  public static readonly USERNAME_LENGTH_MAX = 16;

  public static readonly NICKNAME_LENGTH_MIN = 3;
  public static readonly NICKNAME_LENGTH_MAX = 16;

  public static readonly BIO_LENGTH_MIN = 1;
  public static readonly BIO_LENGTH_MAX = 300;

  public static readonly COLOR = ["red", "blue", "green", "yellow", "orange", "purple", "pink"];

  public static readonly IDENTIFIER_LENGTH_MIN: 1;
  public static readonly IDENTIFIER_LENGTH_MAX: 40;

  public static readonly EMAIL_LENGTH_MIN = 1;
  public static readonly EMAIL_LENGTH_MAX = 255;

  public static readonly AVATAR_CONTENT_TYPE = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  public static readonly BACKGROUND_CONTENT_TYPE = ["image/jpeg", "image/png", "image/gif", "image/webp"];
}

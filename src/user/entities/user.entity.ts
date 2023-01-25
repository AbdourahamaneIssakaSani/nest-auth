import mongoose, { Model } from 'mongoose';
import * as argon from 'argon2';
import * as crypto from 'crypto';

/**
 * @interface IUser - represents the structure of a User object
 */
export interface IUser {
  /* User's full name */
  name: string;
  /* User's email address */
  email: string;
  /* User's profile picture */
  picture: string;
  /* User's role within the application */
  role: string;
  /* Indicates if the user is active or not */
  active: boolean;
  /* User's hashed password */
  password: string;
  /* Confirmation of the user's password */
  passwordConfirm: string;
  /* Timestamp of the last password change */
  passwordChangedAt: number;
  /* Token used for resetting the password */
  passwordResetToken: string;
  /* Expiration date of the password reset token */
  passwordResetTokenExpires: number;
}

/**
 * @interface IUserMethods - represents the methods that can be added to a User model.
 */
export interface IUserMethods {
  /**
   * Verify if the provided password matches the hashed password stored in the database.
   * @param {string} candidatePassword - The plain text password provided by the user.
   * @returns {Promise<boolean>}  True if the passwords match, false otherwise.
   * */
  verifyPassword(candidatePassword: string): Promise<boolean>;

  /**
   * Method to check if the password has been changed after the JWT token was issued.
   * @param {Number} JWTTimestamp - Timestamp of when the JWT token was issued
   * @returns {Boolean} - Returns true if password was changed after the token was issued, false otherwise
   */
  changedPasswordAfter(jwtTimestamp: number): boolean;

  /**
   * Generates a reset password token and saves it to the user's document.
   * @returns {String} - The plaintext reset token
   */
  createPasswordResetToken(): string;
}

/**
 * @type UserModel - represents the Mongoose Model of a User, with the interface IUser as the schema and the IUserMethods as the additional instance methods.
 */
export type UserModel = Model<IUser, object, IUserMethods>;

export const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    unique: true, //TODO: "Email address already exist!" message
  },
  picture: {
    type: String,
    default:
      'http://images.fineartamerica.com/images-medium-large/alien-face-.jpg',
  },
  role: {
    type: String,
    enum: ['tourist', 'guide', 'lead-guide', 'admin'],
    default: 'tourist',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (pwdConfirm: string) {
        return pwdConfirm === this.password;
      },
    },
  },
  passwordChangedAt: {
    type: Number,
    default: Date.now(),
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpires: {
    type: Number,
  },
});

/* Middlewares */

// DOCUMENT MIDDLEWARE

/**
 * Hashes the password before save()
 */
UserSchema.pre('save', async function (next) {
  // if the password is not new, skip this middleware
  if (!this.isModified('password')) return next();

  this.password = await argon.hash(this.password);
  //   no need to save this
  this.passwordConfirm = undefined;
  next();
});

/**
 * @pre ('save') middleware function that catches the time of when the password was changed
 */
UserSchema.pre('save', async function (next) {
  // only update the passwordChangedAt field if the password is being modified
  if (!this.isModified('password')) return next();
  this.passwordChangedAt = Date.now();
  next();
});

// INSTANCE METHODS DEFINITION

UserSchema.method(
  'verifyPassword',
  async function verifyPassword(candiatePassword: string) {
    return argon.verify(this.password, candiatePassword);
  },
);

UserSchema.method(
  'changedPasswordAfter',
  function changedPasswordAfter(JWTTimestamp: number) {
    return JWTTimestamp < Number(this.passwordChangedAt / 1000);
  },
);

UserSchema.method(
  'createResetPasswordToken',
  function createResetPasswordToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // hash the token for added security and save it to the user's document
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetTokenExpires = Date.now() + 60 * 1000 * 10; // date now + 10min

    return resetToken;
  },
);

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Auth } from './Auth.Models';

const loginSchema = new mongoose.Schema({
  loginIdentifier: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

loginSchema.statics.authenticate = async function(loginIdentifier, password) {
      let user;
    
      // Check if loginIdentifier is an email address
      if (loginIdentifier.includes('@')) {
        user = await Auth.findOne({ email: loginIdentifier });
      } else {
        // Check if loginIdentifier is a phone number
        user = await Auth.findOne({ phone: loginIdentifier });
      }
    
      if (!user) {
        throw new Error('User not found');
      }
    
      // Verify password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new Error('Incorrect password');
      }
    
      return user;
    };


const Login = mongoose.model('Login', loginSchema);

export { Login };

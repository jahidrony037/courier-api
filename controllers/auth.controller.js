import dotenv from 'dotenv';
import User from '../models/User.model.js';
import generateToken from '../utils/generateToken.js';
dotenv.config();

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password, role });
    // console.log("user data: ", user);
    
    const savedUser = await user.save();
    // console.log("savedUser: ", savedUser);

    // Create token only if user was saved successfully
    if (savedUser && savedUser._id) {
      // Check if JWT_SECRET exists
      if (!process.env.JWT_SECRET) {
        console.error("Missing JWT_SECRET in environment variables");
        return res.status(500).json({ message: "Server configuration error" });
      }

      try {
        const token = generateToken(savedUser);
        return res.status(201).json({
          token,
          user: {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
          },
        });
      } catch (tokenError) {
        console.error('Token generation error:', tokenError);
        return res.status(500).json({ message: "Failed to generate authentication token" });
      }
    } else {
      return res.status(500).json({ message: "Failed to save user" });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid credentials' });

    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = generateToken(user);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message });
  }
};

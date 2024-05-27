const User = require('../models/userModel');

async function addUser(userData) {
  try {
    userData.roles = ['client'];
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    

    savedUser.id = savedUser._id.toString();
    
    return savedUser;
  } catch (error) {
    throw error;
  }
}


async function checkUserExistence(userId, email) {
  try {
      const user = await User.findOne({ userId, email });
      return !!user;
  } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
  }
}

async function getUser(userId) {
  try {
    const user = await User.findOne({ userId: userId });
    
    return user; 
   
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false; 
  }
}

async function getUsers() {
  try {
    const user = await User.find();
    return user; 
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false; 
  }
}


const updateUser = async (userId, userData) => {
  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      throw new Error('User not found');
    }

   
    for (let key in userData) {
      if (userData.hasOwnProperty(key)) {
        if (key === 'preferences' && Array.isArray(userData[key])) {
          userData[key].forEach(updatedPref => {
            const existingPref = user.preferences.find(pref => pref.name === updatedPref.name);
            if (existingPref) {
              existingPref.preferences = updatedPref.preferences;
            } else {
              user.preferences.push(updatedPref);
            }
          });
        } else {
          user[key] = userData[key];
        }
      }
    }

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

async function updateUserAvatar(userId, avatarPath) {
  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      throw new Error('User not found');
    }

    user.avatar = avatarPath; // Update the avatar path

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    // Delete user and associated data
    await User.deleteOne({ _id: userId });
    console.log(`User with userId ${userId} and associated data deleted successfully.`);
    return true;
  } catch (error) {
    console.error('Error deleting user and associated data:', error);
    return false;
  }
}

async function addAdmin(userData) {
  try {
    userData.roles = ['admin'];
    const newAdmin = new User(userData);
    const savedAdmin = await newAdmin.save();
    

    savedAdmin.id = savedAdmin._id.toString();
    
    return savedAdmin;
  } catch (error) {
    throw error;
  }
}

module.exports = { addUser, checkUserExistence,getUser, getUsers,updateUser, updateUserAvatar,deleteUser, addAdmin };

const UserModel = require("../models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async create(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async save(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        return UserModel.find({}, 'first_name last_name email role');
    }

    async deleteInactiveUsers() {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const usersToDelete = await UserModel.find({ last_connection: { $lt: twoDaysAgo } });
        await UserModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });
        return usersToDelete;
    }
}

module.exports = UserRepository;
const { User, Thought } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async createUser(req, res) {
        try {
            const createUser = await User.create(req.body);
            res.json(createUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateUser(req, res) {
        try {
            const updateUser = await User.findOneAndUpdate(
                { _id: req.params.userid },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            res.json(updateUser);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            const deleteUser = await User.findOneAndDelete({ _id: req.params.userId });

            if (!deleteUser) {
                return res.status(404).json({ message: `That User/ID wasn't found.` });
            }
            res.json({ message: 'Deleted successfully!', user: deleteUser });
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userid },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );
            if (!user) {
                return res.status(404).json({ message: `That User/ID wasn't found.` });
            }
            res.json(user);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },
}
const { Thought, User } = require('../models');
const { Types } = require('mongoose');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID.' });
            }
            res.status(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { runValidators: true, new: true }
            );

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: `That thought wasn't found.` });
            }
            res.json(thought);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this ID.' });
            }
            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { runValidators: true, new: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'Thought deleted but no user with that ID.' });
            }
            res.json({ message: 'Thought from user deleted successfully.' });
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async addReaction(req, res) {
        try {
            const reaction = {
                reationId: new Types.ObjectId(),
                reactionBody: req.body.reactionBody,
                username: req.body.username,
                createdAt: new Date(),
            };
            const updatedThought = await Thought.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $addToSet: { reactions: reaction } },
                { runValidators: true, new: true }
            );

            if (!updatedThought) {
                return res.status(404).json({ message: 'No thought with this ID.' });
            }
            res.json(updatedThought);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async removeReaction(req, res) {
        try {
            const updatedThought = await Thought.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { reactioins: req.params.reactionId } },
                { runValidators: true, new: true }
            );

            if (!updatedThought) {
                return res.status(404).json({ message: 'No reaction with this ID.' });
            }
            res.json(updatedThought);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },
};
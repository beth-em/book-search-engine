import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { AuthenticationError } from 'apollo-server-express';

const resolvers = {
    // Me query to get user currently logged-in
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                const userData = await User.findById(context.user._id);
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        }
    },

    Mutation: {
        // Login mutation
        login: async (_parent: any, { email, password }: any) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("User not found");
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Wrong password...');
            }

            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },

        // Create user mutation
        addUser: async (_parent: any, args: any) => {
            const user = await User.create(args);
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },

        // Save a book to the user's savedBooks array
        saveBook: async (_parent: any, { input }: any, context: any) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        // Remove a book from the user's savedBooks array
        removeBook: async (_parent: any, { bookId }: any, context: any) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

export default resolvers;